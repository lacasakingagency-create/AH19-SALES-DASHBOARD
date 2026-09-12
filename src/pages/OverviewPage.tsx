import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KPISection } from '../components/KPISection';
import { RevenueProfitChart } from '../components/RevenueProfitChart';
import { TopCountriesCard } from '../components/TopCountriesCard';
import { AdPerformanceCard } from '../components/AdPerformanceCard';
import { SalesFunnelCard } from '../components/SalesFunnelCard';
import { RecentOrdersCard } from '../components/RecentOrdersCard';
import { AIInsightsCard } from '../components/AIInsightsCard';
import { CountryDetailModal } from '../components/modals/CountryDetailModal';
import { CountrySale } from '../types';

export const OverviewPage: React.FC = () => {
  const {
    kpis,
    chartData,
    countries,
    adPlatforms,
    funnelData,
    orders,
    aiInsights,
    integrations,
    currencySymbol,
    dateRange,
    setDateRange,
    navigate,
    setSelectedOrder,
    setConnectModalOpen,
    setRevenueModalOpen,
  } = useApp();

  const [selectedCountryForModal, setSelectedCountryForModal] = useState<CountrySale | null>(null);

  // Map DateFilterRange to TimeRange for the chart
  const activeTimeRange = dateRange === '30d' ? '30D' : dateRange === '90d' ? '90D' : dateRange === 'this_year' ? '1Y' : '7D';

  const handleRangeChange = (range: '7D' | '30D' | '90D' | '1Y') => {
    if (range === '7D') setDateRange('7d');
    else if (range === '30D') setDateRange('30d');
    else if (range === '90D') setDateRange('90d');
    else if (range === '1Y') setDateRange('this_year');
  };

  const handleKpiSelect = (kpiId: string) => {
    if (kpiId === 'revenue' || kpiId === 'profit') {
      setRevenueModalOpen(true);
    } else if (kpiId === 'ad_spend' || kpiId === 'roas') {
      navigate('marketing', 'overview');
    } else if (kpiId === 'orders') {
      navigate('sales', 'orders');
    }
  };

  return (
    <div id="overview-page-content" className="space-y-5 sm:space-y-6">
      {/* 1. Exactly 5 Large KPI Cards */}
      <KPISection
        kpis={kpis}
        selectedKpiId=""
        onSelectKpi={handleKpiSelect}
      />

      {/* 2. Dual-Line Chart (Revenue vs Profit) & Top Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <RevenueProfitChart
            data={chartData}
            selectedRange={activeTimeRange}
            onRangeChange={handleRangeChange}
            currencySymbol={currencySymbol}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <TopCountriesCard
            countries={countries}
            onViewAll={() => navigate('countries', 'overview')}
            currencySymbol={currencySymbol}
          />
        </div>
      </div>

      {/* 3. Advertising Performance Section */}
      <div className="w-full">
        <AdPerformanceCard
          platforms={adPlatforms as any}
          onGoToMarketing={() => navigate('marketing', 'overview')}
          currencySymbol={currencySymbol}
        />
      </div>

      {/* 4. Lower Analytics: Sales Funnel, Recent Orders, AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        <SalesFunnelCard
          funnelData={funnelData as any}
          conversionRate="2.1%"
        />

        <RecentOrdersCard
          orders={orders.slice(0, 5) as any}
          onViewAllOrders={() => navigate('sales', 'orders')}
          onSelectOrder={(order) => setSelectedOrder(order as any)}
          currencySymbol={currencySymbol}
        />

        <AIInsightsCard
          insights={aiInsights as any}
          onViewAllInsights={() => navigate('ai-insights', 'overview')}
          onSelectInsight={(insight) => {
            if (insight.actionType === 'navigate') {
              const parts = insight.actionTarget.replace(/^\//, '').split('/');
              navigate(parts[0] as any, parts[1] || 'overview', parts[2] || null);
            }
          }}
        />
      </div>

      {/* Country Detail Modal */}
      <CountryDetailModal
        country={selectedCountryForModal}
        onClose={() => setSelectedCountryForModal(null)}
      />
    </div>
  );
};
