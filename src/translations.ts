export type Language = 'pt' | 'en';

export interface Translations {
  // Navigation
  nav_dashboard: string;
  nav_sales: string;
  nav_customers: string;
  nav_products: string;
  nav_finances: string;
  nav_reports: string;
  nav_marketing: string;
  nav_geo_analytics: string;
  nav_integrations: string;
  nav_settings: string;
  nav_logout: string;

  // Header & Global
  search_placeholder: string;
  select_store: string;
  all_stores: string;
  notifications: string;
  mark_all_read: string;
  no_notifications: string;
  currency: string;
  language: string;
  live_data: string;
  demo_data: string;
  sync_now: string;
  last_synced: string;
  just_now: string;

  // Time periods
  period_today: string;
  period_yesterday: string;
  period_this_week: string;
  period_last_week: string;
  period_7d: string;
  period_14d: string;
  period_this_month: string;
  period_last_month: string;
  period_30d: string;
  period_90d: string;
  period_3m: string;
  period_6m: string;
  period_this_year: string;
  period_last_year: string;
  period_12m: string;
  period_specific_year: string;
  period_specific_month: string;
  period_specific_week: string;
  period_specific_day: string;
  period_custom: string;
  period_custom_range: string;
  period_start_date: string;
  period_end_date: string;
  period_apply: string;

  // Dashboard
  dash_total_revenue: string;
  dash_sales_count: string;
  dash_net_profit: string;
  dash_avg_ticket: string;
  dash_total_customers: string;
  dash_products_sold: string;
  dash_vs_previous: string;
  dash_revenue_profit_chart: string;
  dash_sales_trend: string;
  dash_top_products: string;
  dash_recent_orders: string;
  dash_recent_activity: string;
  dash_quick_actions: string;
  dash_view_all: string;
  dash_gross_revenue: string;
  dash_expenses: string;
  dash_margin: string;

  // Sales
  sales_title: string;
  sales_subtitle: string;
  sales_add_new: string;
  sales_new_sale: string;
  sales_edit: string;
  sales_delete: string;
  sales_search: string;
  sales_overview: string;
  sales_refunds: string;
  sales_total_sales: string;
  sales_paid_orders: string;
  sales_avg_ticket: string;
  sales_refund_rate: string;
  sales_country: string;
  sales_filter_status: string;
  sales_filter_payment: string;
  sales_filter_period: string;
  sales_order_number: string;
  sales_customer: string;
  sales_date: string;
  sales_items: string;
  sales_total: string;
  sales_status: string;
  sales_payment_method: string;
  sales_actions: string;
  sales_status_paid: string;
  sales_status_pending: string;
  sales_status_cancelled: string;
  sales_status_refunded: string;
  sales_details: string;
  sales_confirm_delete: string;
  sales_confirm_delete_msg: string;
  sales_no_orders: string;
  sales_tab_funnel: string;
  sales_funnel_title: string;
  sales_funnel_subtitle: string;
  geo_funnel_title: string;
  geo_funnel_subtitle: string;
  funnel_customer_stages: string;
  funnel_step_visitors: string;
  funnel_step_views: string;
  funnel_step_cart: string;
  funnel_step_checkout: string;
  funnel_step_purchase: string;
  funnel_step_retention: string;

  // Customers
  cust_title: string;
  cust_subtitle: string;
  cust_add_new: string;
  cust_edit: string;
  cust_delete: string;
  cust_search: string;
  cust_name: string;
  cust_email: string;
  cust_phone: string;
  cust_location: string;
  cust_country: string;
  cust_orders_count: string;
  cust_total_spent: string;
  cust_total_customers: string;
  cust_avg_ltv: string;
  cust_repeat_rate: string;
  cust_vip_tier: string;
  cust_ltv: string;
  cust_last_order: string;
  cust_last_purchase: string;
  cust_status: string;
  cust_status_active: string;
  cust_status_inactive: string;
  cust_status_vip: string;
  cust_details: string;
  cust_purchase_history: string;
  cust_confirm_delete: string;
  cust_confirm_delete_msg: string;
  cust_no_customers: string;

  // Products
  prod_title: string;
  prod_subtitle: string;
  prod_add_new: string;
  prod_edit: string;
  prod_delete: string;
  prod_search: string;
  prod_name: string;
  prod_sku: string;
  prod_category: string;
  prod_price: string;
  prod_cost: string;
  prod_stock: string;
  prod_sales: string;
  prod_revenue: string;
  prod_units_sold: string;
  prod_profit: string;
  prod_low_stock: string;
  prod_low_stock_warning: string;
  prod_in_stock: string;
  prod_performance: string;
  prod_confirm_delete: string;
  prod_confirm_delete_msg: string;
  prod_no_products: string;

  // Finances
  fin_title: string;
  fin_subtitle: string;
  fin_add_transaction: string;
  fin_revenue: string;
  fin_expenses: string;
  fin_profit: string;
  fin_total_income: string;
  fin_total_expenses: string;
  fin_net_profit: string;
  fin_net_margin: string;
  fin_cash_flow: string;
  fin_receivable: string;
  fin_payable: string;
  fin_evolution: string;
  fin_transactions: string;
  fin_type: string;
  fin_type_income: string;
  fin_type_expense: string;
  fin_description: string;
  fin_amount: string;
  fin_category: string;
  fin_date: string;
  fin_due_date: string;
  fin_status_settled: string;
  fin_status_pending: string;
  fin_confirm_delete: string;
  fin_confirm_delete_msg: string;

