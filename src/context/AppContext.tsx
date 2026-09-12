import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  DateFilterRange,
  Currency,
  StoreId,
  DataMode,
  MainNavId,
  KPIData,
  ChartDataPoint,
  CountrySale,
  OrderItem,
  ProductItem,
  CustomerItem,
  RefundItem,
  AdPlatformMetric,
  CampaignItem,
  CreativeItem,
  FunnelStage,
  AttributionModelComparison,
  UTMRecord,
  IntegrationItem,
  EventStreamItem,
  AIInsightItem,
  NotificationItem,
  AppSettings,
  AdSetItem,
  TransactionItem,
  AuthUser,
  Language,
  OnboardingResponses,
} from '../types';
import {
  CURRENCY_RATES,
  STORE_WEIGHTS,
  DATE_RANGE_CONFIGS,
  BASE_KPIS,
  RAW_DAILY_CHART,
  RAW_COUNTRIES,
  RAW_ORDERS,
  RAW_PRODUCTS,
  RAW_CUSTOMERS,
  RAW_REFUNDS,
  RAW_AD_PLATFORMS,
  RAW_CAMPAIGNS,
  RAW_CREATIVES,
  RAW_FUNNEL_DATA,
  RAW_ATTRIBUTION_MODELS,
  RAW_UTM_RECORDS,
  INITIAL_INTEGRATIONS,
  INITIAL_EVENT_STREAM,
  INITIAL_AI_INSIGHTS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_SETTINGS,
  RAW_TRANSACTIONS,
} from '../data/mockData';
import { TRANSLATIONS, Translations } from '../translations';
import { detectVisitorLocation, trackAnalyticsEvent } from '../services/geoTrackingService';
import { subscribeToOrders } from '../services/supabaseClient';
import {
  registerWithSupabase,
  loginWithSupabase,
  logoutWithSupabase,
  resetPasswordWithSupabase,
  getActiveAuthUser,
  saveOnboardingResponses,
  RegisterParams,
  RegisterResult,
  LoginResult,
  ResetPasswordResult,
  loginWithGoogle as serviceLoginWithGoogle,
  GoogleAuthParams,
} from '../services/supabaseAuthService';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

interface AppContextType {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Auth State
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  authMode: 'login' | 'register' | 'forgot';
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
  authLoading: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  loginWithGoogle: (params?: GoogleAuthParams) => Promise<LoginResult>;
  registerUser: (
    paramsOrName: RegisterParams | string,
    legacyEmail?: string,
    legacyPass?: string
  ) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<ResetPasswordResult>;
  completeOnboarding: (responses: OnboardingResponses) => Promise<void>;

  // Navigation & Routing
  activeNav: MainNavId;
  activeSubTab: string;
  selectedEntityId: string | null;
  navigate: (nav: MainNavId, subTab?: string, entityId?: string | null) => void;
  goBack: () => void;

  // Global Filters
  dateRange: DateFilterRange;
  setDateRange: (range: DateFilterRange) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
  dateRangeLabel: string;

  selectedStore: StoreId;
  setSelectedStore: (store: StoreId) => void;
  stores: { id: StoreId; name: string; badge?: string }[];

  currency: Currency;
  setCurrency: (c: Currency) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (c: Currency) => void;
  currencySymbol: string;
  formatCurrency: (rawAmountInUSD: number) => string;

  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;

  // Refresh & Sync status
  isRefreshing: boolean;
  lastSyncedText: string;
  refreshData: () => Promise<void>;

  // Calculated / Filtered data sets
  kpis: KPIData[];
  chartData: ChartDataPoint[];
  countries: CountrySale[];
  selectedCountry: CountrySale | null;

  // Sales (Orders) CRUD
  orders: OrderItem[];
  selectedOrder: OrderItem | null;
  setSelectedOrder: (order: OrderItem | null) => void;
  addOrder: (newOrder: Partial<OrderItem>) => void;
  updateOrder: (id: string, updated: Partial<OrderItem>) => void;
  deleteOrder: (id: string) => void;

  // Products CRUD
  products: ProductItem[];
  selectedProduct: ProductItem | null;
  setSelectedProduct: (product: ProductItem | null) => void;
  addProduct: (newProd: Partial<ProductItem>) => void;
  updateProduct: (id: string, updated: Partial<ProductItem>) => void;
  deleteProduct: (id: string) => void;

  // Customers CRUD
  customers: CustomerItem[];
  selectedCustomer: CustomerItem | null;
  setSelectedCustomer: (customer: CustomerItem | null) => void;
  addCustomer: (newCust: Partial<CustomerItem>) => void;
  updateCustomer: (id: string, updated: Partial<CustomerItem>) => void;
  deleteCustomer: (id: string) => void;

  // Finances (Transactions) CRUD
  transactions: TransactionItem[];
  addTransaction: (newTx: Partial<TransactionItem>) => void;
  deleteTransaction: (id: string) => void;

  // Refunds & Marketing
  refunds: RefundItem[];
  adPlatforms: AdPlatformMetric[];
  campaigns: CampaignItem[];
  adSets: AdSetItem[];
  selectedCampaign: CampaignItem | null;
  setSelectedCampaign: (campaign: CampaignItem | null) => void;
  creatives: CreativeItem[];
  selectedCreative: CreativeItem | null;
  setSelectedCreative: (creative: CreativeItem | null) => void;
  funnelData: FunnelStage[];
  attributionModels: AttributionModelComparison[];
  utmRecords: UTMRecord[];
  utmAnalytics: UTMRecord[];

  // Integrations & Events
  integrations: IntegrationItem[];
  toggleIntegrationStatus: (id: string) => void;
  disconnectIntegration: (id: string) => void;
  connectNewIntegration: (name: string, category: string, iconKey: any) => void;
  eventStream: EventStreamItem[];
  selectedEvent: EventStreamItem | null;
  setSelectedEvent: (evt: EventStreamItem | null) => void;

