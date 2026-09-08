-- ==============================================================================
-- AH19 COMMERCE OS — SUPABASE DATABASE SCHEMA
-- Geographic Analytics, Checkout Funnel, and Stripe Order Tracking
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. GEOGRAPHIC VISITOR SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.geo_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    country TEXT,
    country_code VARCHAR(3),
    region TEXT,
    city TEXT,
    timezone TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    device_type VARCHAR(20) DEFAULT 'Desktop',
    browser VARCHAR(60),
    operating_system VARCHAR(60),
    referrer TEXT,
    landing_page TEXT,
    utm_source TEXT DEFAULT 'Direct',
    utm_medium TEXT DEFAULT 'none',
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ANALYTICS FUNNEL EVENTS TABLE (IDEMPOTENT EVENT LOG)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT,
    product_id TEXT,
    event_type TEXT NOT NULL CHECK (
        event_type IN (
            'page_view',
            'checkout_viewed',
            'checkout_started',
            'payment_started',
            'payment_succeeded',
            'payment_failed',
            'purchase'
        )
    ),
    country TEXT,
    country_code VARCHAR(3),
    region TEXT,
    city TEXT,
    device_type VARCHAR(20),
    browser VARCHAR(60),
    operating_system VARCHAR(60),
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS & SALES TABLE (LINKED WITH STRIPE & GEOGRAPHIC CONTEXT)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    session_id TEXT,
    product_id TEXT,
    product_name TEXT,
    customer_name TEXT,
    customer_email TEXT,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(4) DEFAULT 'USD',
    status VARCHAR(30) DEFAULT 'Paid',
    payment_method VARCHAR(50) DEFAULT 'Stripe',
    stripe_customer_id TEXT,
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    country TEXT,
    country_code VARCHAR(3),
    region TEXT,
    city TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    device_type VARCHAR(20) DEFAULT 'Desktop',
    traffic_source TEXT DEFAULT 'Direct',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. STRIPE WEBHOOK AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.stripe_webhook_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT ANALYTICS AGGREGATION & REPORTING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_geo_sessions_session_id ON public.geo_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_geo_sessions_country ON public.geo_sessions(country_code);
CREATE INDEX IF NOT EXISTS idx_geo_sessions_created ON public.geo_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_session ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_country ON public.analytics_events(country_code);

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_country_code ON public.orders(country_code);
CREATE INDEX IF NOT EXISTS idx_orders_city ON public.orders(city);
CREATE INDEX IF NOT EXISTS idx_orders_purchased_at ON public.orders(purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON public.orders(session_id);

-- ==============================================================================
-- AUTOMATIC TIMESTAMP UPDATER TRIGGER
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_geo_sessions_updated_at ON public.geo_sessions;
CREATE TRIGGER trigger_geo_sessions_updated_at
    BEFORE UPDATE ON public.geo_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.geo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_logs ENABLE ROW LEVEL SECURITY;

-- 1. Service Role has Full Access
CREATE POLICY "Service role full access on geo_sessions"
    ON public.geo_sessions FOR ALL
    TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on analytics_events"
    ON public.analytics_events FOR ALL
    TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on orders"
    ON public.orders FOR ALL
    TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on stripe_webhook_logs"
    ON public.stripe_webhook_logs FOR ALL
    TO service_role USING (true) WITH CHECK (true);

-- 2. Authenticated Dashboard Users can read analytics
CREATE POLICY "Authenticated users can read orders"
    ON public.orders FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Authenticated users can read geo_sessions"
    ON public.geo_sessions FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Authenticated users can read analytics_events"
    ON public.analytics_events FOR SELECT
    TO authenticated USING (true);

-- 3. Anonymous Visitors can log sessions and events (Insert-only)
CREATE POLICY "Public insert geo_sessions"
    ON public.geo_sessions FOR INSERT
    TO anon WITH CHECK (true);

CREATE POLICY "Public insert analytics_events"
    ON public.analytics_events FOR INSERT
    TO anon WITH CHECK (true);

-- ==============================================================================
-- SUPABASE REALTIME REPLICATION (For instant live sales updates in dashboard)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