  // Reports
  rep_title: string;
  rep_subtitle: string;
  rep_select_period: string;
  rep_export: string;
  rep_export_csv: string;
  rep_print: string;
  rep_executive_summary: string;
  rep_overview_summary: string;
  rep_channel_breakdown: string;
  rep_top_performing_products: string;
  rep_geo_distribution: string;
  rep_payment_methods: string;
  rep_metrics_comparison: string;
  rep_conversion_funnel: string;

  // Marketing & Integrations
  mkt_title: string;
  mkt_campaigns: string;
  mkt_campaign: string;
  mkt_channel: string;
  mkt_ad_sets: string;
  mkt_creatives: string;
  mkt_all_channels: string;
  mkt_spend: string;
  mkt_total_spend: string;
  mkt_revenue: string;
  mkt_attributed_rev: string;
  mkt_roas: string;
  mkt_blended_roas: string;
  mkt_cpa: string;
  mkt_cpa_avg: string;
  mkt_status: string;
  mkt_conversions: string;
  int_title: string;
  int_connect: string;
  int_connected: string;
  int_disconnect: string;
  int_sync: string;
  int_events_tracked: string;
  integ_connected_platforms: string;
  integ_live_debugger: string;
  integ_sync_all: string;
  integ_connect_platform: string;
  integ_disconnect: string;

  // Analytics & AI Insights
  ana_funnel: string;
  ana_attribution: string;
  ana_utm: string;
  ana_devices: string;
  ai_all_insights: string;

  // Settings
  set_title: string;
  set_profile: string;
  set_stores: string;
  set_team: string;
  set_currency_lang: string;
  set_api_keys: string;
  set_billing: string;
  set_tab_profile: string;
  set_tab_company: string;
  set_tab_preferences: string;
  set_tab_language: string;
  set_tab_notifications: string;
  set_tab_security: string;
  set_tab_account: string;
  set_save_changes: string;
  set_saved_success: string;
  set_user_name: string;
  set_user_email: string;
  set_user_role: string;
  set_company_name: string;
  set_company_doc: string;
  set_default_currency: string;
  set_timezone: string;
  set_email_notifications: string;
  set_sales_alerts: string;
  set_security_pass: string;
  set_new_pass: string;
  set_confirm_pass: string;
  set_change_pass_btn: string;

  // Auth (Login & Register)
  auth_welcome: string;
  auth_welcome_sub: string;
  auth_login_title: string;
  auth_register_title: string;
  auth_name: string;
  auth_email: string;
  auth_password: string;
  auth_confirm_password: string;
  auth_remember_me: string;
  auth_forgot_password: string;
  auth_sign_in_btn: string;
  auth_sign_up_btn: string;
  auth_continue_google: string;
  auth_signup_google: string;
  auth_or_divider: string;
  auth_have_account: string;
  auth_no_account: string;
  auth_sign_up_link: string;
  auth_sign_in_link: string;
  auth_accept_terms: string;
  auth_demo_access: string;
  auth_demo_access_sub: string;
  auth_error_required: string;
  auth_error_invalid_email: string;
  auth_error_password_length: string;
  auth_error_password_match: string;
  auth_error_terms: string;
  auth_company_name: string;
  auth_phone: string;
  auth_creating_account: string;
  auth_account_created_success: string;
  auth_authenticating: string;
  auth_email_confirm_notice: string;
  auth_confirm_email_sub: string;
  auth_forgot_sent: string;
  auth_forgot_sub: string;

  // Actions & States
  action_save: string;
  action_cancel: string;
  action_delete: string;
  action_edit: string;
  action_close: string;
  action_confirm: string;
  action_add: string;
  action_filter: string;
  action_clear_filter: string;
  action_search: string;
  action_export: string;
  action_details: string;
  action_back: string;
  state_loading: string;
  state_empty: string;
  state_no_data: string;
  state_success: string;
  state_error: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  pt: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_sales: 'Vendas',
    nav_customers: 'Clientes',
    nav_products: 'Produtos',
    nav_finances: 'Finanças',
    nav_reports: 'Relatórios',
    nav_marketing: 'Marketing',
    nav_geo_analytics: 'Analytics Geográfico',
    nav_integrations: 'Integrações',
    nav_settings: 'Configurações',
    nav_logout: 'Sair da Conta',

    // Header & Global
    search_placeholder: 'Pesquisar vendas, clientes, produtos, pedidos...',
    select_store: 'Selecionar Loja',
    all_stores: 'Todas as Lojas (Consolidado)',
    notifications: 'Notificações',
    mark_all_read: 'Marcar todas como lidas',
    no_notifications: 'Nenhuma notificação nova no momento.',
    currency: 'Moeda',
    language: 'Idioma',
    live_data: 'Dados em Tempo Real',
    demo_data: 'Modo Demonstração',
    sync_now: 'Sincronizar',
    last_synced: 'Última sincronização',
    just_now: 'agora mesmo',

