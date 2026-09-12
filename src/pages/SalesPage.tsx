import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShoppingBag,
  Package,
  RotateCcw,
  Search,
  Plus,
  ArrowUpDown,
  Download,
  DollarSign,
  TrendingUp,
  Edit2,
  Trash2,
  Layers,
  Filter,
} from 'lucide-react';
import { OrderItem, CustomerJourneyStage } from '../types';
import { CustomerJourneyFunnel } from '../components/CustomerJourneyFunnel';
import { getFirstLetter } from '../utils/avatarUtils';

export const SalesPage: React.FC = () => {
  const {
    activeSubTab,
    navigate,
    orders,
    products,
    refunds,
    formatCurrency,
    currencySymbol,
    setSelectedOrder,
    setSaleModalOpen,
    setSaleToEdit,
    triggerDeleteConfirm,
    deleteOrder,
    t,
    language,
  } = useApp();

  const isPt = language === 'pt';
  const subTab = activeSubTab || 'overview';

  // Orders table state & filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderCountryFilter, setOrderCountryFilter] = useState<string>('all');
  const [orderSortBy, setOrderSortBy] = useState<'date' | 'amount'>('date');
  const [orderSortAsc, setOrderSortAsc] = useState(false);

  // Products table state & filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const custName = typeof o.customer === 'object' ? o.customer?.name : String(o.customer);
        const custEmail = typeof o.customer === 'object' ? o.customer?.email : '';
        const matchesSearch =
          o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
          custName.toLowerCase().includes(orderSearch.toLowerCase()) ||
          custEmail.toLowerCase().includes(orderSearch.toLowerCase());
        const matchesStatus =
          orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
        const matchesCountry =
          orderCountryFilter === 'all' || o.country.toLowerCase() === orderCountryFilter.toLowerCase();
        return matchesSearch && matchesStatus && matchesCountry;
      })
      .sort((a, b) => {
        if (orderSortBy === 'amount') {
          return orderSortAsc ? a.rawAmount - b.rawAmount : b.rawAmount - a.rawAmount;
        }
        return orderSortAsc
          ? a.orderNumber.localeCompare(b.orderNumber)
          : b.orderNumber.localeCompare(a.orderNumber);
      });
  }, [orders, orderSearch, orderStatusFilter, orderCountryFilter, orderSortBy, orderSortAsc]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Summary Metrics
  const totalSalesRevenue = orders.reduce(
    (sum, o) => sum + (o.status === 'Paid' ? o.rawAmount : 0),
    0
  );
  const paidOrdersCount = orders.filter((o) => o.status === 'Paid').length;
  const salesAov = paidOrdersCount > 0 ? totalSalesRevenue / paidOrdersCount : 0;
  const refundRate =
    orders.length > 0 ? ((refunds.length / orders.length) * 100).toFixed(1) : '1.4';

  // Customer Journey Funnel Stages for Sales View
  const salesFunnelStages: CustomerJourneyStage[] = useMemo(() => {
    const baseVisitors = Math.max(48920, orders.length * 35);
    const viewsCount = Math.round(baseVisitors * 0.578);
    const cartCount = Math.round(baseVisitors * 0.158);
    const checkoutsCount = Math.max(orders.length, Math.round(baseVisitors * 0.086));
    const purchasesCount = paidOrdersCount > 0 ? paidOrdersCount : Math.max(1428, orders.length);
    const retentionCount = Math.round(purchasesCount * 0.181);
    const revenue = totalSalesRevenue > 0 ? totalSalesRevenue : 189420;
    const aov = salesAov > 0 ? salesAov : 132.6;

    const calcPct = (num: number, den: number, decimals = 1) => {
      if (den <= 0) return 0;
      return Number(((num / den) * 100).toFixed(decimals));
    };

    return [
      {
        id: 'visitors',
        stepNumber: 1,
        label: isPt ? 'Visitantes da Loja & Tráfego' : 'Store Visitors & Discovery',
        sublabel: isPt
          ? 'Sessões originadas por anúncios Meta/Google, busca orgânica e influenciadores'
          : 'Sessions driven by Meta/Google paid ads, organic search, and brand affiliates',
        count: baseVisitors,
        formattedCount: baseVisitors.toLocaleString(),
        percentageOfTop: 100,
        conversionFromPrev: 100,
        dropOffRate: 0,
        dropOffCount: 0,
        mobileRate: 73,
        desktopRate: 27,
        topDropoffReason: isPt
          ? 'Taxa de rejeição (bounce rate) inicial em tráfego de redes sociais mobile'
          : 'Initial bounce rate on cold social traffic and ad creative clicks',
        insight: isPt
          ? '73% do tráfego é mobile. Landing pages com tempo de carregamento <1.2s convertem 2.4x mais.'
          : '73% mobile traffic share. Landing pages loading under 1.2s convert 2.4x higher.',
        actionableRecommendation: isPt
          ? 'Reduza o payload de imagens pesadas na Hero Section e ative cache de borda via CDN.'
          : 'Optimize hero section image payloads and activate Cloudflare edge caching.',
        iconName: 'users',
      },
      {
        id: 'views',
        stepNumber: 2,
        label: isPt ? 'Visualização de Produtos' : 'Product Page Views',
        sublabel: isPt
          ? 'Usuários que navegaram nas páginas de produto, seletores de cor e especificações'
          : 'Users browsing product detail pages, color options, and sensor specifications',
        count: viewsCount,
        formattedCount: viewsCount.toLocaleString(),
        percentageOfTop: calcPct(viewsCount, baseVisitors),
        conversionFromPrev: calcPct(viewsCount, baseVisitors),
        dropOffRate: Math.max(0, 100 - calcPct(viewsCount, baseVisitors)),
        dropOffCount: Math.max(0, baseVisitors - viewsCount),
        mobileRate: 71,
        desktopRate: 29,
        topDropoffReason: isPt
          ? 'Dúvida na escolha do tamanho do anel inteligente e comparação com outros modelos'
          : 'Sizing hesitation on smart ring circumference and technical comparison doubts',
        insight: isPt
          ? 'Usuários que alternam entre as opções Ouro e Preto têm 2.1x mais retenção na página.'
          : 'Users toggling between Gold and Matte Black finishes exhibit 2.1x higher dwell time.',
        actionableRecommendation: isPt
          ? 'Promova o Kit Medidor Grátis com envio prévio e adicione vídeo tutorial de 15 segundos.'
          : 'Promote Free Sizing Kit sent prior to delivery and add a 15s sizing guide video.',
        iconName: 'eye',
      },
      {
        id: 'cart',
        stepNumber: 3,
        label: isPt ? 'Adição ao Carrinho' : 'Add to Cart',
        sublabel: isPt
          ? 'Itens colocados na sacola de compras com intenção de compra ativa'
          : 'Items placed in shopping bag reflecting active buying intent',
        count: cartCount,
        formattedCount: cartCount.toLocaleString(),
        percentageOfTop: calcPct(cartCount, baseVisitors),
        conversionFromPrev: calcPct(cartCount, viewsCount),
        dropOffRate: Math.max(0, 100 - calcPct(cartCount, viewsCount)),
        dropOffCount: Math.max(0, viewsCount - cartCount),
        revenue: Math.round(cartCount * aov * 0.8),
        avgOrderValue: aov,
        mobileRate: 68,
        desktopRate: 32,
        topDropoffReason: isPt
          ? 'Abandono de carrinho para comparar com concorrentes ou busca por cupons promocionais'
          : 'Cart abandonment for competitor comparison or hunting for promo coupons',
        insight: isPt
          ? 'Carrinhos com 2+ itens representam 34% do volume total com ticket médio 1.6x superior.'
          : 'Multi-item carts account for 34% of volume with 1.6x higher average order value.',
        actionableRecommendation: isPt
          ? 'Ative gaveta de saída (exit intent) com oferta de frete expresso gratuito imediato.'
          : 'Trigger exit-intent drawer offering free priority courier shipping.',
        iconName: 'shopping-cart',
      },
      {
        id: 'checkout',
        stepNumber: 4,
        label: isPt ? 'Checkouts Iniciados' : 'Initiated Checkouts',
        sublabel: isPt
          ? 'Preenchimento de dados de contato, endereço e cálculo de frete'
          : 'Customer contact details, shipping address, and carrier selection',
        count: checkoutsCount,
        formattedCount: checkoutsCount.toLocaleString(),
        percentageOfTop: calcPct(checkoutsCount, baseVisitors),
        conversionFromPrev: calcPct(checkoutsCount, cartCount),
        dropOffRate: Math.max(0, 100 - calcPct(checkoutsCount, cartCount)),
        dropOffCount: Math.max(0, cartCount - checkoutsCount),
        mobileRate: 64,
        desktopRate: 36,
        topDropoffReason: isPt
          ? 'Custo inesperado de frete internacional ou tempo de entrega superior a 5 dias úteis'
          : 'Unexpected shipping freight fee or delivery estimate exceeding 5 business days',
        insight: isPt
          ? '68% dos clientes preenchem o e-mail mas não avançam para o pagamento com cartão.'
          : '68% of shoppers input email address but abandon before filling card details.',
        actionableRecommendation: isPt
          ? 'Integre Stripe Link, Apple Pay e Google Pay para checkout rápido em 1 toque sem digitação.'
          : 'Integrate Stripe Link, Apple Pay, and Google Pay for friction-free 1-tap checkout.',
        iconName: 'credit-card',
      },
      {
        id: 'purchase',
        stepNumber: 5,
        label: isPt ? 'Vendas Concluídas' : 'Completed Purchases',
        sublabel: isPt
          ? 'Transações aprovadas, liquidadas e sincronizadas no ERP/Stripe'
          : 'Transactions approved, settled, and synced to ERP/Stripe database',
        count: purchasesCount,
        formattedCount: purchasesCount.toLocaleString(),
        percentageOfTop: calcPct(purchasesCount, baseVisitors, 2),
        conversionFromPrev: calcPct(purchasesCount, checkoutsCount),
        dropOffRate: Math.max(0, 100 - calcPct(purchasesCount, checkoutsCount)),
        dropOffCount: Math.max(0, checkoutsCount - purchasesCount),
        revenue: revenue,
        avgOrderValue: aov,
        mobileRate: 61,
        desktopRate: 39,
        topDropoffReason: isPt
          ? 'Bloqueio preventivo do banco emissor por suspeita de fraude ou desistência 3D-Secure'
          : 'Issuing bank fraud defense decline or 3D-Secure mobile verification drop',
        insight: isPt
          ? 'Aprovações via carteira digital ou PIX atingem 98.4% sem falhas de adquirente.'
          : 'Transactions via digital wallets or PIX achieve 98.4% success without acquirer errors.',
        actionableRecommendation: isPt
          ? 'Habilite múltiplos gateways adquirentes com fallback automático em caso de recusa.'
          : 'Enable multi-acquirer fallback routing to recover declined credit card transactions.',
        iconName: 'check-circle',
      },
      {
        id: 'retention',
        stepNumber: 6,
        label: isPt ? 'Recompra & Retenção (LTV)' : 'Repeat Purchases & Retention',
        sublabel: isPt
          ? 'Clientes recorrentes que adquiriram novos acessórios ou assinatura da plataforma de IA'
          : 'Returning customers purchasing accessories or subscribing to AH19 AI Health Platform',
        count: retentionCount,
        formattedCount: retentionCount.toLocaleString(),
        percentageOfTop: calcPct(retentionCount, baseVisitors, 2),
        conversionFromPrev: calcPct(retentionCount, purchasesCount),
        dropOffRate: Math.max(0, 100 - calcPct(retentionCount, purchasesCount)),
        dropOffCount: Math.max(0, purchasesCount - retentionCount),
        mobileRate: 67,
        desktopRate: 33,
        topDropoffReason: isPt
          ? 'Ausência de régua de comunicação pós-venda personalizada nos primeiros 14 dias'
          : 'Lack of personalized post-purchase nurture flow during the first 14 days after delivery',
        insight: isPt
          ? 'Clientes com 2+ compras possuem LTV médio de $342 e taxa de cancelamento de apenas 0.4%.'
          : 'Repeat buyers yield an average LTV of $342 and an ultra-low refund rate of 0.4%.',
        actionableRecommendation: isPt
          ? 'Dispare automação no Klaviyo oferecendo cupom exclusivo de 15% para familiares e pulseiras.'
          : 'Automate Klaviyo post-delivery flow offering exclusive 15% VIP code for family and accessories.',
        iconName: 'repeat',
      },
    ];
  }, [orders, paidOrdersCount, totalSalesRevenue, salesAov, isPt]);

  const handleCreateSale = () => {
    setSaleToEdit(null);
    setSaleModalOpen(true);
  };

  const handleEditSale = (order: OrderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaleToEdit(order);
    setSaleModalOpen(true);
  };

  const handleDeleteSale = (order: OrderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDeleteConfirm(
      `${t.action_delete} ${order.orderNumber}`,
      `Deseja realmente remover o pedido ${order.orderNumber}? Esta ação atualizará métricas e estoque.`,
      () => deleteOrder(order.id)
    );
  };

  return (
    <div id="sales-page-container" className="space-y-6 select-none">
      {/* Sub-Navigation Tabs & Actions Header */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#1E1E1E]">
          {[
            { id: 'overview', label: t.sales_overview, icon: TrendingUp },
            { id: 'funnel', label: isPt ? 'Funil de Vendas' : 'Sales Funnel', icon: Filter },
            { id: 'orders', label: t.nav_sales, icon: ShoppingBag, count: orders.length },
            { id: 'products', label: t.nav_products, icon: Package, count: products.length },
            { id: 'refunds', label: t.sales_refunds, icon: RotateCcw, count: refunds.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`sales-tab-${tab.id}`}
                onClick={() => navigate('sales', tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFD000] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive ? 'bg-black text-[#FFD000]' : 'bg-[#1C1C1C] text-neutral-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Button: Create New Sale */}
        <div className="flex items-center gap-2.5">
          <button
            id="add-new-sale-btn"
            onClick={handleCreateSale}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.sales_new_sale}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row for Sales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.sales_total_sales}</span>
            <DollarSign className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">
            {formatCurrency(totalSalesRevenue)}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1">Pedidos confirmados e liquidados</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.sales_paid_orders}</span>
            <ShoppingBag className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">{paidOrdersCount}</p>
          <span className="text-[11px] text-neutral-500 mt-1">Total de {orders.length} gerados</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.sales_avg_ticket}</span>
            <TrendingUp className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-[#FFD000] mt-2 font-mono">
            {formatCurrency(salesAov)}
          </p>
          <span className="text-[11px] text-neutral-500 mt-1">Ticket médio por transação</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.sales_refund_rate}</span>
            <RotateCcw className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">{refundRate}%</p>
          <span className="text-[11px] text-neutral-500 mt-1">Benchmark seguro (&lt; 2.5%)</span>
        </div>
      </div>

      {/* VIEW: DEDICATED SALES FUNNEL SUBTAB */}
      {subTab === 'funnel' && (
        <CustomerJourneyFunnel
          stages={salesFunnelStages}
          mode="sales"
          title={isPt ? 'Funil de Vendas & Jornada Completa do Cliente' : 'Sales Funnel & Complete Customer Journey'}
          subtitle={
            isPt
              ? 'Diagnóstico aprofundado das 6 etapas da jornada: Tráfego e Descoberta, Visualização de Produto, Adição ao Carrinho, Checkout Iniciado, Compras Aprovadas e Recompra/LTV.'
              : 'In-depth diagnostic telemetry across all 6 stages: Discovery Traffic, Product Page Views, Add to Cart, Initiated Checkout, Completed Purchases, and Retention/LTV.'
          }
          formatCurrency={formatCurrency}
          isPt={isPt}
        />
      )}

      {/* VIEW: OVERVIEW SUBTAB EMBEDDED FUNNEL */}
      {subTab === 'overview' && (
        <CustomerJourneyFunnel
          stages={salesFunnelStages}
          mode="sales"
          title={isPt ? 'Funil da Jornada do Cliente' : 'Customer Journey Funnel'}
          subtitle={
            isPt
              ? 'Visão ponta a ponta sobre a taxa de passagem e atritos entre cada etapa do processo de compra'
              : 'End-to-end view of pass-through rates and friction points across the customer buying journey'
          }
          formatCurrency={formatCurrency}
          isPt={isPt}
        />
      )}

      {/* VIEW 1: ORDERS TABLE */}
      {(subTab === 'orders' || subTab === 'overview') && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-[#1C1C1C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0E0E0E]">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t.search_placeholder}
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#FFD000]"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Filter */}
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
              >
                <option value="all">Todos os Status</option>
                <option value="Paid">Pagos</option>
                <option value="Pending">Pendentes</option>
                <option value="Refunded">Reembolsados</option>
              </select>

              {/* Country Filter */}
              <select
                value={orderCountryFilter}
                onChange={(e) => setOrderCountryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
              >
                <option value="all">Todos os Países</option>
                <option value="United States">Estados Unidos</option>
                <option value="Brazil">Brasil</option>
                <option value="United Kingdom">Reino Unido</option>
                <option value="Germany">Alemanha</option>
                <option value="Canada">Canadá</option>
              </select>

              <button
                onClick={() => {
                  setOrderSortBy(orderSortBy === 'date' ? 'amount' : 'date');
                  setOrderSortAsc(!orderSortAsc);
                }}
                className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD000]" />
                <span>Ordenar: {orderSortBy === 'amount' ? 'Valor' : 'Data'}</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                  <th className="py-3 px-4">{t.sales_order_number}</th>
                  <th className="py-3 px-4">{t.sales_customer}</th>
                  <th className="py-3 px-4">{t.sales_country}</th>
                  <th className="py-3 px-4">{t.sales_items}</th>
                  <th className="py-3 px-4">{t.sales_payment_method}</th>
                  <th className="py-3 px-4 text-right">{t.sales_total}</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">{t.sales_actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-500">
                      Nenhum pedido encontrado com estes filtros.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const custName =
                      typeof order.customer === 'object' ? order.customer?.name : String(order.customer);
                    const custEmail =
                      typeof order.customer === 'object' ? order.customer?.email : '';
                    const rawCustAvatar = typeof order.customer === 'object' ? order.customer?.avatar : '';
                    const custAvatar = rawCustAvatar && !rawCustAvatar.includes('images.unsplash.com') ? rawCustAvatar : '';

                    return (
                      <tr
                        key={order.id}
                        id={`order-item-row-${order.id}`}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-[#141414] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 font-bold text-white font-mono group-hover:text-[#FFD000]">
                          {order.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          <div className="flex items-center gap-2.5">
                            {custAvatar ? (
                              <img
                                src={custAvatar}
                                alt={custName}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                                className="w-6 h-6 rounded-full object-cover border border-[#2A2A2A]"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#161616] border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-[10px] text-[#FFD000] shrink-0">
                                {getFirstLetter(custName || 'U')}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white truncate max-w-[130px]">{custName}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">{custEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          <div className="flex items-center gap-1.5">
                            <span>{order.flag}</span>
                            <span>{order.country}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          <div className="flex items-center gap-1 text-xs">
                            <Package className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{order.itemsCount} itens</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                          {order.paymentMethod || 'Stripe'}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-[#FFD000] font-mono text-sm">
                          {order.amount.replace('$', currencySymbol)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              order.status === 'Paid'
                                ? 'bg-[#FFD000] text-black border-[#FFD000]'
                                : order.status === 'Pending'
                                ? 'bg-[#1A1A1A] text-neutral-300 border-[#333333]'
                                : 'bg-transparent text-neutral-500 border-neutral-700'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              id={`edit-order-${order.id}`}
                              onClick={(e) => handleEditSale(order, e)}
                              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-[#222222] transition-colors"
                              title={t.action_edit}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`delete-order-${order.id}`}
                              onClick={(e) => handleDeleteSale(order, e)}
                              className="p-1.5 rounded text-neutral-400 hover:text-[#FFD000] hover:bg-[#222222] transition-colors"
                              title={t.action_delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: PRODUCTS SUBTAB */}
      {subTab === 'products' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
            <div className="relative w-72">
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#FFD000]"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            </div>

            <button
              id="goto-full-products-btn"
              onClick={() => navigate('products')}
              className="px-3.5 py-1.5 rounded-lg bg-[#FFD000] text-black font-bold text-xs hover:bg-[#E6BC00] transition-colors"
            >
              + Gerenciar Catálogo Completo
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                  <th className="py-3 px-4">{t.prod_name}</th>
                  <th className="py-3 px-4">{t.prod_sku}</th>
                  <th className="py-3 px-4">{t.prod_category}</th>
                  <th className="py-3 px-4 text-right">{t.prod_price}</th>
                  <th className="py-3 px-4 text-right">{t.prod_cost}</th>
                  <th className="py-3 px-4 text-right">{t.prod_units_sold}</th>
                  <th className="py-3 px-4 text-right">{t.prod_profit}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{product.name}</td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{product.sku}</td>
                    <td className="py-3 px-4 text-neutral-300">{product.category}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-400">
                      {formatCurrency(product.cost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white">{product.unitsSold}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#FFD000]">
                      {formatCurrency(product.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: REFUNDS SUBTAB */}
      {subTab === 'refunds' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
            <h3 className="font-bold text-white text-sm">Histórico de Reembolsos & Disputas</h3>
            <span className="text-xs text-neutral-400 font-mono">{refunds.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                  <th className="py-3 px-4">{t.sales_order_number}</th>
                  <th className="py-3 px-4">{t.sales_customer}</th>
                  <th className="py-3 px-4">Motivo</th>
                  <th className="py-3 px-4 text-right">Valor Estornado</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {refunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 font-bold text-white font-mono">{refund.orderNumber}</td>
                    <td className="py-3 px-4 text-neutral-300 font-medium">{refund.customerName}</td>
                    <td className="py-3 px-4 text-neutral-400">{refund.reason}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#FFD000]">
                      {formatCurrency(refund.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1A1A1A] text-neutral-300 border border-[#333333]">
                        {refund.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
