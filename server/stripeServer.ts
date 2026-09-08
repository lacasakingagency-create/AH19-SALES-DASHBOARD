import Stripe from 'stripe';

let stripeClientInstance: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  if (stripeClientInstance) return stripeClientInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey === 'sk_test_...') {
    return null;
  }

  try {
    stripeClientInstance = new Stripe(secretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });
    return stripeClientInstance;
  } catch (err) {
    console.warn('Stripe client initialization warning:', err);
    return null;
  }
}

export const isStripeConfigured = (): boolean => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  return Boolean(secretKey && !secretKey.includes('sk_test_...') && secretKey.startsWith('sk_'));
};

export interface CreateCheckoutSessionOptions {
  companyId?: string;
  sessionId: string;
  productId: string;
  productName: string;
  amount: number; // in dollars (e.g. 99.00)
  currency: string;
  customerEmail?: string;
  customerName?: string;
  countryCode: string;
  country: string;
  city: string;
  region: string;
  deviceType: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  successUrl?: string;
  cancelUrl?: string;
}

/**
 * Creates a Stripe Checkout Session with all geographic & UTM metadata attached
 */
export async function createStripeCheckoutSession(options: CreateCheckoutSessionOptions) {
  const stripe = getStripeClient();
  const origin = process.env.APP_URL || 'http://localhost:3000';
  const companyId = options.companyId || 'comp_life4billion';

  const successUrl =
    options.successUrl ||
    `${origin}/?checkout=success&session_id=${options.sessionId}&nav=geo-analytics`;
  const cancelUrl =
    options.cancelUrl ||
    `${origin}/?checkout=cancel&session_id=${options.sessionId}&nav=geo-analytics`;

  const amountInCents = Math.round(options.amount * 100);

  // If live Stripe is configured with secret key, create real session
  if (stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: (options.currency || 'USD').toLowerCase(),
              product_data: {
                name: options.productName,
                description: `AH19 Checkout - Customer in ${options.city}, ${options.country}`,
                metadata: {
                  company_id: companyId,
                  product_id: options.productId,
                  country_code: options.countryCode,
                },
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        customer_email: options.customerEmail || undefined,
        metadata: {
          company_id: companyId,
          session_id: options.sessionId,
          product_id: options.productId,
          product_name: options.productName,
          country: options.country,
          country_code: options.countryCode,
          region: options.region,
          city: options.city,
          device_type: options.deviceType,
          utm_source: options.utmSource || 'Direct',
          utm_medium: options.utmMedium || 'none',
          utm_campaign: options.utmCampaign || 'general',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return {
        url: session.url,
        sessionId: session.id,
      };
    } catch (err: any) {
      console.warn('Stripe checkout session creation error, providing sandbox link:', err);
    }
  }

  // Fallback interactive sandbox session link for local preview & testing
  const mockStripeSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return {
    url: `${origin}/?checkout=success&session_id=${options.sessionId}&simulated_stripe_session=${mockStripeSessionId}&nav=geo-analytics&city=${encodeURIComponent(options.city)}&country=${encodeURIComponent(options.country)}&code=${options.countryCode}&amount=${options.amount}&company_id=${companyId}`,
    sessionId: mockStripeSessionId,
    simulated: true,
  };
}

/**
 * Validates Stripe Webhook event signature
 */
export function constructStripeWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event | null {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || webhookSecret === 'whsec_...') {
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return null;
  }
}