    // Time periods
    period_today: 'Hoje',
    period_yesterday: 'Ontem',
    period_this_week: 'Esta semana',
    period_last_week: 'Semana passada',
    period_7d: 'Últimos 7 dias',
    period_14d: 'Últimos 14 dias',
    period_this_month: 'Este mês',
    period_last_month: 'Mês passado',
    period_30d: 'Últimos 30 dias',
    period_90d: 'Últimos 90 dias',
    period_3m: 'Últimos 3 meses',
    period_6m: 'Últimos 6 meses',
    period_this_year: 'Este ano',
    period_last_year: 'Ano passado',
    period_12m: 'Últimos 12 meses',
    period_specific_year: 'Ano específico',
    period_specific_month: 'Mês específico',
    period_specific_week: 'Semana específica',
    period_specific_day: 'Dia específico',
    period_custom: 'Período personalizado',
    period_custom_range: 'Período personalizado',
    period_start_date: 'Data inicial',
    period_end_date: 'Data final',
    period_apply: 'Aplicar período',

    // Dashboard
    dash_total_revenue: 'Receita Total',
    dash_sales_count: 'Total de Vendas',
    dash_net_profit: 'Lucro Líquido',
    dash_avg_ticket: 'Ticket Médio (AOV)',
    dash_total_customers: 'Clientes Cadastrados',
    dash_products_sold: 'Produtos Vendidos',
    dash_vs_previous: 'vs. período anterior',
    dash_revenue_profit_chart: 'Evolução de Receita & Lucro',
    dash_sales_trend: 'Volume de Vendas Diárias',
    dash_top_products: 'Produtos Mais Vendidos',
    dash_recent_orders: 'Últimas Vendas Realizadas',
    dash_recent_activity: 'Atividades Recentes',
    dash_quick_actions: 'Ações Rápidas',
    dash_view_all: 'Ver todos',
    dash_gross_revenue: 'Receita Bruta',
    dash_expenses: 'Despesas Totais',
    dash_margin: 'Margem Líquida',

    // Sales
    sales_title: 'Gestão de Vendas',
    sales_subtitle: 'Acompanhe, filtre e gerencie todos os pedidos em tempo real.',
    sales_add_new: 'Nova Venda',
    sales_new_sale: 'Nova Venda',
    sales_edit: 'Editar Venda',
    sales_delete: 'Excluir Venda',
    sales_search: 'Buscar por nº do pedido, cliente, e-mail ou produto...',
    sales_overview: 'Visão Geral de Pedidos',
    sales_refunds: 'Reembolsos & Devoluções',
    sales_total_sales: 'Receita de Vendas',
    sales_paid_orders: 'Pedidos Aprovados',
    sales_avg_ticket: 'Ticket Médio',
    sales_refund_rate: 'Taxa de Reembolso',
    sales_country: 'País / Região',
    sales_filter_status: 'Status',
    sales_filter_payment: 'Forma de Pagamento',
    sales_filter_period: 'Período',
    sales_order_number: 'Pedido',
    sales_customer: 'Cliente',
    sales_date: 'Data / Hora',
    sales_items: 'Itens',
    sales_total: 'Valor Total',
    sales_status: 'Status',
    sales_payment_method: 'Método de Pagamento',
    sales_actions: 'Ações',
    sales_status_paid: 'Pago',
    sales_status_pending: 'Pendente',
    sales_status_cancelled: 'Cancelado',
    sales_status_refunded: 'Reembolsado',
    sales_details: 'Detalhes da Venda',
    sales_confirm_delete: 'Confirmar Exclusão de Venda',
    sales_confirm_delete_msg: 'Tem certeza de que deseja excluir permanentemente esta venda? Esta ação não pode ser desfeita.',
    sales_no_orders: 'Nenhuma venda encontrada com os filtros aplicados.',
    sales_tab_funnel: 'Funil de Vendas',
    sales_funnel_title: 'Funil de Conversão & Jornada do Cliente',
    sales_funnel_subtitle: 'Visão aprofundada de todas as etapas do cliente: tráfego, consideração, intenção, checkout, venda e recompra.',
    geo_funnel_title: 'Funil da Jornada do Cliente Geográfico',
    geo_funnel_subtitle: 'Acompanhe a retenção, conversão e pontos de atrito em cada etapa por país e mercado regional.',
    funnel_customer_stages: 'Todas as Etapas do Cliente',
    funnel_step_visitors: '1. Descoberta & Visitantes',
    funnel_step_views: '2. Visualização de Produto',
    funnel_step_cart: '3. Adição ao Carrinho',
    funnel_step_checkout: '4. Checkout Iniciado',
    funnel_step_purchase: '5. Venda Concluída',
    funnel_step_retention: '6. Recompra & Retenção',

    // Customers
    cust_title: 'Gestão de Clientes',
    cust_subtitle: 'Base completa de clientes, histórico de compras e LTV.',
    cust_add_new: 'Novo Cliente',
    cust_edit: 'Editar Cliente',
    cust_delete: 'Excluir Cliente',
    cust_search: 'Buscar cliente por nome, e-mail, telefone ou cidade...',
    cust_name: 'Nome do Cliente',
    cust_email: 'E-mail',
    cust_phone: 'Telefone',
    cust_location: 'Localização',
    cust_country: 'País',
    cust_orders_count: 'Pedidos',
    cust_total_spent: 'Total Gasto',
    cust_total_customers: 'Total de Clientes',
    cust_avg_ltv: 'LTV Médio',
    cust_repeat_rate: 'Taxa de Recompra',
    cust_vip_tier: 'Clientes VIP',
    cust_ltv: 'LTV Total',
    cust_last_order: 'Último Pedido',
    cust_last_purchase: 'Última Compra',
    cust_status: 'Status',
    cust_status_active: 'Ativo',
    cust_status_inactive: 'Inativo',
    cust_status_vip: 'VIP',
    cust_details: 'Perfil do Cliente',
    cust_purchase_history: 'Histórico de Compras',
    cust_confirm_delete: 'Confirmar Exclusão de Cliente',
    cust_confirm_delete_msg: 'Tem certeza de que deseja excluir este cliente? O histórico de compras será arquivado.',
    cust_no_customers: 'Nenhum cliente cadastrado ou encontrado na pesquisa.',

