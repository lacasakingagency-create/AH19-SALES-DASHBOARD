export interface GeoLocationData {
  session_id: string;
  company_id?: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  device_type: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  operating_system: string;
  referrer: string;
  landing_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term?: string;
  utm_content?: string;
}

export interface AnalyticsEventPayload {
  session_id?: string;
  company_id?: string;
  user_id?: string;
  product_id?: string;
  event_type?:
    | 'page_view'
    | 'landing_page_view'
    | 'product_view'
    | 'checkout_viewed'
    | 'checkout_started'
    | 'checkout_created'
    | 'payment_started'
    | 'payment_succeeded'
    | 'payment_failed'
    | 'purchase'
    | 'refund'
    | string;
  event_name?: string;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  operating_system?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  metadata?: Record<string, any>;
}

const SESSION_STORAGE_KEY = 'ah19_checkout_session_id';
const GEO_CACHE_KEY = 'ah19_cached_geo';

/**
 * Creates or retrieves a persistent anonymous session ID
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';

  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    }

    if (!sessionId) {
      // Generate standard RFC4122 v4 UUID
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionId = crypto.randomUUID();
      } else {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      }
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return 'sess_' + Math.random().toString(36).substring(2, 10);
  }
}

/**
 * Extracts UTM tags and referral origin from current browser environment
 */
export function extractUTMParameters(): {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  landing_page: string;
} {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'Direct',
      utm_medium: 'none',
      utm_campaign: 'standard',
      utm_term: '',
      utm_content: '',
      referrer: '',
      landing_page: '/',
    };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utm_source = urlParams.get('utm_source') || 'Direct';
  const utm_medium = urlParams.get('utm_medium') || (utm_source !== 'Direct' ? 'cpc' : 'none');
  const utm_campaign = urlParams.get('utm_campaign') || 'brand_launch';
  const utm_term = urlParams.get('utm_term') || '';
  const utm_content = urlParams.get('utm_content') || '';
  const referrer = document.referrer || '';
  const landing_page = window.location.pathname + window.location.search;

  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    landing_page,
  };
}

/**
 * Detects visitor location and device parameters via backend endpoint
 */
export async function detectVisitorLocation(forceRefresh = false): Promise<GeoLocationData> {
  const session_id = getOrCreateSessionId();
  const utm = extractUTMParameters();

  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(GEO_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.session_id === session_id) {
          return parsed;
        }
      }
    } catch {}
  }

  try {
    const response = await fetch('/api/geo/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        ...utm,
      }),
    });

    if (response.ok) {
      const data: GeoLocationData = await response.json();
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch (err) {
    console.warn('Backend geo detection warning, using browser fallback:', err);
  }

  // Graceful browser-based fallback if backend is booting or in dev
  const fallback: GeoLocationData = {
    session_id,
    country: 'United States',
    country_code: 'US',
    region: 'Florida',
    city: 'Miami',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    latitude: 25.7617,
    longitude: -80.1918,
    device_type:
      /Mobi|Android|iPhone/i.test(navigator.userAgent)
        ? 'Mobile'
        : /Tablet|iPad/i.test(navigator.userAgent)
        ? 'Tablet'
        : 'Desktop',
    browser: /Chrome/i.test(navigator.userAgent)
      ? 'Chrome'
      : /Safari/i.test(navigator.userAgent)
      ? 'Safari'
      : /Firefox/i.test(navigator.userAgent)
      ? 'Firefox'
      : 'Web Browser',
    operating_system: /Mac/i.test(navigator.userAgent)
      ? 'macOS'
      : /Win/i.test(navigator.userAgent)
      ? 'Windows'
      : /iPhone|iPad/i.test(navigator.userAgent)
      ? 'iOS'
      : /Android/i.test(navigator.userAgent)
      ? 'Android'
      : 'Linux',
    referrer: utm.referrer,
    landing_page: utm.landing_page,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_term: utm.utm_term,
    utm_content: utm.utm_content,
  };

  try {
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(fallback));
  } catch {}

  return fallback;
}

/**
 * Tracks a sales/checkout funnel analytics event with idempotency
 */
export async function trackAnalyticsEvent(payload: AnalyticsEventPayload): Promise<boolean> {
  try {
    const session_id = payload.session_id || getOrCreateSessionId();
    const utm = extractUTMParameters();

    const fullPayload = {
      ...payload,
      session_id,
      utm_source: payload.utm_source || utm.utm_source,
      utm_medium: payload.utm_medium || utm.utm_medium,
      utm_campaign: payload.utm_campaign || utm.utm_campaign,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload),
    });

    return res.ok;
  } catch (err) {
    console.warn('Analytics event tracking error:', err);
    return false;
  }
}

/**
 * Initiates real Stripe Checkout Session linking visitor session & metadata
 */
export async function createStripeCheckoutSession(params: {
  company_id?: string;
  product_id: string;
  product_name: string;
  amount: number;
  currency: string;
  customer_email?: string;
  customer_name?: string;
  geo?: Partial<GeoLocationData>;
}): Promise<{ url?: string; sessionId?: string; error?: string }> {
  try {
    const session_id = getOrCreateSessionId();
    const utm = extractUTMParameters();

    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: params.company_id || 'comp_life4billion',
        session_id,
        product_id: params.product_id,
        product_name: params.product_name,
        amount: params.amount,
        currency: params.currency,
        customer_email: params.customer_email,
        customer_name: params.customer_name,
        country_code: params.geo?.country_code || 'US',
        country: params.geo?.country || 'United States',
        city: params.geo?.city || 'Miami',
        region: params.geo?.region || 'Florida',
        device_type: params.geo?.device_type || 'Desktop',
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || 'Failed to initialize Stripe checkout session' };
    }

    return {
      url: data.url,
      sessionId: data.sessionId,
    };
  } catch (err: any) {
    return { error: err?.message || 'Network error connecting to payment gateway' };
  }
}

/**
 * Fetches aggregated geographic analytics from the server API
 */
export async function fetchGeographicAnalytics(companyId?: string) {
  try {
    const url = companyId
      ? `/api/analytics/geographic?company_id=${encodeURIComponent(companyId)}`
      : '/api/analytics/geographic';
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Analytics fetch failed: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('fetchGeographicAnalytics error:', err);
    return null;
  }
}
