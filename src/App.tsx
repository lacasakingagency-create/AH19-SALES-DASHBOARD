/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { AuthPage } from './pages/AuthPage';
import { OverviewPage } from './pages/OverviewPage';
import { SalesPage } from './pages/SalesPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { FinancesPage } from './pages/FinancesPage';
import { ReportsPage } from './pages/ReportsPage';
import { MarketingPage } from './pages/MarketingPage';
import { CountriesPage } from './pages/CountriesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { GeographicAnalyticsPage } from './pages/GeographicAnalyticsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { AIInsightsPage } from './pages/AIInsightsPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals
import { PeriodSelectorModal } from './components/PeriodSelectorModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { OrderDetailModal } from './components/modals/OrderDetailModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { CustomerProfileModal } from './components/modals/CustomerProfileModal';
import { CreativeDetailModal } from './components/modals/CreativeDetailModal';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { RevenueDetailModal } from './components/modals/RevenueDetailModal';
import { ConnectPlatformModal } from './components/modals/ConnectPlatformModal';
import { ConfirmDeleteModal } from './components/modals/ConfirmDeleteModal';
import { SaleFormModal } from './components/modals/SaleFormModal';
import { CustomerFormModal } from './components/modals/CustomerFormModal';
import { ProductFormModal } from './components/modals/ProductFormModal';
import { TransactionFormModal } from './components/modals/TransactionFormModal';

const AppLayout: React.FC = () => {
  const { activeNav, isAuthenticated, periodSelectorModalOpen, setPeriodSelectorModalOpen } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is not authenticated, present the authentication experience
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthPage />
        <ToastContainer />
      </div>
    );
  }

  const renderActivePage = () => {
    switch (activeNav) {
      case 'dashboard':
      case 'overview':
        return <OverviewPage />;
      case 'sales':
        return <SalesPage />;
      case 'products':
        return <ProductsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'finances':
        return <FinancesPage />;
      case 'reports':
        return <ReportsPage />;
      case 'marketing':
        return <MarketingPage />;
      case 'countries':
        return <CountriesPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'geo-analytics':
        return <GeographicAnalyticsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div id="ah19-app-root" className="flex h-screen w-full bg-black overflow-hidden text-white font-sans">
      {/* 1. Global Left Navigation Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-black">
        <TopHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

        <main
          id="main-content-scroll-canvas"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] w-full mx-auto"
        >
          {renderActivePage()}
        </main>
      </div>

      {/* Global Interactive Modals & Drawers */}
      <PeriodSelectorModal
        isOpen={periodSelectorModalOpen}
        onClose={() => setPeriodSelectorModalOpen(false)}
      />
      <GlobalSearchModal />
      <OrderDetailModal />
      <ProductDetailModal />
      <CustomerProfileModal />
      <CreativeDetailModal />
      <EventDetailModal />
      <RevenueDetailModal />
      <ConnectPlatformModal />
      <ConfirmDeleteModal />

      {/* CRUD Form Modals */}
      <SaleFormModal />
      <CustomerFormModal />
      <ProductFormModal />
      <TransactionFormModal />

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