    // Products
    prod_title: 'Catálogo de Produtos',
    prod_subtitle: 'Gestão de estoque, precificação, custos e desempenho comercial.',
    prod_add_new: 'Novo Produto',
    prod_edit: 'Editar Produto',
    prod_delete: 'Excluir Produto',
    prod_search: 'Buscar por nome do produto, código SKU ou categoria...',
    prod_name: 'Nome do Produto',
    prod_sku: 'SKU / Código',
    prod_category: 'Categoria',
    prod_price: 'Preço de Venda',
    prod_cost: 'Custo Unitário',
    prod_stock: 'Estoque Atual',
    prod_sales: 'Unidades Vendidas',
    prod_revenue: 'Receita Gerada',
    prod_units_sold: 'Unidades Vendidas',
    prod_profit: 'Lucro do Produto',
    prod_low_stock: 'Estoque Baixo',
    prod_low_stock_warning: 'Atenção: produtos com estoque crítico necessitam de reposição imediata.',
    prod_in_stock: 'Em Estoque',
    prod_performance: 'Desempenho Comercial',
    prod_confirm_delete: 'Confirmar Exclusão de Produto',
    prod_confirm_delete_msg: 'Tem certeza de que deseja excluir este produto do catálogo?',
    prod_no_products: 'Nenhum produto cadastrado no catálogo.',

    // Finances
    fin_title: 'Gestão Financeira',
    fin_subtitle: 'Controle de fluxo de caixa, receitas, despesas e margens de lucro.',
    fin_add_transaction: 'Nova Transação',
    fin_revenue: 'Receitas Totais',
    fin_expenses: 'Despesas Totais',
    fin_profit: 'Lucro Líquido Real',
    fin_total_income: 'Entradas Totais',
    fin_total_expenses: 'Saídas Totais',
    fin_net_profit: 'Resultado Líquido',
    fin_net_margin: 'Margem Operacional',
    fin_cash_flow: 'Fluxo de Caixa',
    fin_receivable: 'Contas a Receber',
    fin_payable: 'Contas a Pagar',
    fin_evolution: 'Evolução Financeira Mensal',
    fin_transactions: 'Extrato de Lançamentos',
    fin_type: 'Tipo de Lançamento',
    fin_type_income: 'Receita (+)',
    fin_type_expense: 'Despesa (-)',
    fin_description: 'Descrição do Lançamento',
    fin_amount: 'Valor',
    fin_category: 'Categoria Financeira',
    fin_date: 'Data do Lançamento',
    fin_due_date: 'Data de Vencimento / Pagamento',
    fin_status_settled: 'Liquidado',
    fin_status_pending: 'A Liquidar',
    fin_confirm_delete: 'Confirmar Exclusão de Lançamento',
    fin_confirm_delete_msg: 'Tem certeza de que deseja remover esta transação financeira?',

    // Reports
    rep_title: 'Central de Relatórios & Analytics',
    rep_subtitle: 'Visão detalhada e relatórios executivos para tomada de decisão.',
    rep_select_period: 'Selecionar Período de Análise',
    rep_export: 'Exportar Relatório',
    rep_export_csv: 'Exportar CSV / Planilha',
    rep_print: 'Imprimir Relatório',
    rep_executive_summary: 'Resumo Executivo do Período',
    rep_overview_summary: 'Resumo Executivo do Período',
    rep_channel_breakdown: 'Desempenho por Canal de Vendas',
    rep_top_performing_products: 'Ranking de Rentabilidade por Produto',
    rep_geo_distribution: 'Distribuição Geográfica de Vendas',
    rep_payment_methods: 'Distribuição por Forma de Pagamento',
    rep_metrics_comparison: 'Comparativo de Indicadores',
    rep_conversion_funnel: 'Funil de Conversão Comercial',

    // Marketing & Integrations
    mkt_title: 'Marketing & Tráfego Pago',
    mkt_campaigns: 'Campanhas',
    mkt_campaign: 'Campanha',
    mkt_channel: 'Canal',
    mkt_ad_sets: 'Conjuntos de Anúncios',
    mkt_creatives: 'Criativos & Anúncios',
    mkt_all_channels: 'Todos os Canais',
    mkt_spend: 'Investimento em Ads',
    mkt_total_spend: 'Gasto Total em Ads',
    mkt_revenue: 'Receita Atribuída',
    mkt_attributed_rev: 'Receita Atribuída',
    mkt_roas: 'ROAS Médio',
    mkt_blended_roas: 'ROAS Consolidado',
    mkt_cpa: 'CPA Médio',
    mkt_cpa_avg: 'CPA Médio Global',
    mkt_status: 'Status',
    mkt_conversions: 'Conversões',
    int_title: 'Integrações & Conexões',
    int_connect: 'Conectar Plataforma',
    int_connected: 'Conectado',
    int_disconnect: 'Desconectar',
    int_sync: 'Sincronizar',
    int_events_tracked: 'Eventos Monitorados',
    integ_connected_platforms: 'Plataformas Conectadas',
    integ_live_debugger: 'Depurador de Eventos em Tempo Real',
    integ_sync_all: 'Sincronizar Todas',
    integ_connect_platform: 'Conectar Nova Plataforma',
    integ_disconnect: 'Desconectar',

