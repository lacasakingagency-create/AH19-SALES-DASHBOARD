import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { detectLocationFromRequest } from './server/geoServer';
import {
  saveGeoSession,
  saveAnalyticsEvent,
  saveCheckoutSession,
  updateCheckoutSessionStatus,
  isStripeEventProcessed,
  recordStripeWebhookEvent,
  saveCompletedOrder,
  getGeographicAnalyticsSummary,
} from './server/supabaseServer';
import {
  createStripeCheckoutSession,
  constructStripeWebhookEvent,
} from './server/stripeServer';

const PORT = 3000;
const HOST = '0.0.0.0';

// Real-time SSE active subscribers
const sseClients = new Set<Response>();

function broadcastRealtimeOrder(order: any) {
  const message = `data: ${JSON.stringify({ type: 'NEW_ORDER', order })}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  });
}

async function startServer() {
  const app = express();

  // 1. Stripe Webhook route with RAW body parser (MUST come before express.json())
  app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
      const signature = req.headers['stripe-signature'] as string;
      const rawBody = req.body as Buffer;

      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature header' });
      }

      const event = constructStripeWebhookEvent(rawBody, signature);
      if (!event) {
        return res.status(400).json({ error: 'Invalid Stripe signature or webhook secret' });
      }

      // Idempotency: verify if event was already processed
      const alreadyProcessed = await isStripeEventProcessed(event.id);
      if (alreadyProcessed) {
        return res.json({ received: true, already_processed: true });
      }

      // Register event in stripe_webhook_events
      await recordStripeWebhookEvent(event);

      try {
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as any;
          const metadata = session.metadata || {};
          const companyId = metadata.company_id || 'comp_life4billion';

          // Update checkout_sessions status
          await updateCheckoutSessionStatus(session.id, 'completed');

          const completedOrder = await saveCompletedOrder({
            company_id: companyId,
            stripe_checkout_session_id: session.id,
            stripe_customer_id: session.customer,
            stripe_payment_intent_id: session.payment_intent,
            session_id: metadata.session_id,
            product_id: metadata.product_id,
            product_name: metadata.product_name,
            customer_name: session.customer_details?.name || 'Stripe Customer',
            customer_email: session.customer_details?.email || session.customer_email,
            amount: (session.amount_total || 0) / 100,
            currency: (session.currency || 'USD').toUpperCase(),
            status: 'Paid',
            country: metadata.country,
            country_code: metadata.country_code,
            region: metadata.region,
            city: metadata.city,
            device_type: metadata.device_type,
            utm_source: metadata.utm_source,
            utm_medium: metadata.utm_medium,
            utm_campaign: metadata.utm_campaign,
            purchased_at: new Date().toISOString(),
          });

          // Log purchase analytics event
          await saveAnalyticsEvent({
            company_id: companyId,
            session_id: metadata.session_id,
            event_type: 'purchase',
            country: metadata.country,
            country_code: metadata.country_code,
            region: metadata.region,
            city: metadata.city,
            device_type: metadata.device_type,
            utm_source: metadata.utm_source,
            metadata: {
              order_id: completedOrder.id,
              order_number: completedOrder.order_number,
              amount: completedOrder.amount,
              stripe_checkout_session_id: session.id,
            },
          });

          broadcastRealtimeOrder(completedOrder);
        } else if (event.type === 'payment_intent.succeeded') {
          const pi = event.data.object as any;
          await saveCompletedOrder({
            stripe_payment_intent_id: pi.id,
            status: 'Paid',
          });
        } else if (event.type === 'payment_intent.payment_failed') {
          const pi = event.data.object as any;
          await saveCompletedOrder({
            stripe_payment_intent_id: pi.id,
            status: 'Failed',
          });
          await saveAnalyticsEvent({
            event_type: 'payment_failed',
            metadata: {
              payment_intent_id: pi.id,
              error_message: pi.last_payment_error?.message || 'Payment failed',
            },
          });
        } else if (event.type === 'charge.refunded') {
          const charge = event.data.object as any;
          await saveCompletedOrder({
            stripe_payment_intent_id: charge.payment_intent,
            status: 'Refunded',
          });
          await saveAnalyticsEvent({
            event_type: 'refund',
            metadata: {
              charge_id: charge.id,
              amount_refunded: (charge.amount_refunded || 0) / 100,
            },
          });
        }

        return res.json({ received: true });
      } catch (err: any) {
        console.error('Webhook processing error:', err);
        return res.status(500).json({ error: err?.message || 'Webhook processing failed' });
      }
    }
  );

  // Standard JSON middleware for subsequent API routes
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AH19 Geographic Analytics & Commerce Server',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Geolocation Detection API
  app.post('/api/geo/detect', async (req: Request, res: Response) => {
    try {
      const geo = await detectLocationFromRequest(req);
      const sessionId = req.body.session_id || `sess_${Date.now()}`;
      const companyId = req.body.company_id || 'comp_life4billion';

      const sessionPayload = {
        session_id: sessionId,
        company_id: companyId,
        ...geo,
        referrer: req.body.referrer || '',
        landing_page: req.body.landing_page || '/',
        utm_source: req.body.utm_source || 'Direct',
        utm_medium: req.body.utm_medium || 'none',
        utm_campaign: req.body.utm_campaign || 'standard',
        utm_term: req.body.utm_term || '',
        utm_content: req.body.utm_content || '',
      };

      await saveGeoSession(sessionPayload);
      res.json(sessionPayload);
    } catch (err: any) {
      console.error('Geo detect error:', err);
      res.status(500).json({ error: 'Failed to detect geolocation' });
    }
  });

  // 3. Analytics Events Ingestion API
  app.post('/api/events', async (req: Request, res: Response) => {
    try {
      const eventPayload = req.body;
      if (!eventPayload.event_type && !eventPayload.event_name) {
        return res.status(400).json({ error: 'Missing event_type or event_name' });
      }

      await saveAnalyticsEvent(eventPayload);
      res.json({ success: true, timestamp: new Date().toISOString() });
    } catch (err: any) {
      console.error('Save event error:', err);
      res.status(500).json({ error: 'Failed to record event' });
    }
  });

  // 4. Create Stripe Checkout Session API
  app.post('/api/checkout/create-session', async (req: Request, res: Response) => {
    try {
      const {
        company_id,
        session_id,
        product_id,
        product_name,
        amount,
        currency,
        customer_email,
        customer_name,
        country_code,
        country,
        city,
        region,
        device_type,
        utm_source,
        utm_medium,
        utm_campaign,
      } = req.body;

      const targetCompanyId = company_id || 'comp_life4billion';

      const result = await createStripeCheckoutSession({
        companyId: targetCompanyId,
        sessionId: session_id || `sess_${Date.now()}`,
        productId: product_id || 'prod_ring',
        productName: product_name || 'Life4Billion Smart Product',
        amount: Number(amount) || 99.0,
        currency: currency || 'USD',
        customerEmail: customer_email,
        customerName: customer_name,
        countryCode: country_code || 'US',
        country: country || 'United States',
        city: city || 'Miami',
        region: region || 'Florida',
        deviceType: device_type || 'Desktop',
        utmSource: utm_source || 'Direct',
        utmMedium: utm_medium || 'none',
        utmCampaign: utm_campaign || 'brand_launch',
      });

      // Register checkout session in checkout_sessions table
      await saveCheckoutSession({
        company_id: targetCompanyId,
        session_id: session_id || `sess_${Date.now()}`,
        product_id: product_id || 'prod_ring',
        stripe_checkout_session_id: result.sessionId,
        amount: Number(amount) || 99.0,
        currency: currency || 'USD',
        status: 'open',
        metadata: {
          product_name,
          customer_email,
          country,
          city,
        },
      });

      // Record 'checkout_started' event
      await saveAnalyticsEvent({
        company_id: targetCompanyId,
        session_id,
        event_type: 'checkout_started',
        country,
        country_code,
        region,
        city,
        device_type,
        utm_source,
        metadata: {
          product_id,
          amount,
          currency,
          checkout_session_id: result.sessionId,
        },
      });

      res.json(result);
    } catch (err: any) {
      console.error('Checkout creation error:', err);
      res.status(500).json({ error: err?.message || 'Checkout initialization failed' });
    }
  });

  // 5. Geographic Analytics Aggregation API (with multi-tenant company filter)
  app.get('/api/analytics/geographic', async (req: Request, res: Response) => {
    try {
      const companyId = (req.query.company_id as string) || undefined;
      const summary = await getGeographicAnalyticsSummary(companyId);
      res.json(summary);
    } catch (err: any) {
      console.error('Analytics aggregation error:', err);
      res.status(500).json({ error: 'Failed to retrieve analytics summary' });
    }
  });

  // 6. Test Simulation: Trigger an end-to-end purchase flow instantly
  app.post('/api/test/simulate-sale', async (req: Request, res: Response) => {
    try {
      const {
        country = 'United States',
        country_code = 'US',
        city = 'Miami',
        region = 'Florida',
        amount = 149.0,
        currency = 'USD',
        product_name = 'Life4Billion Smart Ring Gen 4',
        customer_name = 'Demo Buyer',
        customer_email = 'buyer@demo.com',
        device_type = 'Mobile',
        traffic_source = 'Meta Ads',
      } = req.body;

      const newOrder = await saveCompletedOrder({
        country,
        country_code,
        city,
        region,
        amount,
        currency,
        product_name,
        customer_name,
        customer_email,
        device_type,
        traffic_source,
        utm_source: traffic_source.toLowerCase().replace(/\s+/g, '_'),
        purchased_at: new Date().toISOString(),
      });

      // Also record purchase analytics event
      await saveAnalyticsEvent({
        session_id: newOrder.session_id,
        event_type: 'purchase',
        country,
        country_code,
        region,
        city,
        device_type,
        utm_source: newOrder.utm_source,
        metadata: {
          order_id: newOrder.id,
          order_number: newOrder.order_number,
          amount,
        },
      });

      // Push real-time event to active clients
      broadcastRealtimeOrder(newOrder);

      res.json({ success: true, order: newOrder });
    } catch (err: any) {
      console.error('Simulate sale error:', err);
      res.status(500).json({ error: 'Simulation failed' });
    }
  });

  // 7. Realtime SSE Stream
  app.get('/api/realtime/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    sseClients.add(res);

    // Initial greeting ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', time: Date.now() })}\n\n`);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // ============================================================
  // Vite Middleware & Static Serving
  // ============================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`AH19 Full-Stack Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
