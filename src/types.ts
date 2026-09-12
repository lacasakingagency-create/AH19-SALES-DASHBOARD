export type DateFilterRange =
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | '7d'
  | '14d'
  | 'this_month'
  | 'last_month'
  | '30d'
  | '90d'
  | '3_months'
  | '6_months'
  | 'this_year'
  | 'last_year'
  | '12_months'
  | 'specific_year'
  | 'specific_month'
  | 'specific_week'
  | 'specific_day'
  | 'custom';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'BRL';
export type CurrencyCode = Currency;

export type TimeRange = 'today' | 'yesterday' | '7D' | '30D' | '90D' | '1Y' | 'ALL';

export type StoreId = 'all' | 'us-store' | 'eu-store' | 'wholesale';

export type DataMode = 'demo' | 'live';

export type Language = 'pt' | 'en';

export type MainNavId =
  | 'onboarding'
  | 'dashboard'
  | 'overview'
  | 'sales'
  | 'customers'
  | 'products'
  | 'finances'
  | 'reports'
  | 'marketing'
  | 'countries'
  | 'analytics'
  | 'geo-analytics'
  | 'integrations'
  | 'ai-insights'
  | 'settings';

export type NavTabId = MainNavId;
export type AdCampaignItem = CampaignItem;
export type AdCreativeItem = CreativeItem;
export type EventItem = EventStreamItem;

export interface KPIData {
  id: string;
  name: string;
  value: string;
  rawNumericValue: number;
  change: string;
  changeValue: number;
  isPositive: boolean;
  isNeutral?: boolean;
  period: string;
  sparkline: number[];
  color: string;
  category: 'revenue' | 'profit' | 'ad_spend' | 'roas' | 'orders';
}

export interface ChartDataPoint {
  date: string;
  revenue: number;
  profit: number;
  spend: number;
  orders: number;
  aov: number;
  refunds: number;
  discounts: number;
  taxes: number;
  shipping: number;
}

export interface CountrySale {
  name: string;
  code: string;
  flag: string;
  amount: string;
  rawAmount: number;
  orders: number;
  aov: number;
  adSpend: number;
  roas: number;
  profit: number;
  conversionRate: number;
  percentage: number;
  color: string;
  coordinates: [number, number]; // [x %, y %]
  states: { name: string; revenue: number; orders: number }[];
  topCities: { name: string; revenue: number }[];
  topProducts: { name: string; sales: number }[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  country: string;
  countryCode: string;
  flag: string;
  amount: string;
  rawAmount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  itemsCount: number;
  items: {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  status: 'Paid' | 'Pending' | 'Cancelled' | 'Refunded' | 'Failed';
  paymentMethod: 'Credit Card' | 'PayPal' | 'Apple Pay' | 'Shop Pay' | 'Klarna' | 'Pix' | 'Stripe';
  storeId: StoreId;
  date: string;
  time: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  trafficSource: 'Meta Ads' | 'Google Ads' | 'TikTok Ads' | 'Organic Search' | 'Direct' | 'Email';
  campaign: string;
  utm?: {
    source: string;
    medium: string;
    campaign: string;
    content?: string;
    term?: string;
  };
}

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock?: number;
  unitsSold: number;
  revenue: number;
  profit: number;
  margin: number;
  ordersCount: number;
  aov: number;
  conversionRate: number;
  topCountries: { country: string; flag: string; share: number }[];
  trafficSources: { source: string; share: number }[];
  campaigns: string[];
  salesTrend: { date: string; units: number; revenue: number }[];
}

export interface TransactionItem {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  dueDate: string;
  status: 'settled' | 'pending' | 'cancelled';
  paymentMethod: string;
  reference?: string;
}

export interface OnboardingResponses {
  products: string[];
  customProduct?: string;
  niche: string;
  customNiche?: string;
  channels: string[];
  customChannel?: string;
  strategy: string;
  adChannels?: string[];
  customAdChannel?: string;
  organicChannels?: string[];
  customOrganicChannel?: string;
  goal: string;
  stage: string;
  completedAt?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatar?: string;
  auth_provider?: 'google' | 'email';
  company_id?: string;
  phone?: string;
  onboarding_completed?: boolean;
  onboarding_data?: OnboardingResponses;
}

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  countryCode: string;
  flag: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  ltv: number;
  aov: number;
  firstOrderDate: string;
  lastPurchaseDate: string;
  status: 'active' | 'vip' | 'at-risk' | 'churned';
  acquisitionSource: string;
  firstTouchCampaign: string;
  lastTouchCampaign: string;
  orders: {
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    itemsSummary: string;
    status: string;
  }[];
  journey: {
    date: string;
    event: string;
    details: string;
    channel: string;
  }[];
}

export interface RefundItem {
  id: string;
  refundNumber: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  reason: 'Item Defective' | 'Wrong Size' | 'Late Delivery' | 'Customer Changed Mind' | 'Fraud Alert';
  status: 'Approved' | 'Processing' | 'Declined';
  date: string;
  storeId: StoreId;
}

export interface AdPlatformMetric {
  id: 'meta' | 'google' | 'tiktok';
  name: string;
  spend: string;
  rawSpend: number;
  revenue: string;
  rawRevenue: number;
  roas: string;
  roasNumber: number;
  cpa: string;
  rawCpa: number;
  cpc: string;
  ctr: string;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'optimal' | 'scaling' | 'review';
  isConnected: boolean;
}