    // Analytics & AI Insights
    ana_funnel: 'Funil de Conversão',
    ana_attribution: 'Atribuição Multi-Toque',
    ana_utm: 'Parâmetros UTM',
    ana_devices: 'Dispositivos & Hardware',
    ai_all_insights: 'Todos os Insights de IA',

    // Settings
    set_title: 'Configurações do Sistema',
    set_profile: 'Meu Perfil',
    set_stores: 'Lojas & Canais',
    set_team: 'Equipe & Permissões',
    set_currency_lang: 'Moeda & Idioma',
    set_api_keys: 'Chaves de API & Webhooks',
    set_billing: 'Faturamento & Plano',
    set_tab_profile: 'Meu Perfil',
    set_tab_company: 'Dados da Empresa',
    set_tab_preferences: 'Preferências',
    set_tab_language: 'Idioma & Região',
    set_tab_notifications: 'Notificações',
    set_tab_security: 'Segurança & Acesso',
    set_tab_account: 'Minha Conta',
    set_save_changes: 'Salvar Alterações',
    set_saved_success: 'Configurações atualizadas com sucesso!',
    set_user_name: 'Nome Completo',
    set_user_email: 'E-mail da Conta',
    set_user_role: 'Cargo de Acesso',
    set_company_name: 'Nome da Empresa / Marca',
    set_company_doc: 'CNPJ / Documento',
    set_default_currency: 'Moeda Principal do Sistema',
    set_timezone: 'Fuso Horário',
    set_email_notifications: 'Receber resumo diário de desempenho por e-mail',
    set_sales_alerts: 'Receber alertas imediatos de vendas em tempo real',
    set_security_pass: 'Senha Atual',
    set_new_pass: 'Nova Senha',
    set_confirm_pass: 'Confirmar Nova Senha',
    set_change_pass_btn: 'Atualizar Senha',

    // Auth (Login & Register)
    auth_welcome: 'Bem-vindo ao AH19',
    auth_welcome_sub: 'A plataforma definitiva de inteligência financeira e gestão de vendas para sua empresa.',
    auth_login_title: 'Acesse sua Conta',
    auth_register_title: 'Criar Nova Conta',
    auth_name: 'Nome Completo',
    auth_email: 'E-mail Profissional',
    auth_password: 'Senha',
    auth_confirm_password: 'Confirmar Senha',
    auth_remember_me: 'Lembrar de mim neste dispositivo',
    auth_forgot_password: 'Esqueceu sua senha?',
    auth_sign_in_btn: 'Entrar na Plataforma',
    auth_sign_up_btn: 'Criar Minha Conta',
    auth_continue_google: 'Continuar com Google',
    auth_signup_google: 'Cadastrar com Google',
    auth_or_divider: 'ou continue com e-mail',
    auth_have_account: 'Já possui uma conta ativa?',
    auth_no_account: 'Ainda não tem conta?',
    auth_sign_up_link: 'Cadastre-se gratuitamente',
    auth_sign_in_link: 'Acessar minha conta',
    auth_accept_terms: 'Li e concordo com os Termos de Uso e Política de Privacidade.',
    auth_demo_access: 'Acesso Rápido Demo',
    auth_demo_access_sub: 'Clique para navegar imediatamente pela plataforma com dados pré-carregados de inteligência.',
    auth_error_required: 'Este campo é obrigatório.',
    auth_error_invalid_email: 'Por favor, insira um e-mail válido.',
    auth_error_password_length: 'A senha deve ter pelo menos 6 caracteres.',
    auth_error_password_match: 'As senhas não coincidem.',
    auth_error_terms: 'Você deve aceitar os termos de serviço para prosseguir.',
    auth_company_name: 'Nome da Empresa (Opcional)',
    auth_phone: 'Telefone / WhatsApp (Opcional)',
    auth_creating_account: 'Criando sua conta...',
    auth_account_created_success: 'Conta criada com sucesso.',
    auth_authenticating: 'Autenticando...',
    auth_email_confirm_notice: 'Confirmação de e-mail enviada!',
    auth_confirm_email_sub: 'Enviamos um link de ativação para seu endereço. Por favor, confirme seu e-mail para acessar o painel.',
    auth_forgot_sent: 'Instruções de recuperação foram enviadas para seu e-mail!',
    auth_forgot_sub: 'Digite seu e-mail para receber as instruções de recuperação.',

