import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  Percent,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  X,
  ArrowUpRight,
  Filter,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
} from 'lucide-react';
import worldMapGeoImage from '../assets/images/world_map_geo_1789250387618.jpg';
import { CustomerJourneyFunnel } from '../components/CustomerJourneyFunnel';
import { CustomerJourneyStage } from '../types';
import { useApp } from '../context/AppContext';
import {
  detectVisitorLocation,
  createStripeCheckoutSession,
  GeoLocationData,
} from '../services/geoTrackingService';
import { subscribeToOrders } from '../services/supabaseClient';

interface GeoCountryStat {
  country: string;
  country_code: string;
  visitors: number;
  checkouts: number;
  purchases: number;
  revenue: number;
  conversion_rate: string;
  flag: string;
  latitude: number;
  longitude: number;
}

interface GeoCityStat {
  city: string;
  region: string;
  country: string;
  country_code: string;
  visitors: number;
  checkouts: number;
  purchases: number;
  revenue: number;
  latitude: number;
  longitude: number;
}

interface TrafficSourceStat {
  source: string;
  visits: number;
  checkouts: number;
  purchases: number;
  revenue: number;
}

interface DeviceStat {
  device: string;
  purchases: number;
  revenue: number;
  share: number;
}

interface LiveOrder {
  id: string;
  order_number: string;
  product_name: string;
  customer_name: string;
  amount: number;
  currency: string;
  country: string;
  country_code: string;
  city: string;
  device_type: string;
  traffic_source: string;
  purchased_at: string;
}

type MapMetric = 'visitors' | 'checkouts' | 'purchases' | 'revenue';
type DateRangeOption = 'today' | 'yesterday' | '7d' | '30d' | 'this_month' | 'custom';