  // AI & Notifications
  aiInsights: AIInsightItem[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Modals & Panels
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  periodSelectorModalOpen: boolean;
  setPeriodSelectorModalOpen: (open: boolean) => void;
  connectModalOpen: boolean;
  setConnectModalOpen: (open: boolean) => void;
  connectModalPlatform: string | null;
  openConnectModal: (platformId?: string) => void;
  closeConnectModal: () => void;
  revenueModalOpen: boolean;
  setRevenueModalOpen: (open: boolean) => void;

  // Confirmation Modal
  confirmModal: ConfirmModalState;
  openConfirmModal: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirmModal: () => void;

  // Form Modals State
  orderModalOpen: boolean;
  setOrderModalOpen: (open: boolean) => void;
  saleModalOpen: boolean;
  setSaleModalOpen: (open: boolean) => void;
  orderToEdit: OrderItem | null;
  setOrderToEdit: (order: OrderItem | null) => void;
  saleToEdit: OrderItem | null;
  setSaleToEdit: (order: OrderItem | null) => void;

  triggerDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;

  customerModalOpen: boolean;
  setCustomerModalOpen: (open: boolean) => void;
  customerToEdit: CustomerItem | null;
  setCustomerToEdit: (cust: CustomerItem | null) => void;

  productModalOpen: boolean;
  setProductModalOpen: (open: boolean) => void;
  productToEdit: ProductItem | null;
  setProductToEdit: (prod: ProductItem | null) => void;

  transactionModalOpen: boolean;
  setTransactionModalOpen: (open: boolean) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: string | Omit<ToastMessage, 'id'>, description?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language initialization
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ah19_language') as Language;
      if (saved === 'pt' || saved === 'en') return saved;
    }
    return 'pt'; // Default Portuguese
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ah19_language', lang);
    }
  };

  const t = useMemo(() => TRANSLATIONS[language], [language]);

  // Auth User & Routing State
  const [authMode, setAuthModeState] = useState<'login' | 'register' | 'forgot'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('register') || path.includes('cadastro')) return 'register';
      if (path.includes('forgot') || path.includes('recuperar')) return 'forgot';
    }
    return 'login';
  });

  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const setAuthMode = (mode: 'login' | 'register' | 'forgot') => {
    setAuthModeState(mode);
    if (typeof window !== 'undefined') {
      const targetPath = mode === 'register' ? '/register' : mode === 'forgot' ? '/forgot-password' : '/login';
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({ authMode: mode }, '', targetPath);
        } catch {}
      }
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('ah19_auth_session');
      const stored = localStorage.getItem('ah19_auth_session_data');
      return session === 'true' && Boolean(stored);
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('ah19_auth_session');
      if (session === 'true') {
        try {
          const stored = localStorage.getItem('ah19_auth_session_data');
          if (stored) return JSON.parse(stored);
        } catch {}
      }
    }
    return null;
  });

  // Verify active session on mount
  useEffect(() => {
    getActiveAuthUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });
  }, []);

  // Synchronize route protection and URL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (!isAuthenticated) {
        if (path.includes('register')) {
          setAuthModeState('register');
        } else if (path.includes('forgot')) {
          setAuthModeState('forgot');
        } else {
          setAuthModeState('login');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Strict URL guarding:
    const currentPath = window.location.pathname.toLowerCase();

    // 1. Visitante sem autenticação NUNCA vê dashboard ou partes internas
    if (!isAuthenticated) {
      if (
        !currentPath.includes('login') &&
        !currentPath.includes('register') &&
        !currentPath.includes('forgot')
      ) {
        try {
          const target = authMode === 'register' ? '/register' : '/login';
          window.history.replaceState({ authMode }, '', target);
        } catch {}
      }
    } else {
      // 2. Usuário autenticado mas sem onboarding NÃO pode acessar dashboard diretamente
      if (!currentUser?.onboarding_completed) {
        if (!currentPath.includes('onboarding')) {
          try {
            window.history.replaceState({ nav: 'onboarding' }, '', '/onboarding');
          } catch {}
        }
      } else {
        // 3. Usuário autenticado e com onboarding concluído
        if (
          currentPath.includes('login') ||
          currentPath.includes('register') ||
          currentPath.includes('forgot') ||
          currentPath.includes('onboarding')
        ) {
          try {
            window.history.replaceState({ nav: 'dashboard' }, '', '/dashboard');
          } catch {}
        }
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isAuthenticated, currentUser?.onboarding_completed, authMode]);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    setAuthLoading(true);
    try {
      const result = await loginWithSupabase(email, pass);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ah19_auth_session', 'true');
        }
        if (!result.user.onboarding_completed) {
          navigate('onboarding' as any);
        } else {
          navigate('dashboard');
        }
        addToast({
          title: language === 'pt' ? 'Bem-vindo de volta!' : 'Welcome back!',
          description: `${result.user.name} • ${result.user.company}`,
          type: 'success',
        });
      } else if (result.error) {
        addToast({
          title: language === 'pt' ? 'Falha no login' : 'Login failed',
          description: result.error,
          type: 'error',
        });
      }
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = async (params?: GoogleAuthParams): Promise<LoginResult> => {
    setAuthLoading(true);
    try {
      const result = await serviceLoginWithGoogle(params);
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('ah19_auth_session', 'true');
        }
        if (!result.user.onboarding_completed) {
          navigate('onboarding' as any);
        } else {
          navigate('dashboard');
        }
        addToast({
          title: language === 'pt' ? 'Conectado com Google!' : 'Connected with Google!',
          description: `${result.user.name} • ${result.user.email}`,
          type: 'success',
        });
      } else if (result.error) {
        addToast({
          title: language === 'pt' ? 'Falha no login com Google' : 'Google sign in failed',
          description: result.error,
          type: 'error',
        });
      }
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const registerUser = async (
    paramsOrName: RegisterParams | string,
    legacyEmail?: string,
    legacyPass?: string
  ): Promise<RegisterResult> => {
    setAuthLoading(true);
    try {
      let params: RegisterParams;
      if (typeof paramsOrName === 'string') {
        params = {
          fullName: paramsOrName,
          email: legacyEmail || '',
          password: legacyPass || '',
        };
      } else {
        params = paramsOrName;
      }

      const result = await registerWithSupabase(params);
      if (result.success) {
        if (result.needsEmailConfirmation) {
          addToast({
            title: t.auth_email_confirm_notice,
            description: t.auth_confirm_email_sub,
            type: 'info',
          });
        } else if (result.user) {
          setCurrentUser(result.user);
          setIsAuthenticated(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ah19_auth_session', 'true');
          }
          // New user MUST complete onboarding quiz
          navigate('onboarding' as any);
          addToast({
            title: language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!',
            description: language === 'pt' ? 'Vamos agora configurar seu SaaS.' : "Let's configure your SaaS.",
            type: 'success',
          });
        }
      } else if (result.error) {
        addToast({
          title: language === 'pt' ? 'Erro no cadastro' : 'Registration error',
          description: result.error,
          type: 'error',
        });
      }
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const completeOnboarding = async (responses: OnboardingResponses): Promise<void> => {
    if (!currentUser) return;
    setAuthLoading(true);
    try {
      await saveOnboardingResponses(currentUser.id, currentUser.company_id || '', responses);
      const updatedUser: AuthUser = {
        ...currentUser,
        onboarding_completed: true,
        onboarding_data: responses,
      };
      setCurrentUser(updatedUser);
      navigate('dashboard');
      addToast({
        title: language === 'pt' ? 'Configuração concluída!' : 'Setup completed!',
        description: language === 'pt' ? 'Seu workspace foi preparado com sucesso.' : 'Your workspace is ready.',
        type: 'success',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setAuthLoading(true);
    try {
      await logoutWithSupabase();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setOrdersList([]);
      setProductsList([]);
      setCustomersList([]);
      setTransactionsList([]);
      setAuthModeState('login');
      if (typeof window !== 'undefined') {
        localStorage.setItem('ah19_auth_session', 'false');
        localStorage.removeItem('ah19_auth_session_data');
        try {
          window.history.replaceState({ authMode: 'login' }, '', '/login');
        } catch {}
      }
      addToast({
        title: language === 'pt' ? 'Sessão encerrada' : 'Signed out',
        description: language === 'pt' ? 'Você saiu da sua conta com segurança.' : 'You have signed out safely.',
        type: 'info',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<ResetPasswordResult> => {
    setAuthLoading(true);
    try {
      const res = await resetPasswordWithSupabase(email);
      if (res.success) {
        addToast({
          title: t.auth_forgot_sent,
          description: res.message || t.auth_forgot_sub,
          type: 'success',
        });
      } else if (res.error) {
        addToast({
          title: language === 'pt' ? 'Erro na recuperação' : 'Recovery error',
          description: res.error,
          type: 'error',
        });
      }
      return res;
    } finally {
      setAuthLoading(false);
    }
  };

  // Navigation
  const [activeNav, setActiveNav] = useState<MainNavId>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').split('/')[0];
      const validNavs: MainNavId[] = [
        'dashboard',
        'overview',
        'sales',
        'customers',
        'products',
        'finances',
        'reports',
        'marketing',
        'countries',
        'analytics',
        'integrations',
        'ai-insights',
        'settings',
      ];
      if (validNavs.includes(path as MainNavId)) {
        return path === 'overview' ? 'dashboard' : (path as MainNavId);
      }
    }
    return 'dashboard';
  });

  const [activeSubTab, setActiveSubTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.replace(/^\//, '').split('/');
      return parts[1] || 'overview';
    }
    return 'overview';
  });

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Global filters
  const [dateRange, setDateRange] = useState<DateFilterRange>('7d');
  const [customDateRange, setCustomDateRange] = useState({ start: '2026-08-01', end: '2026-08-21' });
  const [selectedStore, setSelectedStore] = useState<StoreId>('all');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [dataMode, setDataMode] = useState<DataMode>('demo');

  // Refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('2 min ago');

  // Modals & Panels
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [periodSelectorModalOpen, setPeriodSelectorModalOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectModalPlatform, setConnectModalPlatform] = useState<string | null>(null);

  const openConnectModal = (platformId?: string) => {
    if (platformId) {
      setConnectModalPlatform(platformId);
    }
    setConnectModalOpen(true);
  };

  const closeConnectModal = () => {
    setConnectModalOpen(false);
    setConnectModalPlatform(null);
  };

  const [revenueModalOpen, setRevenueModalOpen] = useState(false);

  // Form Modals
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<OrderItem | null>(null);

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerItem | null>(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const openConfirmModal = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onConfirm: options.onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Drilldown Selected items
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
  const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventStreamItem | null>(null);

  // Dynamic Collections (with LocalStorage / In-memory state)
  const [ordersList, setOrdersList] = useState<OrderItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ah19_auth_session_data');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.id === 'usr_abismar_master') return RAW_ORDERS;
          const compOrders = localStorage.getItem(`ah19_orders_${user.company_id || user.id}`);
          if (compOrders) return JSON.parse(compOrders);
          return [];
        } catch {}
      }
    }
    return [];
  });

  const [productsList, setProductsList] = useState<ProductItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ah19_auth_session_data');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.id === 'usr_abismar_master') {
            return RAW_PRODUCTS.map((p, idx) => ({ ...p, stock: [142, 85, 34, 18, 9, 72][idx] || 50, minStock: 15 }));
          }
          const compProducts = localStorage.getItem(`ah19_products_${user.company_id || user.id}`);
          if (compProducts) return JSON.parse(compProducts);
          return [];
        } catch {}
      }
    }
    return [];
  });

  const [customersList, setCustomersList] = useState<CustomerItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ah19_auth_session_data');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.id === 'usr_abismar_master') return RAW_CUSTOMERS;
          const compCust = localStorage.getItem(`ah19_customers_${user.company_id || user.id}`);
          if (compCust) return JSON.parse(compCust);
          return [];
        } catch {}
      }
    }
    return [];
  });

  const [transactionsList, setTransactionsList] = useState<TransactionItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ah19_auth_session_data');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          if (user.id === 'usr_abismar_master') return RAW_TRANSACTIONS;
          const compTx = localStorage.getItem(`ah19_transactions_${user.company_id || user.id}`);
          if (compTx) return JSON.parse(compTx);
          return [];
        } catch {}
      }
    }
    return [];
  });

  // Switch workspace according to authenticated user
  useEffect(() => {
    if (!currentUser) {
      setOrdersList([]);
      setProductsList([]);
      setCustomersList([]);
      setTransactionsList([]);
      return;
    }

    if (currentUser.id === 'usr_abismar_master') {
      setOrdersList(RAW_ORDERS);
      setProductsList(RAW_PRODUCTS.map((p, idx) => ({ ...p, stock: [142, 85, 34, 18, 9, 72][idx] || 50, minStock: 15 })));
      setCustomersList(RAW_CUSTOMERS);
      setTransactionsList(RAW_TRANSACTIONS);
      setIntegrations(INITIAL_INTEGRATIONS);
    } else {
      const compId = currentUser.company_id || currentUser.id;
      try {
        const savedOrders = localStorage.getItem(`ah19_orders_${compId}`);
        setOrdersList(savedOrders ? JSON.parse(savedOrders) : []);

        const savedProducts = localStorage.getItem(`ah19_products_${compId}`);
        setProductsList(savedProducts ? JSON.parse(savedProducts) : []);

        const savedCustomers = localStorage.getItem(`ah19_customers_${compId}`);
        setCustomersList(savedCustomers ? JSON.parse(savedCustomers) : []);

        const savedTransactions = localStorage.getItem(`ah19_transactions_${compId}`);
        setTransactionsList(savedTransactions ? JSON.parse(savedTransactions) : []);

        const savedIntegrations = localStorage.getItem(`ah19_integrations_${compId}`);
        setIntegrations(
          savedIntegrations
            ? JSON.parse(savedIntegrations)
            : INITIAL_INTEGRATIONS.map((ig) => ({ ...ig, status: 'disconnected' as const, syncStatus: 'idle' as const }))
        );
      } catch {
        setOrdersList([]);
        setProductsList([]);
        setCustomersList([]);
        setTransactionsList([]);
      }
    }
  }, [currentUser?.id, currentUser?.company_id]);

  const [integrations, setIntegrations] = useState<IntegrationItem[]>(INITIAL_INTEGRATIONS);
  const [eventStream, setEventStream] = useState<EventStreamItem[]>(INITIAL_EVENT_STREAM);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('life4billion_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: string | Omit<ToastMessage, 'id'>, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    let newToast: ToastMessage;
    if (typeof toast === 'string') {
      newToast = {
        id,
        title: toast,
        description: description || '',
        type: 'success',
      };
    } else {
      newToast = { ...toast, id };
    }
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerDeleteConfirm = (title: string, message: string, onConfirm: () => void) => {
    openConfirmModal({
      title,
      message,
      confirmText: t.action_delete,
      cancelText: t.action_cancel,
      onConfirm,
    });
  };

  // Browser navigation sync
  const navigate = (nav: MainNavId, subTab: string = 'overview', entityId: string | null = null) => {
    const mappedNav = nav === 'overview' ? 'dashboard' : nav;
    setActiveNav(mappedNav);
    setActiveSubTab(subTab);
    setSelectedEntityId(entityId);

    const path = entityId
      ? `/${mappedNav}/${subTab}/${entityId}`
      : subTab === 'overview'
      ? `/${mappedNav}`
      : `/${mappedNav}/${subTab}`;
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      try {
        window.history.pushState({ nav: mappedNav, subTab, entityId }, '', path);
      } catch {
        // iframe fallback safe
      }
    }
  };

  const goBack = () => {
    navigate('dashboard', 'overview', null);
  };

  // CRUD for Orders
  const addOrder = (newOrder: Partial<OrderItem>) => {
    const orderNumber = `#${Math.floor(10000 + Math.random() * 90000)}`;
    const created: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: newOrder.customer || {
        id: `cust-${Date.now()}`,
        name: 'Cliente VIP',
        email: 'cliente@ah19.com',
        avatar: undefined,
      },
      country: newOrder.country || 'Brasil',
      countryCode: newOrder.countryCode || 'BR',
      flag: newOrder.flag || '🇧🇷',
      amount: newOrder.amount || `$${newOrder.rawAmount || 120}.00`,
      rawAmount: newOrder.rawAmount || 120,
      subtotal: newOrder.subtotal || newOrder.rawAmount || 120,
      discount: newOrder.discount || 0,
      shipping: newOrder.shipping || 0,
      tax: newOrder.tax || 0,
      itemsCount: newOrder.itemsCount || 1,
      items: newOrder.items || [
        {
          id: 'item-custom',
          name: 'Produto Comercial AH19',
          sku: 'AH19-PROD',
          quantity: 1,
          price: newOrder.rawAmount || 120,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=120&auto=format&fit=crop&q=80',
        },
      ],
      status: (newOrder.status as any) || 'Paid',
      paymentMethod: (newOrder.paymentMethod as any) || 'Credit Card',
      storeId: newOrder.storeId || selectedStore,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      device: newOrder.device || 'Mobile',
      trafficSource: newOrder.trafficSource || 'Direct',
      campaign: newOrder.campaign || 'Direct_Sale',
      utm: newOrder.utm || { source: 'direct', medium: 'none', campaign: 'direct' },
    };

    setOrdersList((prev) => [created, ...prev]);
    addToast({
      title: language === 'pt' ? 'Venda adicionada com sucesso!' : 'Sale added successfully!',
      description: `${created.orderNumber} • ${created.amount}`,
      type: 'success',
    });
  };

  const updateOrder = (id: string, updated: Partial<OrderItem>) => {
    setOrdersList((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : null));
    }
    addToast({
      title: language === 'pt' ? 'Venda atualizada com sucesso!' : 'Sale updated successfully!',
      type: 'success',
    });
  };

  const deleteOrder = (id: string) => {
    setOrdersList((prev) => prev.filter((o) => o.id !== id));
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder(null);
    }
    addToast({
      title: language === 'pt' ? 'Venda excluída com sucesso.' : 'Sale deleted successfully.',
      type: 'info',
    });
  };

  // CRUD for Products
  const addProduct = (newProd: Partial<ProductItem>) => {
    const created: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProd.name || 'Novo Produto AH19',
      sku: newProd.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      image:
        newProd.image ||
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=160&auto=format&fit=crop&q=80',
      category: newProd.category || 'Geral',
      price: Number(newProd.price) || 99,
      cost: Number(newProd.cost) || 25,
      stock: Number(newProd.stock) || 50,
      minStock: 15,
      unitsSold: 0,
      revenue: 0,
      profit: 0,
      margin: Math.round((((Number(newProd.price) || 99) - (Number(newProd.cost) || 25)) / (Number(newProd.price) || 99)) * 100),
      ordersCount: 0,
      aov: Number(newProd.price) || 99,
      conversionRate: 2.5,
      topCountries: [{ country: 'Brasil', flag: '🇧🇷', share: 100 }],
      trafficSources: [{ source: 'Direct', share: 100 }],
      campaigns: ['Novos_Lancamentos'],
      salesTrend: [
        { date: 'Aug 15', units: 0, revenue: 0 },
        { date: 'Aug 21', units: 0, revenue: 0 },
      ],
    };

    setProductsList((prev) => [created, ...prev]);
    addToast({
      title: language === 'pt' ? 'Produto cadastrado com sucesso!' : 'Product added successfully!',
      description: `${created.name} (${created.sku})`,
      type: 'success',
    });
  };

  const updateProduct = (id: string, updated: Partial<ProductItem>) => {
    setProductsList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...updated } : null));
    }
    addToast({
      title: language === 'pt' ? 'Produto atualizado com sucesso!' : 'Product updated successfully!',
      type: 'success',
    });
  };

  const deleteProduct = (id: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
    addToast({
      title: language === 'pt' ? 'Produto excluído do catálogo.' : 'Product removed from catalog.',
      type: 'info',
    });
  };

  // CRUD for Customers
  const addCustomer = (newCust: Partial<CustomerItem>) => {
    const created: CustomerItem = {
      id: `cust-${Date.now()}`,
      name: newCust.name || 'Novo Cliente',
      email: newCust.email || 'cliente@exemplo.com',
      phone: newCust.phone || '+55 11 99999-9999',
      avatar: newCust.avatar || undefined,
      country: newCust.country || 'Brasil',
      countryCode: newCust.countryCode || 'BR',
      flag: newCust.flag || '🇧🇷',
      city: newCust.city || 'São Paulo',
      ordersCount: 0,
      totalSpent: 0,
      ltv: 0,
      aov: 0,
      firstOrderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastPurchaseDate: '—',
      status: (newCust.status as any) || 'active',
      acquisitionSource: 'Cadastro Direto',
      firstTouchCampaign: 'Organic_Direct',
      lastTouchCampaign: 'Organic_Direct',
      orders: [],
      journey: [
        {
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          event: 'Customer Registered',
          details: 'Conta criada manualmente no sistema AH19',
          channel: 'Direct Admin',
        },
      ],
    };

    setCustomersList((prev) => [created, ...prev]);
    addToast({
      title: language === 'pt' ? 'Cliente cadastrado com sucesso!' : 'Customer added successfully!',
      description: `${created.name} • ${created.email}`,
      type: 'success',
    });
  };

  const updateCustomer = (id: string, updated: Partial<CustomerItem>) => {
    setCustomersList((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer((prev) => (prev ? { ...prev, ...updated } : null));
    }
    addToast({
      title: language === 'pt' ? 'Cliente atualizado com sucesso!' : 'Customer updated successfully!',
      type: 'success',
    });
  };

  const deleteCustomer = (id: string) => {
    setCustomersList((prev) => prev.filter((c) => c.id !== id));
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer(null);
    }
    addToast({
      title: language === 'pt' ? 'Cliente excluído com sucesso.' : 'Customer deleted successfully.',
      type: 'info',
    });
  };

  // CRUD for Finances (Transactions)
  const addTransaction = (newTx: Partial<TransactionItem>) => {
    const created: TransactionItem = {
      id: `tx-${Date.now()}`,
      type: newTx.type || 'income',
      description: newTx.description || 'Lançamento Comercial',
      amount: Number(newTx.amount) || 100,
      category: newTx.category || 'Geral',
      date: newTx.date || new Date().toISOString().split('T')[0],
      dueDate: newTx.dueDate || new Date().toISOString().split('T')[0],
      status: newTx.status || 'settled',
      paymentMethod: newTx.paymentMethod || 'Stripe / Pix',
      reference: newTx.reference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setTransactionsList((prev) => [created, ...prev]);
    addToast({
      title: language === 'pt' ? 'Transação registrada com sucesso!' : 'Transaction recorded successfully!',
      description: `${created.description} • ${formatCurrency(created.amount)}`,
      type: 'success',
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactionsList((prev) => prev.filter((t) => t.id !== id));
    addToast({
      title: language === 'pt' ? 'Transação removida.' : 'Transaction deleted.',
      type: 'info',
    });
  };

  // Currency Helpers
  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const currencySymbol = currencyInfo.symbol;

  const formatCurrency = (rawAmountInUSD: number): string => {
    const converted = rawAmountInUSD * currencyInfo.rate;
    return `${currencyInfo.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: converted % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const dateRangeLabel = useMemo(() => {
    if (dateRange === 'custom') {
      return `${customDateRange.start} – ${customDateRange.end}`;
    }
    return DATE_RANGE_CONFIGS[dateRange]?.label || 'Aug 15 – Aug 21, 2026';
  }, [dateRange, customDateRange]);

  const dateConfig = DATE_RANGE_CONFIGS[dateRange] || DATE_RANGE_CONFIGS['7d'];
  const storeConfig = STORE_WEIGHTS[selectedStore] || STORE_WEIGHTS.all;
  const effectiveMultiplier = dateConfig.multiplier * storeConfig.share;

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsRefreshing(false);
    setLastSyncedText(language === 'pt' ? 'agora mesmo' : 'just now');
    addToast({
      title: language === 'pt' ? 'Dados sincronizados com sucesso!' : 'Data synced successfully!',
      description: 'Pipelines Shopify, Meta Ads, Google Ads e Stripe atualizados.',
      type: 'success',
    });
  };

  // Calculated KPIs
  const isDemoAccount = currentUser?.id === 'usr_abismar_master';

  const kpis: KPIData[] = useMemo(() => {
    const share = storeConfig.exactShare ?? storeConfig.share;
    const baseRev = dateConfig.revenue || 78452.36;
    const baseProfit = dateConfig.profit || 26673.8;
    const baseOrders = dateConfig.orders || 614;

    const calculatedRevenue =
      isDemoAccount && dataMode === 'demo'
        ? baseRev * share
        : ordersList.reduce((acc, o) => acc + (o.rawAmount || 0), 0);

    const calculatedProfit =
      isDemoAccount && dataMode === 'demo'
        ? baseProfit * share
        : calculatedRevenue * 0.32;

    const calculatedOrders =
      isDemoAccount && dataMode === 'demo'
        ? Math.max(1, Math.round(baseOrders * share))
        : ordersList.length;

    const calculatedAov = calculatedOrders > 0 ? calculatedRevenue / calculatedOrders : 0;
    const hasData = isDemoAccount || calculatedOrders > 0;

    return [
      {
        id: 'revenue',
        name: t.dash_total_revenue,
        value: formatCurrency(calculatedRevenue),
        rawNumericValue: calculatedRevenue,
        change: hasData ? dateConfig.changeRevenue : '0.0%',
        changeValue: hasData ? 18.4 : 0,
        isPositive: true,
        period: t.dash_vs_previous,
        sparkline: hasData
          ? [28000, 32000, 30500, 36000, 34200, 40100, calculatedRevenue].map((v) => v * currencyInfo.rate)
          : [0, 0, 0, 0, 0, 0, 0],
        color: '#FFD000',
        category: 'revenue',
      },
      {
        id: 'profit',
        name: t.dash_net_profit,
        value: formatCurrency(calculatedProfit),
        rawNumericValue: calculatedProfit,
        change: hasData ? dateConfig.changeProfit : '0.0%',
        changeValue: hasData ? 21.2 : 0,
        isPositive: true,
        period: t.dash_vs_previous,
        sparkline: hasData
          ? [8500, 9200, 8800, 11000, 10500, 12600, calculatedProfit].map((v) => v * currencyInfo.rate)
          : [0, 0, 0, 0, 0, 0, 0],
        color: '#FFD000',
        category: 'profit',
      },
      {
        id: 'orders',
        name: t.dash_sales_count,
        value: calculatedOrders.toLocaleString(),
        rawNumericValue: calculatedOrders,
        change: hasData ? dateConfig.changeOrders : '0.0%',
        changeValue: hasData ? 14.8 : 0,
        isPositive: true,
        period: t.dash_vs_previous,
        sparkline: hasData ? [190, 220, 210, 260, 245, 290, calculatedOrders] : [0, 0, 0, 0, 0, 0, 0],
        color: '#FFFFFF',
        category: 'orders',
      },
      {
        id: 'aov',
        name: t.dash_avg_ticket,
        value: formatCurrency(calculatedAov),
        rawNumericValue: calculatedAov,
        change: hasData ? '↑ 6.4%' : '0.0%',
        changeValue: hasData ? 6.4 : 0,
        isPositive: true,
        period: t.dash_vs_previous,
        sparkline: hasData
          ? [120, 124, 128, 131, 134, 135, calculatedAov].map((v) => v * currencyInfo.rate)
          : [0, 0, 0, 0, 0, 0, 0],
        color: '#FFD000',
        category: 'revenue',
      },
      {
        id: 'customers',
        name: t.dash_total_customers,
        value: (isDemoAccount && dataMode === 'demo' ? Math.round(customersList.length * share) : customersList.length).toLocaleString(),
        rawNumericValue: isDemoAccount && dataMode === 'demo' ? Math.round(customersList.length * share) : customersList.length,
        change: hasData ? '↑ 12.0%' : '0.0%',
        changeValue: hasData ? 12.0 : 0,
        isPositive: true,
        period: t.dash_vs_previous,
        sparkline: hasData ? [180, 195, 210, 225, 240, 255, customersList.length] : [0, 0, 0, 0, 0, 0, 0],
        color: '#FFFFFF',
        category: 'orders',
      },
      {
        id: 'products_sold',
        name: t.dash_products_sold,
        value: (isDemoAccount && dataMode === 'demo' ? Math.round(calculatedOrders * 1.8) : productsList.reduce((a, b) => a + (b.unitsSold || 0), 0)).toLocaleString(),
        rawNumericValue: isDemoAccount && dataMode === 'demo' ? Math.round(calculatedOrders * 1.8) : productsList.reduce((a, b) => a + (b.unitsSold || 0), 0),
        change: hasData ? '↑ 19.5%' : '0.0%',
        changeValue: hasData ? 19.5 : 0,
        isPositive: true,
        period: t.dash_vs_previous,
        sparkline: hasData ? [310, 360, 390, 440, 480, 520, 600] : [0, 0, 0, 0, 0, 0, 0],
        color: '#FFD000',
        category: 'revenue',
      },
    ];
  }, [isDemoAccount, dataMode, ordersList, productsList, customersList, dateConfig, storeConfig, formatCurrency, currencyInfo, t]);

  // Filtered Chart Data Points
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!isDemoAccount && ordersList.length === 0) {
      return RAW_DAILY_CHART.map((point) => ({
        ...point,
        revenue: 0,
        profit: 0,
        spend: 0,
        orders: 0,
        refunds: 0,
        discounts: 0,
        taxes: 0,
        shipping: 0,
      }));
    }
    return RAW_DAILY_CHART.map((point) => ({
      ...point,
      revenue: Math.round(point.revenue * storeConfig.share * (dateConfig.days > 7 ? 2.2 : 1)),
      profit: Math.round(point.profit * storeConfig.share * (dateConfig.days > 7 ? 2.2 : 1)),
      spend: Math.round(point.spend * storeConfig.share * (dateConfig.days > 7 ? 2.2 : 1)),
      orders: Math.round(point.orders * storeConfig.share * (dateConfig.days > 7 ? 2.2 : 1)),
      refunds: Math.round(point.refunds * storeConfig.share),
      discounts: Math.round(point.discounts * storeConfig.share),
      taxes: Math.round(point.taxes * storeConfig.share),
      shipping: Math.round(point.shipping * storeConfig.share),
    }));
  }, [isDemoAccount, ordersList.length, storeConfig, dateConfig]);

  // Filtered Countries
  const countries: CountrySale[] = useMemo(() => {
    if (!isDemoAccount && ordersList.length === 0) {
      return [];
    }
    return RAW_COUNTRIES.map((c) => {
      const adjustedAmount = c.rawAmount * effectiveMultiplier;
      const adjustedOrders = Math.round(c.orders * effectiveMultiplier);
      return {
        ...c,
        rawAmount: adjustedAmount,
        amount: formatCurrency(adjustedAmount),
        orders: adjustedOrders,
        profit: c.profit * effectiveMultiplier,
        adSpend: c.adSpend * effectiveMultiplier,
      };
    });
  }, [isDemoAccount, ordersList.length, effectiveMultiplier, formatCurrency]);

  const selectedCountry = useMemo(() => {
    if (activeNav === 'countries' && selectedEntityId) {
      return countries.find((c) => c.code.toLowerCase() === selectedEntityId.toLowerCase()) || countries[0] || null;
    }
    return null;
  }, [activeNav, selectedEntityId, countries]);

  // Filtered Orders
  const orders: OrderItem[] = useMemo(() => {
    let list = ordersList;
    if (selectedStore !== 'all') {
      list = list.filter((o) => o.storeId === selectedStore);
    }
    return list;
  }, [ordersList, selectedStore]);

  // Filtered Products
  const products: ProductItem[] = useMemo(() => {
    return productsList;
  }, [productsList]);

  // Filtered Customers
  const customers: CustomerItem[] = useMemo(() => {
    return customersList;
  }, [customersList]);

  // Filtered Transactions
  const transactions: TransactionItem[] = useMemo(() => {
    return transactionsList;
  }, [transactionsList]);

  // Filtered Refunds
  const refunds: RefundItem[] = useMemo(() => {
    if (!isDemoAccount && ordersList.length === 0) {
      return [];
    }
    if (selectedStore !== 'all') {
      return RAW_REFUNDS.filter((r) => r.storeId === selectedStore);
    }
    return RAW_REFUNDS;
  }, [isDemoAccount, ordersList.length, selectedStore]);

  // Filtered Ad Platforms
  const adPlatforms: AdPlatformMetric[] = useMemo(() => {
    if (!isDemoAccount && ordersList.length === 0) {
      return [];
    }
    return RAW_AD_PLATFORMS.map((p) => {
      const scaledSpend = p.rawSpend * effectiveMultiplier;
      const scaledRevenue = p.rawRevenue * effectiveMultiplier;
      return {
        ...p,
        rawSpend: scaledSpend,
        spend: formatCurrency(scaledSpend),
        rawRevenue: scaledRevenue,
        revenue: formatCurrency(scaledRevenue),
      };
    });
  }, [isDemoAccount, ordersList.length, effectiveMultiplier, formatCurrency]);

  const STORES_LIST = [
    { id: 'all' as StoreId, name: t.all_stores, badge: 'GLOBAL' },
    { id: 'us-store' as StoreId, name: 'Shopify US Direct', badge: 'US' },
    { id: 'eu-store' as StoreId, name: 'Shopify EU / UK Store', badge: 'EU' },
    { id: 'wholesale' as StoreId, name: 'B2B & Wholesale Orders', badge: 'B2B' },
  ];

  // Campaigns & Creatives
  const campaigns = useMemo(() => RAW_CAMPAIGNS, []);
  const adSets = useMemo(() => RAW_CAMPAIGNS.flatMap((c) => c.adSets), []);
  const creatives = useMemo(() => RAW_CREATIVES, []);
  const funnelData = useMemo(() => RAW_FUNNEL_DATA, []);
  const attributionModels = useMemo(() => RAW_ATTRIBUTION_MODELS, []);
  const utmRecords = useMemo(() => RAW_UTM_RECORDS, []);
  const aiInsights = useMemo(() => INITIAL_AI_INSIGHTS, []);

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      title: language === 'pt' ? 'Notificações marcadas como lidas' : 'Notifications marked as read',
      type: 'info',
    });
  };

  // Integration Management
  const toggleIntegrationStatus = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'connected' ? 'available' : 'connected';
          return {
            ...item,
            status: nextStatus,
            lastSync: nextStatus === 'connected' ? 'Just now' : 'Never',
          };
        }
        return item;
      })
    );
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'available', lastSync: 'Disconnected' } : item))
    );
    addToast({
      title: language === 'pt' ? 'Integração desconectada' : 'Integration disconnected',
      type: 'info',
    });
  };

  const connectNewIntegration = (name: string, category: string, iconKey: any) => {
    const newIntegration: IntegrationItem = {
      id: `int-${Date.now()}`,
      name,
      category,
      status: 'connected',
      eventsToday: 1,
      lastSync: 'Just now',
      eventHealth: 'Optimal (100%)',
      eventsTracked: [{ name: 'Conversion', active: true, count: 1 }],
      iconKey: iconKey || 'shopify',
      description: `Custom pipeline for ${name}`,
    };
    setIntegrations((prev) => [...prev, newIntegration]);
    addToast({
      title: language === 'pt' ? `Conexão ativada: ${name}` : `Connection activated: ${name}`,
      type: 'success',
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        localStorage.setItem('life4billion_settings', JSON.stringify(updated));
      }
      return updated;
    });
    addToast({
      title: t.set_saved_success,
      type: 'success',
    });
  };

  // Real-time synchronization for orders & Checkout completion callback
  useEffect(() => {
    // 1. Trigger geo location detection for the active session
    detectVisitorLocation().catch(() => {});

    // 2. Setup Supabase Realtime subscription for incoming orders
    const unsubscribeSupabase = subscribeToOrders((newDbOrder) => {
      if (!newDbOrder) return;
      const formattedOrder: OrderItem = {
        id: newDbOrder.id || `ord-${Date.now()}`,
        orderNumber: newDbOrder.order_number || `#${Math.floor(10000 + Math.random() * 90000)}`,
        customer: {
          id: `cust-${Date.now()}`,
          name: newDbOrder.customer_name || 'Stripe Customer',
          email: newDbOrder.customer_email || 'client@example.com',
          avatar: undefined,
        },
        country: newDbOrder.country || 'Global',
        countryCode: newDbOrder.country_code || 'US',
        flag: newDbOrder.country_code === 'BR' ? '🇧🇷' : newDbOrder.country_code === 'US' ? '🇺🇸' : '🌐',
        amount: `$${Number(newDbOrder.amount || 99).toFixed(2)}`,
        rawAmount: Number(newDbOrder.amount) || 99,
        subtotal: Number(newDbOrder.amount) || 99,
        discount: 0,
        shipping: 0,
        tax: 0,
        itemsCount: 1,
        items: [
          {
            id: 'item-1',
            name: newDbOrder.product_name || 'Life4Billion Wellness Pack',
            sku: 'L4B-PROD',
            quantity: 1,
            price: Number(newDbOrder.amount) || 99,
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=120&auto=format&fit=crop&q=80',
          },
        ],
        status: 'Paid',
        paymentMethod: 'Stripe',
        storeId: 'all',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        device: newDbOrder.device_type || 'Desktop',
        trafficSource: newDbOrder.traffic_source || 'Direct',
        campaign: newDbOrder.utm_campaign || 'general',
        utm: {
          source: newDbOrder.utm_source || 'direct',
          medium: newDbOrder.utm_medium || 'none',
          campaign: newDbOrder.utm_campaign || 'general',
        },
      };

      setOrdersList((prev) => {
        if (prev.some((o) => o.id === formattedOrder.id || o.orderNumber === formattedOrder.orderNumber)) {
          return prev;
        }
        return [formattedOrder, ...prev];
      });

      addToast({
        title: language === 'pt' ? 'Nova Venda em Tempo Real!' : 'New Real-time Sale!',
        description: `${formattedOrder.orderNumber} • ${formattedOrder.amount} (${formattedOrder.country})`,
        type: 'success',
      });
    });

    // 3. Fallback SSE listener for local dev server
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events/realtime');
      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'NEW_ORDER' && parsed.order) {
            const o = parsed.order;
            const newOrder: OrderItem = {
              id: o.id,
              orderNumber: o.order_number,
              customer: {
                id: `cust-${Date.now()}`,
                name: o.customer_name || 'Stripe Customer',
                email: o.customer_email || 'client@example.com',
                avatar: undefined,
              },
              country: o.country || 'United States',
              countryCode: o.country_code || 'US',
              flag: o.country_code === 'BR' ? '🇧🇷' : o.country_code === 'US' ? '🇺🇸' : '🌐',
              amount: `$${Number(o.amount || 99).toFixed(2)}`,
              rawAmount: Number(o.amount) || 99,
              subtotal: Number(o.amount) || 99,
              discount: 0,
              shipping: 0,
              tax: 0,
              itemsCount: 1,
              items: [],
              status: 'Paid',
              paymentMethod: 'Stripe',
              storeId: 'all',
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              device: o.device_type || 'Desktop',
              trafficSource: o.traffic_source || 'Direct',
              campaign: o.utm_campaign || 'general',
              utm: {
                source: o.utm_source || 'direct',
                medium: o.utm_medium || 'none',
                campaign: o.utm_campaign || 'general',
              },
            };

            setOrdersList((prev) => {
              if (prev.some((item) => item.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });

            addToast({
              title: language === 'pt' ? 'Venda Stripe Confirmada!' : 'Stripe Sale Confirmed!',
              description: `${newOrder.orderNumber} • ${newOrder.amount}`,
              type: 'success',
            });
          }
        } catch {}
      };
    } catch {}

    // 4. Handle Stripe Checkout Redirect Query Params (?checkout=success)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutStatus = urlParams.get('checkout');
      if (checkoutStatus === 'success') {
        const city = urlParams.get('city') || 'Miami';
        const country = urlParams.get('country') || 'United States';
        const code = urlParams.get('code') || 'US';
        const amount = Number(urlParams.get('amount')) || 99.0;
        const simSession = urlParams.get('simulated_stripe_session') || `cs_${Date.now()}`;

        // Track successful purchase event
        trackAnalyticsEvent({
          event_type: 'purchase',
          country,
          country_code: code,
          city,
          metadata: {
            stripe_checkout_session_id: simSession,
            amount,
          },
        }).catch(() => {});

        addToast({
          title: language === 'pt' ? 'Pagamento Stripe Confirmado!' : 'Stripe Payment Confirmed!',
          description: `Venda de $${amount.toFixed(2)} registrada com sucesso (${city}, ${country}).`,
          type: 'success',
        });

        // Clean query params from URL without reload
        try {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch {}
      }
    }

    return () => {
      unsubscribeSupabase();
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isAuthenticated,
        currentUser,
        setCurrentUser,
        authMode,
        setAuthMode,
        authLoading,
        login,
        loginWithGoogle,
        registerUser,
        logout,
        resetPassword,
        completeOnboarding,
        activeNav,
        activeSubTab,
        selectedEntityId,
        navigate,
        goBack,
        dateRange,
        setDateRange,
        customDateRange,
        setCustomDateRange,
        dateRangeLabel,
        selectedStore,
        setSelectedStore,
        stores: STORES_LIST,
        currency,
        setCurrency,
        selectedCurrency: currency,
        setSelectedCurrency: setCurrency,
        currencySymbol,
        formatCurrency,
        dataMode,
        setDataMode,
        isRefreshing,
        lastSyncedText,
        refreshData,
        kpis,
        chartData,
        countries,
        selectedCountry,
        orders,
        selectedOrder,
        setSelectedOrder,
        addOrder,
        updateOrder,
        deleteOrder,
        products,
        selectedProduct,
        setSelectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        customers,
        selectedCustomer,
        setSelectedCustomer,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        transactions,
        addTransaction,
        deleteTransaction,
        refunds,
        adPlatforms,
        campaigns,
        adSets,
        selectedCampaign,
        setSelectedCampaign,
        creatives,
        selectedCreative,
        setSelectedCreative,
        funnelData,
        attributionModels,
        utmRecords,
        utmAnalytics: utmRecords,
        integrations,
        toggleIntegrationStatus,
        disconnectIntegration,
        connectNewIntegration,
        eventStream,
        selectedEvent,
        setSelectedEvent,
        aiInsights,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        globalSearchOpen,
        setGlobalSearchOpen,
        periodSelectorModalOpen,
        setPeriodSelectorModalOpen,
        connectModalOpen,
        setConnectModalOpen,
        connectModalPlatform,
        openConnectModal,
        closeConnectModal,
        revenueModalOpen,
        setRevenueModalOpen,
        confirmModal,
        openConfirmModal,
        closeConfirmModal,
        orderModalOpen,
        setOrderModalOpen,
        saleModalOpen: orderModalOpen,
        setSaleModalOpen: setOrderModalOpen,
        orderToEdit,
        setOrderToEdit,
        saleToEdit: orderToEdit,
        setSaleToEdit: setOrderToEdit,
        triggerDeleteConfirm,
        customerModalOpen,
        setCustomerModalOpen,
        customerToEdit,
        setCustomerToEdit,
        productModalOpen,
        setProductModalOpen,
        productToEdit,
        setProductToEdit,
        transactionModalOpen,
        setTransactionModalOpen,
        settings,
        updateSettings,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