    // Actions & States
    action_save: 'Salvar',
    action_cancel: 'Cancelar',
    action_delete: 'Excluir',
    action_edit: 'Editar',
    action_close: 'Fechar',
    action_confirm: 'Confirmar',
    action_add: 'Adicionar',
    action_filter: 'Filtrar',
    action_clear_filter: 'Limpar Filtros',
    action_search: 'Buscar',
    action_export: 'Exportar',
    action_details: 'Ver Detalhes',
    action_back: 'Voltar',
    state_loading: 'Carregando dados...',
    state_empty: 'Nenhum registro encontrado.',
    state_no_data: 'Nenhum dado disponível.',
    state_success: 'Operação realizada com sucesso!',
    state_error: 'Ocorreu um erro ao processar a solicitação.',
  },

  en: {
    // Navigation
    nav_dashboard: 'Dashboard',
    nav_sales: 'Sales',
    nav_customers: 'Customers',
    nav_products: 'Products',
    nav_finances: 'Finances',
    nav_reports: 'Reports',
    nav_marketing: 'Marketing',
    nav_geo_analytics: 'Geographic Analytics',
    nav_integrations: 'Integrations',
    nav_settings: 'Settings',
    nav_logout: 'Sign Out',

    // Header & Global
    search_placeholder: 'Search sales, customers, products, orders...',
    select_store: 'Select Store',
    all_stores: 'All Stores (Consolidated)',
    notifications: 'Notifications',
    mark_all_read: 'Mark all as read',
    no_notifications: 'No new notifications right now.',
    currency: 'Currency',
    language: 'Language',
    live_data: 'Live Data Stream',
    demo_data: 'Demo Mode',
    sync_now: 'Sync Data',
    last_synced: 'Last synced',
    just_now: 'just now',

    // Time periods
    period_today: 'Today',
    period_yesterday: 'Yesterday',
    period_this_week: 'This week',
    period_last_week: 'Last week',
    period_7d: 'Last 7 days',
    period_14d: 'Last 14 days',
    period_this_month: 'This month',
    period_last_month: 'Last month',
    period_30d: 'Last 30 days',
    period_90d: 'Last 90 days',
    period_3m: 'Last 3 months',
    period_6m: 'Last 6 months',
    period_this_year: 'This year',
    period_last_year: 'Last year',
    period_12m: 'Last 12 months',
    period_specific_year: 'Specific year',
    period_specific_month: 'Specific month',
    period_specific_week: 'Specific week',
    period_specific_day: 'Specific day',
    period_custom: 'Custom range',
    period_custom_range: 'Custom range',
    period_start_date: 'Start date',
    period_end_date: 'End date',
    period_apply: 'Apply period',

    // Dashboard
    dash_total_revenue: 'Total Revenue',
    dash_sales_count: 'Total Sales',
    dash_net_profit: 'Net Profit',
    dash_avg_ticket: 'Average Order Value (AOV)',
    dash_total_customers: 'Registered Customers',
    dash_products_sold: 'Products Sold',
    dash_vs_previous: 'vs. previous period',
    dash_revenue_profit_chart: 'Revenue & Profit Evolution',
    dash_sales_trend: 'Daily Sales Volume',
    dash_top_products: 'Top Selling Products',
    dash_recent_orders: 'Recent Sales Orders',
    dash_recent_activity: 'Recent Activity',
    dash_quick_actions: 'Quick Actions',
    dash_view_all: 'View all',
    dash_gross_revenue: 'Gross Revenue',
    dash_expenses: 'Total Expenses',
    dash_margin: 'Net Margin',

    // Sales
    sales_title: 'Sales Management',
    sales_subtitle: 'Track, filter, and manage all your commerce orders in real time.',
    sales_add_new: 'New Sale',
    sales_new_sale: 'New Sale',
    sales_edit: 'Edit Sale',
    sales_delete: 'Delete Sale',
    sales_search: 'Search by order number, customer, email, or product...',
    sales_overview: 'Orders Overview',
    sales_refunds: 'Refunds & Returns',
    sales_total_sales: 'Sales Revenue',
    sales_paid_orders: 'Approved Orders',
    sales_avg_ticket: 'Average Order Value',
    sales_refund_rate: 'Refund Rate',
    sales_country: 'Country / Region',
    sales_filter_status: 'Status',
    sales_filter_payment: 'Payment Method',
    sales_filter_period: 'Period',
    sales_order_number: 'Order',
    sales_customer: 'Customer',
    sales_date: 'Date / Time',
    sales_items: 'Items',
    sales_total: 'Total Amount',
    sales_status: 'Status',
    sales_payment_method: 'Payment Method',
    sales_actions: 'Actions',
    sales_status_paid: 'Paid',
    sales_status_pending: 'Pending',
    sales_status_cancelled: 'Cancelled',
    sales_status_refunded: 'Refunded',
    sales_details: 'Sale Details',
    sales_confirm_delete: 'Confirm Sale Deletion',
    sales_confirm_delete_msg: 'Are you sure you want to permanently delete this sale? This action cannot be undone.',
    sales_no_orders: 'No sales found matching the selected filters.',
    sales_tab_funnel: 'Sales Funnel',
    sales_funnel_title: 'Conversion Funnel & Customer Journey',
    sales_funnel_subtitle: 'In-depth overview across all customer lifecycle stages: discovery, consideration, intent, checkout, purchase, and retention.',
    geo_funnel_title: 'Geographic Customer Journey Funnel',
    geo_funnel_subtitle: 'Monitor retention, step-by-step conversion, and regional friction points by country and market.',
    funnel_customer_stages: 'All Customer Stages',
    funnel_step_visitors: '1. Discovery & Visitors',
    funnel_step_views: '2. Product Page Views',
    funnel_step_cart: '3. Add to Cart',
    funnel_step_checkout: '4. Initiated Checkout',
    funnel_step_purchase: '5. Completed Purchase',
    funnel_step_retention: '6. Repeat & Retention',

    // Customers
    cust_title: 'Customer Directory',
    cust_subtitle: 'Full client base, historical purchases, and customer lifetime value.',
    cust_add_new: 'New Customer',
    cust_edit: 'Edit Customer',
    cust_delete: 'Delete Customer',
    cust_search: 'Search customer by name, email, phone, or city...',
    cust_name: 'Customer Name',
    cust_email: 'Email Address',
    cust_phone: 'Phone Number',
    cust_location: 'Location',
    cust_country: 'Country',
    cust_orders_count: 'Orders',
    cust_total_spent: 'Total Spent',
    cust_total_customers: 'Total Customers',
    cust_avg_ltv: 'Average LTV',
    cust_repeat_rate: 'Repeat Purchase Rate',
    cust_vip_tier: 'VIP Clients',
    cust_ltv: 'Total LTV',
    cust_last_order: 'Last Order',
    cust_last_purchase: 'Last Purchase',
    cust_status: 'Status',
    cust_status_active: 'Active',
    cust_status_inactive: 'Inactive',
    cust_status_vip: 'VIP',
    cust_details: 'Customer Profile',
    cust_purchase_history: 'Purchase History',
    cust_confirm_delete: 'Confirm Customer Deletion',
    cust_confirm_delete_msg: 'Are you sure you want to delete this customer? Purchase history will be archived.',
    cust_no_customers: 'No customers registered or found.',

    // Products
    prod_title: 'Product Catalog',
    prod_subtitle: 'Inventory management, pricing tiers, unit costs, and commercial performance.',
    prod_add_new: 'New Product',
    prod_edit: 'Edit Product',
    prod_delete: 'Delete Product',
    prod_search: 'Search by product name, SKU code, or category...',
    prod_name: 'Product Name',
    prod_sku: 'SKU / Code',
    prod_category: 'Category',
    prod_price: 'Sale Price',
    prod_cost: 'Unit Cost',
    prod_stock: 'Current Stock',
    prod_sales: 'Units Sold',
    prod_revenue: 'Revenue Generated',
    prod_units_sold: 'Units Sold',
    prod_profit: 'Product Profit',
    prod_low_stock: 'Low Stock',
    prod_low_stock_warning: 'Warning: items with critical stock levels require immediate replenishment.',
    prod_in_stock: 'In Stock',
    prod_performance: 'Product Performance',
    prod_confirm_delete: 'Confirm Product Deletion',
    prod_confirm_delete_msg: 'Are you sure you want to delete this product from your catalog?',
    prod_no_products: 'No products in the catalog.',

    // Finances
    fin_title: 'Financial Management',
    fin_subtitle: 'Cash flow tracking, income, operating expenses, and profit margins.',
    fin_add_transaction: 'New Transaction',
    fin_revenue: 'Total Income',
    fin_expenses: 'Total Expenses',
    fin_profit: 'Net Operating Profit',
    fin_total_income: 'Total Inflow',
    fin_total_expenses: 'Total Outflow',
    fin_net_profit: 'Net Profit',
    fin_net_margin: 'Operating Margin',
    fin_cash_flow: 'Cash Flow',
    fin_receivable: 'Accounts Receivable',
    fin_payable: 'Accounts Payable',
    fin_evolution: 'Monthly Financial Trend',
    fin_transactions: 'Financial Ledger',
    fin_type: 'Transaction Type',
    fin_type_income: 'Income (+)',
    fin_type_expense: 'Expense (-)',
    fin_description: 'Description',
    fin_amount: 'Amount',
    fin_category: 'Category',
    fin_date: 'Entry Date',
    fin_due_date: 'Due / Payment Date',
    fin_status_settled: 'Settled',
    fin_status_pending: 'Pending',
    fin_confirm_delete: 'Confirm Transaction Deletion',
    fin_confirm_delete_msg: 'Are you sure you want to remove this financial transaction?',

    // Reports
    rep_title: 'Reports & Analytics Center',
    rep_subtitle: 'In-depth business intelligence and executive summaries for decision makers.',
    rep_select_period: 'Select Analysis Period',
    rep_export: 'Export Report',
    rep_export_csv: 'Export CSV / Spreadsheet',
    rep_print: 'Print Report',
    rep_executive_summary: 'Executive Summary',
    rep_overview_summary: 'Executive Summary',
    rep_channel_breakdown: 'Sales Channel Performance',
    rep_top_performing_products: 'Product Profitability Ranking',
    rep_geo_distribution: 'Geographic Sales Distribution',
    rep_payment_methods: 'Payment Method Breakdown',
    rep_metrics_comparison: 'Key Metrics Comparison',
    rep_conversion_funnel: 'Sales Conversion Funnel',

    // Marketing & Integrations
    mkt_title: 'Marketing & Paid Acquisition',
    mkt_campaigns: 'Campaigns',
    mkt_campaign: 'Campaign',
    mkt_channel: 'Channel',
    mkt_ad_sets: 'Ad Sets',
    mkt_creatives: 'Creatives & Ads',
    mkt_all_channels: 'All Channels',
    mkt_spend: 'Ad Spend',
    mkt_total_spend: 'Total Ad Spend',
    mkt_revenue: 'Attributed Revenue',
    mkt_attributed_rev: 'Attributed Revenue',
    mkt_roas: 'Average ROAS',
    mkt_blended_roas: 'Blended ROAS',
    mkt_cpa: 'Average CPA',
    mkt_cpa_avg: 'Global Average CPA',
    mkt_status: 'Status',
    mkt_conversions: 'Conversions',
    int_title: 'Integrations & Connections',
    int_connect: 'Connect Platform',
    int_connected: 'Connected',
    int_disconnect: 'Disconnect',
    int_sync: 'Sync Now',
    int_events_tracked: 'Events Tracked',
    integ_connected_platforms: 'Connected Platforms',
    integ_live_debugger: 'Real-Time Event Stream Debugger',
    integ_sync_all: 'Sync All Platforms',
    integ_connect_platform: 'Connect New Platform',
    integ_disconnect: 'Disconnect',

    // Analytics & AI Insights
    ana_funnel: 'Conversion Funnel',
    ana_attribution: 'Multi-Touch Attribution',
    ana_utm: 'UTM Parameters',
    ana_devices: 'Device & Hardware',
    ai_all_insights: 'All AI Strategic Insights',

    // Settings
    set_title: 'System Settings',
    set_profile: 'My Profile',
    set_stores: 'Stores & Channels',
    set_team: 'Team & Permissions',
    set_currency_lang: 'Currency & Language',
    set_api_keys: 'API Keys & Webhooks',
    set_billing: 'Billing & Plan',
    set_tab_profile: 'My Profile',
    set_tab_company: 'Company Info',
    set_tab_preferences: 'Preferences',
    set_tab_language: 'Language & Region',
    set_tab_notifications: 'Notifications',
    set_tab_security: 'Security & Access',
    set_tab_account: 'My Account',
    set_save_changes: 'Save Changes',
    set_saved_success: 'Settings updated successfully!',
    set_user_name: 'Full Name',
    set_user_email: 'Account Email',
    set_user_role: 'Access Role',
    set_company_name: 'Company / Brand Name',
    set_company_doc: 'Tax ID / Registration',
    set_default_currency: 'Primary Currency',
    set_timezone: 'Timezone',
    set_email_notifications: 'Receive daily performance email digests',
    set_sales_alerts: 'Receive immediate real-time sales alerts',
    set_security_pass: 'Current Password',
    set_new_pass: 'New Password',
    set_confirm_pass: 'Confirm New Password',
    set_change_pass_btn: 'Update Password',

    // Auth (Login & Register)
    auth_welcome: 'Welcome to AH19',
    auth_welcome_sub: 'The ultimate financial intelligence and commerce management platform for your business.',
    auth_login_title: 'Sign In to Your Account',
    auth_register_title: 'Create Your Account',
    auth_name: 'Full Name',
    auth_email: 'Email Address',
    auth_password: 'Password',
    auth_confirm_password: 'Confirm Password',
    auth_remember_me: 'Remember me on this device',
    auth_forgot_password: 'Forgot your password?',
    auth_sign_in_btn: 'Sign In',
    auth_sign_up_btn: 'Create Account',
    auth_continue_google: 'Continue with Google',
    auth_signup_google: 'Sign up with Google',
    auth_or_divider: 'or continue with email',
    auth_have_account: 'Already have an active account?',
    auth_no_account: "Don't have an account yet?",
    auth_sign_up_link: 'Sign up for free',
    auth_sign_in_link: 'Sign in now',
    auth_accept_terms: 'I have read and agree to the Terms of Service and Privacy Policy.',
    auth_demo_access: 'Instant Demo Access',
    auth_demo_access_sub: 'Click to explore the platform immediately with preloaded business intelligence data.',
    auth_error_required: 'This field is required.',
    auth_error_invalid_email: 'Please enter a valid email address.',
    auth_error_password_length: 'Password must be at least 6 characters.',
    auth_error_password_match: 'Passwords do not match.',
    auth_error_terms: 'You must accept the terms of service to proceed.',
    auth_company_name: 'Company Name (Optional)',
    auth_phone: 'Phone / WhatsApp (Optional)',
    auth_creating_account: 'Creating your account...',
    auth_account_created_success: 'Account created successfully.',
    auth_authenticating: 'Authenticating...',
    auth_email_confirm_notice: 'Email confirmation sent!',
    auth_confirm_email_sub: 'We have sent an activation link to your email. Please verify your address to access the dashboard.',
    auth_forgot_sent: 'Password recovery instructions have been sent to your email!',
    auth_forgot_sub: 'Enter your email address to receive a password reset link.',

    // Actions & States
    action_save: 'Save',
    action_cancel: 'Cancel',
    action_delete: 'Delete',
    action_edit: 'Edit',
    action_close: 'Close',
    action_confirm: 'Confirm',
    action_add: 'Add',
    action_filter: 'Filter',
    action_clear_filter: 'Clear Filters',
    action_search: 'Search',
    action_export: 'Export',
    action_details: 'View Details',
    action_back: 'Back',
    state_loading: 'Loading data...',
    state_empty: 'No records found.',
    state_no_data: 'No data available.',
    state_success: 'Operation completed successfully!',
    state_error: 'An error occurred while processing your request.',
  },
};