export const GeographicAnalyticsPage: React.FC = () => {
  const { language, formatCurrency } = useApp();
  const isPt = language === 'pt';

  // Date Range State
  const [dateRange, setDateRange] = useState<DateRangeOption>('7d');
  const [mapMetric, setMapMetric] = useState<MapMetric>('revenue');

  // Loading & Data States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<GeoCountryStat | null>(null);

  // Aggregated Data States
  const [kpis, setKpis] = useState({
    totalVisitors: 48920,
    totalCheckouts: 4210,
    totalPurchases: 1428,
    totalRevenue: 189420.0,
    conversionRate: '2.92%',
  });

  const [countries, setCountries] = useState<GeoCountryStat[]>([]);
  const [cities, setCities] = useState<GeoCityStat[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSourceStat[]>([]);
  const [devices, setDevices] = useState<DeviceStat[]>([]);
  const [recentSales, setRecentSales] = useState<LiveOrder[]>([]);

  // Simulation & Checkout Sandbox Modal State
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simCity, setSimCity] = useState('Miami');
  const [simCountry, setSimCountry] = useState('United States');
  const [simCode, setSimCode] = useState('US');
  const [simAmount, setSimAmount] = useState(99.0);
  const [simProduct, setSimProduct] = useState('Life4Billion Smart Health Ring Gen 4');
  const [simSource, setSimSource] = useState('Meta Ads');
  const [simSuccessToast, setSimSuccessToast] = useState<string | null>(null);
  const [mapImageExpanded, setMapImageExpanded] = useState(false);

  // Fetch geographic summary from API
  const fetchAnalytics = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch('/api/analytics/geographic');
      if (res.ok) {
        const data = await res.json();
        if (data.kpis) setKpis(data.kpis);
        if (data.countries) setCountries(data.countries);
        if (data.cities) setCities(data.cities);
        if (data.trafficSources) setTrafficSources(data.trafficSources);
        if (data.devices) setDevices(data.devices);
        if (data.recentSales) setRecentSales(data.recentSales);
      }
    } catch (err) {
      console.warn('Analytics fetch notice:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // 1. Subscribe to Supabase Realtime Orders
    const unsubscribeSupabase = subscribeToOrders((newOrder) => {
      setRecentSales((prev) => [newOrder, ...prev.slice(0, 14)]);
      fetchAnalytics();
    });

    // 2. Subscribe to SSE stream for live updates
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_ORDER' && payload.order) {
            setRecentSales((prev) => [payload.order, ...prev.slice(0, 14)]);
            fetchAnalytics();
          }
        } catch {}
      };
    } catch {}

    return () => {
      unsubscribeSupabase();
      if (eventSource) eventSource.close();
    };
  }, []);

  // Filtered/multiplier according to date range
  const multiplier = useMemo(() => {
    switch (dateRange) {
      case 'today': return 0.18;
      case 'yesterday': return 0.22;
      case '7d': return 1.0;
      case '30d': return 4.1;
      case 'this_month': return 3.4;
      default: return 1.0;
    }
  }, [dateRange]);

  const displayKpis = useMemo(() => {
    return {
      visitors: Math.round(kpis.totalVisitors * multiplier),
      checkouts: Math.round(kpis.totalCheckouts * multiplier),
      purchases: Math.round(kpis.totalPurchases * multiplier),
      revenue: Math.round(kpis.totalRevenue * multiplier),
      cvr: kpis.conversionRate,
    };
  }, [kpis, multiplier]);

  // Customer Journey Funnel Stages for Geographic View
  const geoFunnelStages: CustomerJourneyStage[] = useMemo(() => {
    const isFiltered = Boolean(selectedCountry);
    const targetVisitors = isFiltered
      ? Math.max(10, Math.round(selectedCountry!.visitors * multiplier))
      : displayKpis.visitors;
    const targetCheckouts = isFiltered
      ? Math.max(2, Math.round(selectedCountry!.checkouts * multiplier))
      : displayKpis.checkouts;
    const targetPurchases = isFiltered
      ? Math.max(1, Math.round(selectedCountry!.purchases * multiplier))
      : displayKpis.purchases;
    const targetRevenue = isFiltered
      ? Math.round(selectedCountry!.revenue * multiplier)
      : displayKpis.revenue;

    const viewsCount = Math.max(5, Math.round(targetVisitors * 0.582));
    const cartCount = Math.max(3, Math.round(targetVisitors * 0.162));
    const retentionCount = Math.max(1, Math.round(targetPurchases * 0.185));

    const countryCode = selectedCountry?.country_code || 'GLOBAL';

    let checkoutFriction = isPt
      ? 'Custos de frete internacional e cálculo de impostos de importação exibidos no checkout'
      : 'International shipping freight costs and duty tax estimation calculated at checkout';
    let paymentFriction = isPt
      ? 'Recusa de cartão por emissor bancário internacional ou ausência de método de pagamento nativo'
      : 'Card security decline on cross-border charge or absence of preferred local rails';

    if (countryCode === 'BR') {
      checkoutFriction = isPt
        ? 'Tentativa de parcelamento em cartão nacional ou busca por chave PIX com desconto'
        : 'Shoppers looking for interest-free installment options or instant PIX discount';
      paymentFriction = isPt
        ? 'Dificuldade com cartões sem habilitação internacional ativa (resolvido com PIX)'
        : 'Non-international enabled credit cards declining on international gateways';
    } else if (countryCode === 'US') {
      checkoutFriction = isPt
        ? 'Cálculo de imposto estadual (sales tax) de cada estado no passo final'
        : 'State sales tax rate calculated at the final review step';
      paymentFriction = isPt
        ? 'Abandono por preferência por Apple Pay / Shop Pay em 1 clique'
        : 'Abandonment due to friction when 1-click Apple Pay or Shop Pay is not selected';
    } else if (countryCode === 'DE') {
      checkoutFriction = isPt
        ? 'Consumidores alemães exigem confirmação explícita de política de devolução sem custo'
        : 'German consumers requiring explicit confirmation of free return policy';
      paymentFriction = isPt
        ? 'Preferência por pagamento faturado (Sofort / Klarna Rechnung) antes da cobrança no cartão'
        : 'Strong preference for invoice payment (Klarna / Sofort) over upfront credit card';
    } else if (countryCode === 'GB') {
      checkoutFriction = isPt
        ? 'Incerteza sobre prazos de entrega pós-Brexit e cálculo de VAT britânico'
        : 'Post-Brexit cross-border customs paperwork concerns and UK VAT breakdown';
    }

    const calcPct = (num: number, den: number, decimals = 1) => {
      if (den <= 0) return 0;
      return Number(((num / den) * 100).toFixed(decimals));
    };

    return [
      {
        id: 'visitors',
        stepNumber: 1,
        label: isPt ? 'Visitantes & Descoberta' : 'Discovery & Visitors',
        sublabel: isPt
          ? `Sessões originadas por anúncios e buscas em ${selectedCountry?.country || 'todos os países'}`
          : `Sessions driven by campaigns & organic traffic in ${selectedCountry?.country || 'all global markets'}`,
        count: targetVisitors,
        formattedCount: targetVisitors.toLocaleString(),
        percentageOfTop: 100,
        conversionFromPrev: 100,
        dropOffRate: 0,
        dropOffCount: 0,
        mobileRate: countryCode === 'BR' ? 82 : 73,
        desktopRate: countryCode === 'BR' ? 18 : 27,
        topDropoffReason: isPt
          ? 'Taxa de rejeição (bounce rate) inicial em tráfego de redes sociais'
          : 'Initial bounce rate on cold social traffic and ad creative clicks',
        insight: isPt
          ? 'Tempo médio de carregamento: 1.1s. Usuários engajam 2.1x mais quando o preço é exibido na moeda local.'
          : 'Average page load: 1.1s. 2.1x higher engagement when pricing is displayed in local currency.',
        actionableRecommendation: isPt
          ? 'Ative geolocalização IP para pré-selecionar a bandeira e moeda local na página inicial.'
          : 'Enable IP geolocation to auto-select local currency and regional shipping banner.',
        iconName: 'users',
      },
      {
        id: 'views',
        stepNumber: 2,
        label: isPt ? 'Visualização de Produtos' : 'Product Page Views',
        sublabel: isPt
          ? 'Navegação nas especificações técnicas, tabela de medidas e sensores'
          : 'Browsing technical specifications, sizing charts, and biometric sensors',
        count: viewsCount,
        formattedCount: viewsCount.toLocaleString(),
        percentageOfTop: calcPct(viewsCount, targetVisitors),
        conversionFromPrev: calcPct(viewsCount, targetVisitors),
        dropOffRate: Math.max(0, 100 - calcPct(viewsCount, targetVisitors)),
        dropOffCount: Math.max(0, targetVisitors - viewsCount),
        mobileRate: countryCode === 'BR' ? 80 : 71,
        desktopRate: countryCode === 'BR' ? 20 : 29,
        topDropoffReason: isPt
          ? 'Dúvida sobre a equivalência internacional de medidas do anel inteligente'
          : 'Sizing hesitation regarding international ring dimension standards',
        insight: isPt
          ? 'Usuários que assistem à demonstração dos sensores têm 2.4x mais intenção de compra.'
          : 'Users watching the biometric sensor demo video exhibit 2.4x higher intent.',
        actionableRecommendation: isPt
          ? 'Destaque o Kit Medidor Grátis enviado antes do anel definitivo com troca sem custos.'
          : 'Highlight Free Sizing Kit shipped ahead of ring with zero-cost size exchange guarantee.',
        iconName: 'eye',
      },
      {
        id: 'cart',
        stepNumber: 3,
        label: isPt ? 'Adição ao Carrinho' : 'Add to Cart',
        sublabel: isPt
          ? 'Seleção de acabamento (Ouro vs Preto) e adição ativa à sacola'
          : 'Finish selection (Gold vs Matte Black) and active item addition to cart',
        count: cartCount,
        formattedCount: cartCount.toLocaleString(),
        percentageOfTop: calcPct(cartCount, targetVisitors),
        conversionFromPrev: calcPct(cartCount, viewsCount),
        dropOffRate: Math.max(0, 100 - calcPct(cartCount, viewsCount)),
        dropOffCount: Math.max(0, viewsCount - cartCount),
        mobileRate: 68,
        desktopRate: 32,
        topDropoffReason: isPt
          ? 'Abandono para comparar opções no mercado ou aguardar cupons de desconto'
          : 'Cart abandonment for competitor comparison or hunting for promo coupons',
        insight: isPt
          ? 'Carrinhos contendo o anel + carregador rápido representam 42% do volume.'
          : 'Bundled carts (Ring + Fast Wireless Charger) represent 42% of volume.',
        actionableRecommendation: isPt
          ? 'Adicione barra de frete grátis restante ("Faltam $20 para Frete Expresso Internacional Grátis").'
          : 'Add dynamic free shipping progress bar ("Add $20 for Free Express International Shipping").',
        iconName: 'shopping-cart',
      },
      {
        id: 'checkout',
        stepNumber: 4,
        label: isPt ? 'Checkout Iniciado' : 'Initiated Checkout',
        sublabel: isPt
          ? 'Preenchimento de dados de entrega, endereço e seleção de frete'
          : 'Shipping address input, contact details, and freight carrier selection',
        count: targetCheckouts,
        formattedCount: targetCheckouts.toLocaleString(),
        percentageOfTop: calcPct(targetCheckouts, targetVisitors),
        conversionFromPrev: calcPct(targetCheckouts, cartCount),
        dropOffRate: Math.max(0, 100 - calcPct(targetCheckouts, cartCount)),
        dropOffCount: Math.max(0, cartCount - targetCheckouts),
        mobileRate: 64,
        desktopRate: 36,
        topDropoffReason: checkoutFriction,
        insight: isPt
          ? '63% dos abandonos de checkout acontecem no passo de cálculo de frete internacional.'
          : '63% of checkout drop-offs occur on the international shipping calculation step.',
        actionableRecommendation: isPt
          ? 'Ofereça modalidade DDP (Delivery Duty Paid) com frete expresso transparente sem surpresas.'
          : 'Provide transparent DDP (Delivery Duty Paid) shipping with all local taxes included.',
        iconName: 'credit-card',
      },
      {
        id: 'purchase',
        stepNumber: 5,
        label: isPt ? 'Vendas Concluídas' : 'Completed Purchases',
        sublabel: isPt
          ? 'Pagamentos processados e pedidos confirmados no banco de dados'
          : 'Payments successfully settled and orders registered in database',
        count: targetPurchases,
        formattedCount: targetPurchases.toLocaleString(),
        percentageOfTop: calcPct(targetPurchases, targetVisitors, 2),
        conversionFromPrev: calcPct(targetPurchases, targetCheckouts),
        dropOffRate: Math.max(0, 100 - calcPct(targetPurchases, targetCheckouts)),
        dropOffCount: Math.max(0, targetCheckouts - targetPurchases),
        revenue: targetRevenue,
        avgOrderValue: targetPurchases > 0 ? targetRevenue / targetPurchases : 132.6,
        mobileRate: 61,
        desktopRate: 39,
        topDropoffReason: paymentFriction,
        insight: isPt
          ? 'Taxa de aprovação via Apple Pay e Stripe Link é de 97.6% nesta geografia.'
          : 'Approval rate through Apple Pay and Stripe Link is 97.6% in this geography.',
        actionableRecommendation: isPt
          ? 'Ative carteiras digitais locais (Apple Pay, Google Pay, PIX, Klarna) para reduzir atrito.'
          : 'Activate local digital wallets (Apple Pay, Google Pay, PIX, Klarna) to maximize approval.',
        iconName: 'check-circle',
      },
      {
        id: 'retention',
        stepNumber: 6,
        label: isPt ? 'Recompra & Retenção (LTV)' : 'Repeat & Retention (LTV)',
        sublabel: isPt
          ? 'Clientes que compraram acessórios ou assinaram o serviço de IA em nuvem'
          : 'Customers who ordered extra accessories or subscribed to AH19 AI Health Cloud',
        count: retentionCount,
        formattedCount: retentionCount.toLocaleString(),
        percentageOfTop: calcPct(retentionCount, targetVisitors, 2),
        conversionFromPrev: calcPct(retentionCount, targetPurchases),
        dropOffRate: Math.max(0, 100 - calcPct(retentionCount, targetPurchases)),
        dropOffCount: Math.max(0, targetPurchases - retentionCount),
        mobileRate: 67,
        desktopRate: 33,
        topDropoffReason: isPt
          ? 'Falta de fluxo de e-mail e push onboarding nos primeiros 14 dias após a entrega'
          : 'Lack of onboarding push notifications & engagement emails within 14 days of delivery',
        insight: isPt
          ? 'Clientes que sincronizam métricas de sono no primeiro dia têm 3.2x maior LTV em 90 dias.'
          : 'Users syncing sleep telemetry on day one yield 3.2x higher 90-day lifetime value.',
        actionableRecommendation: isPt
          ? 'Dispare sequência pós-entrega com 30 dias grátis de AH19 Health Cloud e 15% off em acessórios.'
          : 'Automate post-delivery onboarding with 30-day free AH19 Health Cloud trial and 15% off accessories.',
        iconName: 'repeat',
      },
    ];
  }, [selectedCountry, displayKpis, multiplier, isPt]);

  const countriesList = useMemo(() => {
    return countries.map((c) => ({
      code: c.country_code,
      name: c.country,
      flag: c.flag,
    }));
  }, [countries]);

  const handleSelectCountryFromFunnel = (code: string) => {
    if (code === 'ALL') {
      setSelectedCountry(null);
    } else {
      const found = countries.find((c) => c.country_code === code);
      if (found) setSelectedCountry(found);
    }
  };

  // Handle Sandbox Simulated Sale
  const handleRunSimulation = async () => {
    try {
      const res = await fetch('/api/test/simulate-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: simCity,
          country: simCountry,
          country_code: simCode,
          amount: Number(simAmount),
          product_name: simProduct,
          traffic_source: simSource,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSimSuccessToast(
          isPt
            ? `Venda simulada com sucesso em ${simCity}, ${simCountry}! Atualizando mapa...`
            : `Sale simulated successfully in ${simCity}, ${simCountry}! Updating map...`
        );
        fetchAnalytics();
        setTimeout(() => setSimSuccessToast(null), 4500);
      }
    } catch {
      alert('Simulation error');
    }
  };

  // Handle Real Stripe Checkout Flow
  const handleLaunchStripeCheckout = async () => {
    try {
      const geo: Partial<GeoLocationData> = {
        city: simCity,
        country: simCountry,
        country_code: simCode,
        region: simCity,
      };

      const res = await createStripeCheckoutSession({
        product_id: 'prod_health_ring',
        product_name: simProduct,
        amount: Number(simAmount),
        currency: 'USD',
        geo,
      });

      if (res.url) {
        window.open(res.url, '_blank');
      } else if (res.error) {
        alert(res.error);
      }
    } catch (err: any) {
      alert(err.message || 'Stripe initialization failed');
    }
  };

  // Calculate coordinates for visual map points
  const mapPoints = useMemo(() => {
    return countries.map((c) => {
      // Simple Mercator projection mapping to 1000x500 SVG
      const x = ((c.longitude + 180) / 360) * 1000;
      const latRad = (c.latitude * Math.PI) / 180;
      const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
      const y = 250 - (mercN * 250) / Math.PI;

      let val = c.revenue;
      if (mapMetric === 'visitors') val = c.visitors;
      if (mapMetric === 'checkouts') val = c.checkouts;
      if (mapMetric === 'purchases') val = c.purchases;

      return {
        ...c,
        cx: Math.max(30, Math.min(970, x)),
        cy: Math.max(30, Math.min(470, y)),
        metricValue: val,
      };
    });
  }, [countries, mapMetric]);

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {simSuccessToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#141414] border border-[#FFD000] text-white shadow-2xl animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#FFD000] shrink-0" />
          <span className="text-sm font-semibold">{simSuccessToast}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl icon-badge-blend flex items-center justify-center shrink-0 shadow-lg">
            <Globe className="w-6 h-6 text-[#1A1A1A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {isPt ? 'Analytics Geográfico de Vendas & Checkout' : 'Geographic Sales & Checkout Analytics'}
              </h1>
              <span className="badge-gold-blend text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                REAL-TIME
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isPt
                ? 'Rastreamento ponta a ponta: Visitante → Checkout → Pagamento Stripe → Compra'
                : 'End-to-end tracking: Visitor → Checkout → Stripe Payment → Purchase'}
            </p>
          </div>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Time Filters */}
          <div className="flex items-center bg-[#141414] border border-[#262626] rounded-xl p-1 text-xs font-semibold text-neutral-300">
            <button
              onClick={() => setDateRange('today')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                dateRange === 'today' ? 'bg-[#FFD000] text-black font-extrabold shadow-sm' : 'hover:text-white'
              }`}
            >
              {isPt ? 'Hoje' : 'Today'}
            </button>
            <button
              onClick={() => setDateRange('yesterday')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                dateRange === 'yesterday' ? 'bg-[#FFD000] text-black font-extrabold shadow-sm' : 'hover:text-white'
              }`}
            >
              {isPt ? 'Ontem' : 'Yesterday'}
            </button>
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                dateRange === '7d' ? 'bg-[#FFD000] text-black font-extrabold shadow-sm' : 'hover:text-white'
              }`}
            >
              {isPt ? 'Últimos 7 dias' : 'Last 7 days'}
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                dateRange === '30d' ? 'bg-[#FFD000] text-black font-extrabold shadow-sm' : 'hover:text-white'
              }`}
            >
              {isPt ? 'Últimos 30 dias' : 'Last 30 days'}
            </button>
            <button
              onClick={() => setDateRange('this_month')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                dateRange === 'this_month' ? 'bg-[#FFD000] text-black font-extrabold shadow-sm' : 'hover:text-white'
              }`}
            >
              {isPt ? 'Este Mês' : 'This Month'}
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#FFD000] text-neutral-300 hover:text-white transition-all"
            title={isPt ? 'Atualizar dados' : 'Refresh analytics'}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FFD000]' : ''}`} />
          </button>

          {/* Test Sandbox Trigger */}
          <button
            onClick={() => setSimulatorOpen(true)}
            className="btn-gold-blend flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{isPt ? 'Simular Checkout & Venda' : 'Simulate Checkout & Sale'}</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* TOTAL VISITORS */}
        <div className="bg-[#0C0C0C] border border-[#1F1F1F] hover:border-[#FFD000]/40 rounded-2xl p-4 flex flex-col justify-between transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">
              {isPt ? 'Visitantes Totais' : 'Total Visitors'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center text-[#FFD000]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {displayKpis.visitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+14.8% vs. período ant.</span>
            </div>
          </div>
        </div>

        {/* CHECKOUTS */}
        <div className="bg-[#0C0C0C] border border-[#1F1F1F] hover:border-[#FFD000]/40 rounded-2xl p-4 flex flex-col justify-between transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">
              {isPt ? 'Checkouts Iniciados' : 'Checkouts Started'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center text-[#FFD000]">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {displayKpis.checkouts.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>8.6% dos visitantes</span>
            </div>
          </div>
        </div>

        {/* PURCHASES */}
        <div className="bg-[#0C0C0C] border border-[#1F1F1F] hover:border-[#FFD000]/40 rounded-2xl p-4 flex flex-col justify-between transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">
              {isPt ? 'Vendas Concluídas' : 'Purchases'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center text-[#FFD000]">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {displayKpis.purchases.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>33.9% de conversão checkout</span>
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div className="bg-[#0C0C0C] border border-[#1F1F1F] hover:border-[#FFD000]/40 rounded-2xl p-4 flex flex-col justify-between transition-all group col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">
              {isPt ? 'Receita Total' : 'Total Revenue'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center text-[#FFD000]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-[#FFD000] font-mono tracking-tight">
              {formatCurrency(displayKpis.revenue)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Ticket Médio: $132.60</span>
            </div>
          </div>
        </div>

        {/* CONVERSION RATE */}
        <div className="bg-[#0C0C0C] border border-[#1F1F1F] hover:border-[#FFD000]/40 rounded-2xl p-4 flex flex-col justify-between transition-all group col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-neutral-400">
              {isPt ? 'Taxa de Conversão' : 'Conversion Rate'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#181818] flex items-center justify-center text-[#FFD000]">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white font-mono tracking-tight">
              {displayKpis.cvr}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Visitas → Compras</span>
            </div>
          </div>
        </div>
      </div>

      {/* World Map Section */}
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        {/* Map Header & Metric Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1C1C] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#FFD000]" />
              <span>{isPt ? 'Mapa Mundial de Desempenho Geográfico' : 'World Geographic Performance Map'}</span>
            </h2>
            <p className="text-xs text-neutral-400">
              {isPt
                ? 'Clique em qualquer país para inspecionar cidades, visitantes, checkouts e vendas detalhadas.'
                : 'Click any country beacon to inspect cities, visitors, checkouts, and revenue.'}
            </p>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Map Metric Selector Buttons */}
            <div className="flex items-center gap-1.5 bg-[#141414] border border-[#262626] rounded-xl p-1 text-xs">
              <button
                onClick={() => setMapMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mapMetric === 'revenue'
                    ? 'btn-gold-blend text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isPt ? 'Receita' : 'Revenue'}
              </button>
              <button
                onClick={() => setMapMetric('purchases')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mapMetric === 'purchases'
                    ? 'btn-gold-blend text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isPt ? 'Vendas' : 'Purchases'}
              </button>
              <button
                onClick={() => setMapMetric('checkouts')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mapMetric === 'checkouts'
                    ? 'btn-gold-blend text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isPt ? 'Checkouts' : 'Checkouts'}
              </button>
              <button
                onClick={() => setMapMetric('visitors')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  mapMetric === 'visitors'
                    ? 'btn-gold-blend text-black shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {isPt ? 'Visitantes' : 'Visitors'}
              </button>
            </div>

            {/* Expand Image Modal Button */}
            <button
              id="expand-world-map-btn"
              onClick={() => setMapImageExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] border border-[#2B2B2B] hover:border-[#FFD000]/60 text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer shadow-sm"
              title={isPt ? 'Expandir imagem do mapa mundial' : 'Expand world map image'}
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#FFE76A]" />
              <span className="hidden sm:inline">{isPt ? 'Visualizar Imagem' : 'View Image'}</span>
            </button>
          </div>
        </div>

        {/* Interactive World Map Canvas with High-Resolution Image */}
        <div className="relative w-full aspect-[2/1] bg-[#050505] rounded-xl border border-[#1C1C1C] overflow-hidden flex items-center justify-center group/map shadow-2xl">
          {/* High-Resolution World Map Image */}
          <img
            src={worldMapGeoImage}
            alt={isPt ? 'Mapa Mundial de Desempenho Geográfico' : 'World Geographic Performance Map'}
            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none opacity-90 transition-transform duration-700 ease-out group-hover/map:scale-[1.01]"
            referrerPolicy="no-referrer"
          />

          {/* Subtle Ambient Darkness Vignette & Tech Grid */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/65 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

          {/* Interactive SVG Overlay with Pulsing Beacon Hotspot Nodes */}
          <svg
            viewBox="0 0 1000 500"
            className="relative z-10 w-full h-full select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD000" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#C99712" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#875803" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Pulsing Beacon Nodes for Active Countries */}
            {mapPoints.map((point) => {
              const isSelected = selectedCountry?.country_code === point.country_code;
              return (
                <g
                  key={point.country_code}
                  className="cursor-pointer group"
                  onClick={() => setSelectedCountry(point)}
                >
                  {/* Outer animated radar ring */}
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r={isSelected ? 20 : 13}
                    fill="url(#pulseGlow)"
                    className="animate-ping origin-center"
                    style={{ animationDuration: '3s' }}
                  />

                  {/* Core Pin */}
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r={isSelected ? 7.5 : 5.5}
                    fill={isSelected ? '#FFFFFF' : '#FFD000'}
                    stroke="#000000"
                    strokeWidth="1.5"
                    className="transition-all group-hover:scale-125 origin-center shadow-lg"
                  />

                  {/* Flag label preview */}
                  <text
                    x={point.cx + 9}
                    y={point.cy + 4}
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="bold"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] opacity-95 group-hover:opacity-100 group-hover:fill-[#FFE76A]"
                  >
                    {point.flag} {point.country_code}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick instructions and status indicator */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#222222] text-[11px] text-neutral-300 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#FFD000] animate-pulse" />
            <span className="font-medium">
              {isPt
                ? 'Mapa Mundial Ativo • Hotspots em Tempo Real'
                : 'Live World Map Active • Real-Time Hotspots'}
            </span>
            <span className="badge-gold-outline text-[10px] px-1.5 py-0.2 rounded font-mono ml-1">
              {mapPoints.length} {isPt ? 'países' : 'countries'}
            </span>
          </div>

          {/* Fullscreen Expand trigger button on bottom-right of map */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
            <button
              id="map-canvas-expand-btn"
              onClick={() => setMapImageExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 hover:bg-black backdrop-blur-md border border-[#262626] hover:border-[#FFD000]/60 text-[11px] font-bold text-neutral-200 hover:text-white transition-all cursor-pointer shadow-md"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#FFE76A]" />
              <span>{isPt ? 'Expandir Mapa' : 'Expand Map'}</span>
            </button>
          </div>
        </div>

        {/* Selected Country Deep Inspector Panel (Opens on Country Click) */}
        {selectedCountry && (
          <div className="mt-2 bg-[#121212] border border-[#FFD000]/60 rounded-xl p-4 relative animate-in fade-in">
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedCountry.flag}</span>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{selectedCountry.country}</span>
                    <span className="badge-gold-blend text-[10px] font-mono px-2 py-0.5 rounded">
                      {selectedCountry.country_code}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {isPt
                      ? 'Desempenho detalhado por região e taxa de conversão'
                      : 'Detailed regional performance & conversion telemetry'}
                  </p>
                </div>
              </div>

              {/* Country Metrics Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-[#1A1A1A] p-2.5 rounded-lg border border-[#282828]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {isPt ? 'Visitantes' : 'Visitors'}
                  </span>
                  <div className="text-sm font-black text-white font-mono">
                    {selectedCountry.visitors.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1A1A1A] p-2.5 rounded-lg border border-[#282828]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {isPt ? 'Checkouts' : 'Checkouts'}
                  </span>
                  <div className="text-sm font-black text-white font-mono">
                    {selectedCountry.checkouts.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1A1A1A] p-2.5 rounded-lg border border-[#282828]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {isPt ? 'Vendas' : 'Purchases'}
                  </span>
                  <div className="text-sm font-black text-white font-mono">
                    {selectedCountry.purchases.toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#1A1A1A] p-2.5 rounded-lg border border-[#282828]">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {isPt ? 'Receita Total' : 'Revenue'}
                  </span>
                  <div className="text-sm font-black text-[#FFD000] font-mono">
                    {formatCurrency(selectedCountry.revenue)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Journey Funnel Section for Geographic Analytics */}
      <CustomerJourneyFunnel
        stages={geoFunnelStages}
        mode="geographic"
        title={isPt ? 'Funil da Jornada do Cliente Geográfico' : 'Geographic Customer Journey Funnel'}
        subtitle={
          selectedCountry
            ? (isPt
                ? `Análise de conversão e diagnóstico de atrito para ${selectedCountry.country} (${selectedCountry.flag} ${selectedCountry.country_code})`
                : `Conversion telemetry & friction diagnosis for ${selectedCountry.country} (${selectedCountry.flag} ${selectedCountry.country_code})`)
            : (isPt
                ? 'Visão ponta a ponta sobre todas as 6 etapas da jornada do cliente em todos os mercados globais'
                : 'End-to-end telemetry across all 6 customer journey stages across all global markets')
        }
        selectedCountryName={selectedCountry ? selectedCountry.country : undefined}
        selectedCountryFlag={selectedCountry ? selectedCountry.flag : undefined}
        countriesList={countriesList}
        onSelectCountry={handleSelectCountryFromFunnel}
        formatCurrency={formatCurrency}
        isPt={isPt}
      />

      {/* Two Column Layout: Country Breakdown & City Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown Table */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FFD000]" />
                <span>{isPt ? 'Desempenho por País (Country Breakdown)' : 'Country Breakdown'}</span>
              </h3>
              <span className="text-xs text-neutral-400 font-mono">
                {countries.length} {isPt ? 'países ativos' : 'active countries'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 border-b border-[#1A1A1A] uppercase font-bold text-[10px]">
                    <th className="pb-2">{isPt ? 'País' : 'Country'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Visitantes' : 'Visitors'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Checkouts' : 'Checkouts'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Vendas' : 'Sales'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Receita' : 'Revenue'}</th>
                    <th className="pb-2 text-right">{isPt ? 'CVR' : 'CVR'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171717]">
                  {countries.slice(0, 8).map((c) => (
                    <tr
                      key={c.country_code}
                      onClick={() => setSelectedCountry(c)}
                      className="hover:bg-[#141414] cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 flex items-center gap-2 font-bold text-white">
                        <span>{c.flag}</span>
                        <span className="truncate max-w-[130px]">{c.country}</span>
                      </td>
                      <td className="py-2.5 text-right font-mono text-neutral-300">
                        {c.visitors.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-neutral-300">
                        {c.checkouts.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-white font-bold">
                        {c.purchases.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#FFD000] font-bold">
                        {formatCurrency(c.revenue)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-emerald-400">
                        {c.conversion_rate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* City Breakdown Table */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFD000]" />
                <span>{isPt ? 'Desempenho por Cidade (City Breakdown)' : 'City Breakdown'}</span>
              </h3>
              <span className="text-xs text-neutral-400 font-mono">
                {cities.length} {isPt ? 'cidades registradas' : 'registered cities'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 border-b border-[#1A1A1A] uppercase font-bold text-[10px]">
                    <th className="pb-2">{isPt ? 'Cidade / Região' : 'City / State'}</th>
                    <th className="pb-2 text-right">{isPt ? 'País' : 'Country'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Visitantes' : 'Visitors'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Vendas' : 'Sales'}</th>
                    <th className="pb-2 text-right">{isPt ? 'Receita' : 'Revenue'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171717]">
                  {cities.slice(0, 8).map((city, idx) => (
                    <tr key={`${city.city}-${idx}`} className="hover:bg-[#141414] transition-colors">
                      <td className="py-2.5">
                        <div className="font-bold text-white truncate max-w-[140px]">{city.city}</div>
                        <div className="text-[10px] text-neutral-500">{city.region || city.country}</div>
                      </td>
                      <td className="py-2.5 text-right font-mono text-neutral-400">
                        {city.country_code}
                      </td>
                      <td className="py-2.5 text-right font-mono text-neutral-300">
                        {city.visitors.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-white font-bold">
                        {city.purchases.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#FFD000] font-bold">
                        {formatCurrency(city.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources Breakdown */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3 mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#FFD000]" />
              <span>{isPt ? 'Origens de Tráfego & Campanhas UTM' : 'Traffic Sources & UTM Campaigns'}</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">Meta, Google, TikTok, Direct</span>
          </div>

          <div className="space-y-3">
            {trafficSources.map((t, idx) => {
              const pct = displayKpis.revenue > 0 ? Math.min(100, (t.revenue / displayKpis.revenue) * 100) : 25;
              return (
                <div key={idx} className="bg-[#121212] border border-[#1E1E1E] p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFD000]" />
                      {t.source}
                    </span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-neutral-400">{t.visits} visitas</span>
                      <span className="text-white font-bold">{t.purchases} compras</span>
                      <span className="text-[#FFD000] font-bold">{formatCurrency(t.revenue)}</span>
                    </div>
                  </div>
                  {/* Visual Progress Bar with Deep Gold + Charged Yellow */}
                  <div className="w-full bg-[#1F1F1F] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.max(8, pct)}%`,
                        background: 'linear-gradient(90deg, #875803 0%, #C99712 50%, #FFD000 100%)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#FFD000]" />
                <span>{isPt ? 'Dispositivos' : 'Device Breakdown'}</span>
              </h3>
              <span className="text-xs text-neutral-400 font-mono">Mobile First</span>
            </div>

            <div className="space-y-4">
              {devices.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#1E1E1E]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#181818] flex items-center justify-center text-[#FFD000]">
                      {d.device.toLowerCase().includes('mobile') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : d.device.toLowerCase().includes('tablet') ? (
                        <Tablet className="w-4 h-4" />
                      ) : (
                        <Monitor className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{d.device}</div>
                      <div className="text-[10px] text-neutral-400">{d.purchases} compras</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-[#FFD000]">
                      {formatCurrency(d.revenue)}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">{d.share}% share</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Sales Feed */}
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-bold text-white">
              {isPt ? 'Feed de Vendas ao Vivo (Supabase Realtime + Stripe Webhooks)' : 'Live Sales Stream (Supabase Realtime & Stripe)'}
            </h3>
          </div>
          <span className="badge-gold-outline text-[10px] font-mono px-2 py-0.5 rounded">
            SYNCED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentSales.slice(0, 6).map((sale) => (
            <div
              key={sale.id}
              className="bg-[#121212] border border-[#222222] hover:border-[#FFD000]/50 p-3.5 rounded-xl transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFD000]" />
                  <span>{sale.city}, {sale.country}</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {new Date(sale.purchased_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-neutral-300 truncate font-medium">{sale.product_name}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1C1C1C]">
                <span className="text-[10px] font-mono text-neutral-400">{sale.order_number}</span>
                <span className="text-xs font-black text-[#FFD000] font-mono">
                  {formatCurrency(sale.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Modal for testing end-to-end checkout journey */}
      {simulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F0F0F] border border-[#FFD000] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSimulatorOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl icon-badge-blend flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isPt ? 'Simulador de Jornada de Checkout & Venda' : 'Checkout & Purchase Journey Sandbox'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {isPt
                    ? 'Simule a conversão: Visitante → Checkout → Pagamento Stripe → Compra'
                    : 'Test the funnel: Visitor → Checkout → Stripe Payment → Purchase'}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  {isPt ? 'Produto do Catálogo' : 'Product'}
                </label>
                <input
                  type="text"
                  value={simProduct}
                  onChange={(e) => setSimProduct(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    {isPt ? 'País de Origem' : 'Country'}
                  </label>
                  <select
                    value={simCountry}
                    onChange={(e) => {
                      setSimCountry(e.target.value);
                      if (e.target.value === 'Brazil') { setSimCode('BR'); setSimCity('São Paulo'); }
                      if (e.target.value === 'United States') { setSimCode('US'); setSimCity('Miami'); }
                      if (e.target.value === 'United Kingdom') { setSimCode('GB'); setSimCity('London'); }
                      if (e.target.value === 'Japan') { setSimCode('JP'); setSimCity('Tokyo'); }
                      if (e.target.value === 'Germany') { setSimCode('DE'); setSimCity('Berlin'); }
                    }}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="United States">🇺🇸 United States</option>
                    <option value="Brazil">🇧🇷 Brazil</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom</option>
                    <option value="Japan">🇯🇵 Japan</option>
                    <option value="Germany">🇩🇪 Germany</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    {isPt ? 'Cidade' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={simCity}
                    onChange={(e) => setSimCity(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    {isPt ? 'Valor da Venda ($)' : 'Amount ($)'}
                  </label>
                  <input
                    type="number"
                    value={simAmount}
                    onChange={(e) => setSimAmount(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    {isPt ? 'Origem de Tráfego (UTM)' : 'Traffic Source'}
                  </label>
                  <select
                    value={simSource}
                    onChange={(e) => setSimSource(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="TikTok Ads">TikTok Ads</option>
                    <option value="Instagram Organic">Instagram Organic</option>
                    <option value="Direct">Direct</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#222222]">
              <button
                onClick={handleRunSimulation}
                className="flex-1 btn-gold-blend py-2.5 rounded-xl font-bold text-black flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isPt ? 'Confirmar Compra Instantânea' : 'Trigger Instant Purchase'}</span>
              </button>

              <button
                onClick={handleLaunchStripeCheckout}
                className="btn-gold-secondary py-2.5 px-4 rounded-xl font-bold flex items-center gap-2"
                title={isPt ? 'Testar Checkout real do Stripe' : 'Test Stripe Hosted Checkout'}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Stripe Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen High-Resolution World Map Modal */}
      {mapImageExpanded && (
        <div
          id="world-map-expanded-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setMapImageExpanded(false)}
        >
          <div
            className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C1C1C] bg-[#0E0E0E]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFE76A]">
                  <Globe className="w-5 h-5 text-[#FFD000]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{isPt ? 'Mapa Mundial de Desempenho Geográfico' : 'World Geographic Performance Map'}</span>
                    <span className="badge-gold-blend text-[10px] font-bold px-2 py-0.5 rounded">ULTRA HD</span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {isPt
                      ? 'Visualização expandida em alta resolução com hotspots de vendas e checkouts ao vivo.'
                      : 'Expanded high-definition view with live sales and checkout hotspots.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="close-expanded-map-btn"
                  onClick={() => setMapImageExpanded(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white bg-[#141414] hover:bg-[#202020] border border-[#242424] hover:border-neutral-500 transition-colors"
                  aria-label="Fechar mapa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Map View Area */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-[#050505] overflow-hidden flex items-center justify-center">
              {/* High-Resolution World Map Image */}
              <img
                src={worldMapGeoImage}
                alt={isPt ? 'Mapa Mundial de Desempenho Geográfico' : 'World Geographic Performance Map'}
                className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none opacity-95"
                referrerPolicy="no-referrer"
              />

              {/* Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

              {/* Hotspot Beacons Overlay */}
              <svg
                viewBox="0 0 1000 500"
                className="relative z-10 w-full h-full select-none"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <radialGradient id="modalPulseGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD000" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#C99712" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#875803" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {mapPoints.map((point) => {
                  const isSelected = selectedCountry?.country_code === point.country_code;
                  return (
                    <g
                      key={point.country_code}
                      className="cursor-pointer group"
                      onClick={() => {
                        setSelectedCountry(point);
                        setMapImageExpanded(false);
                      }}
                    >
                      <circle
                        cx={point.cx}
                        cy={point.cy}
                        r={isSelected ? 22 : 14}
                        fill="url(#modalPulseGlow)"
                        className="animate-ping origin-center"
                        style={{ animationDuration: '3s' }}
                      />
                      <circle
                        cx={point.cx}
                        cy={point.cy}
                        r={isSelected ? 8 : 6}
                        fill={isSelected ? '#FFFFFF' : '#FFD000'}
                        stroke="#000000"
                        strokeWidth="1.5"
                        className="transition-all group-hover:scale-125 origin-center shadow-lg"
                      />
                      <text
                        x={point.cx + 10}
                        y={point.cy + 4}
                        fill="#FFFFFF"
                        fontSize="12"
                        fontWeight="bold"
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] opacity-95 group-hover:opacity-100 group-hover:fill-[#FFE76A]"
                      >
                        {point.flag} {point.country_code}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Quick Bar */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#282828] text-xs text-neutral-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD000] animate-pulse" />
                  <span className="font-semibold text-white">
                    {mapPoints.length} {isPt ? 'Países com Vendas e Checkouts Ativos' : 'Countries with Active Sales'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Quick Stats */}
            <div className="p-4 bg-[#0A0A0A] border-t border-[#1C1C1C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-400">
                <Sparkles className="w-4 h-4 text-[#FFE76A]" />
                <span>
                  {isPt
                    ? 'Clique em qualquer nó luminoso no mapa para inspecionar métricas do país.'
                    : 'Click any beacon on the map to inspect country metrics.'}
                </span>
              </div>
              <button
                onClick={() => setMapImageExpanded(false)}
                className="btn-gold-blend px-4 py-2 rounded-xl text-black font-bold"
              >
                {isPt ? 'Concluído' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