export interface CampaignItem {
  id: string;
  platform: 'meta' | 'google' | 'tiktok';
  name: string;
  status: 'Active' | 'Paused' | 'Learning' | 'Draft';
  objective: 'Conversions' | 'Catalog Sales' | 'Traffic' | 'Brand Awareness';
  budget: number;
  budgetType: 'Daily' | 'Lifetime';
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
  adSetsCount: number;
  adsCount: number;
  adSets: AdSetItem[];
}

export interface AdSetItem {
  id: string;
  campaignId: string;
  name: string;
  status: 'Active' | 'Paused';
  targeting: string;
  budget: number;
  spend: number;
  conversions: number;
  cpa: number;
  roas: number;
  ads: AdItem[];
}

export interface AdItem {
  id: string;
  adSetId: string;
  name: string;
  format: 'Video' | 'Image' | 'Carousel';
  status: 'Active' | 'Paused';
  spend: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpa: number;
  roas: number;
  creativeId: string;
}

export interface CreativeItem {
  id: string;
  title: string;
  thumbnail: string;
  format: 'Video (9:16)' | 'Video (1:1)' | 'Image' | 'Carousel';
  platform: 'Meta Ads' | 'TikTok Ads' | 'Google Ads';
  campaignName: string;
  spend: number;
  ctr: number;
  cpc: number;
  purchases: number;
  cpa: number;
  revenue: number;
  roas: number;
  hookRate: string;
  holdRate: string;
  fatigueStatus: 'Fresh' | 'Scaling' | 'Fatiguing' | 'Exhausted';
  tags: string[];
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  formattedCount: string;
  percentageOfTop: number;
  dropOffRate: number;
  mobileRate: number;
  desktopRate: number;
  topDropoffReason: string;
}

export interface CustomerJourneyStage {
  id: string;
  stepNumber: number;
  label: string;
  sublabel: string;
  count: number;
  formattedCount: string;
  percentageOfTop: number;
  conversionFromPrev: number;
  dropOffRate: number;
  dropOffCount: number;
  revenue?: number;
  avgOrderValue?: number;
  mobileRate: number;
  desktopRate: number;
  topDropoffReason: string;
  insight: string;
  actionableRecommendation: string;
  iconName: 'users' | 'eye' | 'shopping-cart' | 'credit-card' | 'check-circle' | 'repeat';
}

export interface AttributionModelComparison {
  channel: string;
  firstTouch: number;
  lastTouch: number;
  linear: number;
  positionBased: number;
  revenueShare: number;
}

export interface UTMRecord {
  id: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  clicks: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  roas: number;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'connecting' | 'available' | 'error';
  pixelId?: string;
  eventsToday: number;
  lastSync: string;
  eventHealth: 'Optimal (100%)' | 'Healthy (98.4%)' | 'Needs Attention' | 'Offline';
  eventsTracked: { name: string; active: boolean; count: number }[];
  iconKey: 'shopify' | 'meta' | 'google' | 'ga4' | 'tiktok' | 'gtm' | 'klaviyo' | 'stripe' | 'amazon' | 'webhook';
  description: string;
}

export interface EventStreamItem {
  id: string;
  eventName: 'Purchase' | 'AddToCart' | 'InitiateCheckout' | 'ViewContent' | 'PageVisit' | 'Lead';
  platform: 'Meta Pixel & CAPI' | 'Google Ads' | 'TikTok Events API' | 'GA4';
  status: 'Received' | 'Processed' | 'Deduplicated' | 'Warning' | 'Error';
  timestamp: string;
  timeAgo: string;
  sourceUrl: string;
  device: 'Mobile (iOS)' | 'Mobile (Android)' | 'Desktop (Mac)' | 'Desktop (Win)';
  country: string;
  flag: string;
  orderId?: string;
  value?: number;
  currency: string;
  eventId: string;
  fbp?: string;
  fbc?: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
  errorMessage?: string;
}

export interface AIInsightItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: 'growth' | 'channel' | 'warning' | 'strategy';
  category: 'overview' | 'revenue' | 'marketing' | 'countries' | 'products' | 'alerts';
  impact: string;
  timestamp: string;
  sourceData: string;
  dateRange: string;
  reason: string;
  actionLabel: string;
  actionType: 'navigate' | 'filter' | 'modal' | 'toast';
  actionTarget: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
  linkTarget?: {
    nav: MainNavId;
    tab?: string;
    id?: string;
  };
}

export interface AppSettings {
  account: {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
    company: string;
  };
  stores: {
    id: StoreId;
    name: string;
    url: string;
    currency: Currency;
    timezone: string;
    active: boolean;
  }[];
  currency: Currency;
  timezone: string;
  notifications: {
    emailAlerts: boolean;
    roasDropWarning: boolean;
    cpaSpikeThreshold: number;
    dailyDigest: boolean;
    pixelErrorImmediateAlert: boolean;
  };
  team: {
    id: string;
    name: string;
    email: string;
    role: 'Owner' | 'Admin' | 'Analyst' | 'Media Buyer';
    lastActive: string;
  }[];
  dataSources: {
    shopifyApiKey: string;
    metaAccessToken: string;
    googleAdsCustomerId: string;
    tiktokAccessToken: string;
    geminiApiKeyStatus: 'Configured' | 'Default';
  };
}
