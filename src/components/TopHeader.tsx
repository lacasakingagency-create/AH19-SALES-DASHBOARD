import React, { useState } from 'react';
import {
  Calendar,
  Store,
  DollarSign,
  Bell,
  RefreshCw,
  ChevronDown,
  Menu,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CurrencyCode, DateFilterRange } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedStore,
    setSelectedStore,
    stores,
    dateRange,
    setDateRange,
    dateRangeLabel,
    isRefreshing,
    lastSyncedText,
    refreshData,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setGlobalSearchOpen,
    currentUser,
    language,
    setPeriodSelectorModalOpen,
    t,
  } = useApp();

  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const currencies: { code: CurrencyCode; symbol: string; label: string }[] = [
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'BRL', symbol: 'R$', label: 'BRL (R$)' },
  ];

  const datePresets: { id: DateFilterRange; label: string }[] = [
    { id: 'today', label: t.period_today },
    { id: 'yesterday', label: t.period_yesterday },
    { id: 'this_week', label: t.period_this_week },
    { id: 'last_week', label: t.period_last_week },
    { id: '7d', label: t.period_7d },
    { id: '14d', label: t.period_14d },
    { id: 'this_month', label: t.period_this_month },
    { id: 'last_month', label: t.period_last_month },
    { id: '30d', label: t.period_30d },
    { id: '3_months', label: t.period_3m },
    { id: '6_months', label: t.period_6m },
    { id: 'this_year', label: t.period_this_year },
    { id: 'last_year', label: t.period_last_year },
    { id: '12_months', label: t.period_12m },
    { id: 'custom', label: t.period_custom },
  ];

  const unreadCount = (notifications || []).filter((n) => !n.read).length;
  const currentStoreName = (stores || []).find((s) => s.id === selectedStore)?.name || t.all_stores;

  return (
    <header
      id="top-header"
      className="bg-[#000000] border-b border-[#1C1C1C] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-30 select-none"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
        {/* Left Greeting & Context */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-trigger"
              onClick={onOpenMobileMenu}
              className="p-1.5 -ml-1 text-neutral-400 hover:text-white rounded-lg hover:bg-[#141414] lg:hidden"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 id="greeting-title" className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {language === 'pt' ? 'Olá' : 'Hello'}, {currentUser?.name || 'Abismar'}
                <span className="w-2.5 h-2.5 rounded-full icon-badge-blend inline-block" />
              </h1>
              <p id="greeting-subtitle" className="text-xs text-neutral-400 font-normal mt-0.5">
                {language === 'pt'
                  ? 'Painel de controle e inteligência financeira AH19.'
                  : 'AH19 commerce intelligence & financial control hub.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Quick Search */}
          <button
            id="header-search-trigger"
            onClick={() => setGlobalSearchOpen(true)}
            className="h-9 px-3 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/50 rounded-lg text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-2 transition-all shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-[#FFE76A]" />
            <span className="hidden sm:inline">{t.search_placeholder.slice(0, 18)}...</span>
            <span className="text-[10px] font-mono badge-gold-outline px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </button>

          {/* Date Selector */}
          <div className="relative">
            <button
              id="header-date-selector"
              onClick={() => {
                setDateDropdownOpen(!dateDropdownOpen);
                setStoreDropdownOpen(false);
                setCurrencyDropdownOpen(false);
                setNotifDropdownOpen(false);
              }}
              className="h-9 px-3 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/60 rounded-lg text-xs font-medium text-neutral-200 flex items-center gap-2 transition-colors shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FFE76A]" />
              <span className="font-semibold">{datePresets.find((d) => d.id === dateRange)?.label || dateRangeLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {dateDropdownOpen && (
              <div
                id="header-date-dropdown-menu"
                className="absolute right-0 mt-1.5 w-64 bg-[#0A0A0A] border border-[#222222] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[75vh] overflow-y-auto"
              >
                <div className="px-3 py-2 border-b border-[#1C1C1C] flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {t.rep_select_period}
                  </span>
                  <button
                    onClick={() => {
                      setDateDropdownOpen(false);
                      setPeriodSelectorModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-[#FFD000] hover:underline"
                  >
                    {language === 'pt' ? 'Calendário' : 'Calendar'}
                  </button>
                </div>

                <div className="p-1.5">
                  <button
                    id="open-full-calendar-btn"
                    onClick={() => {
                      setDateDropdownOpen(false);
                      setPeriodSelectorModalOpen(true);
                    }}
                    className="w-full mb-1.5 px-3 py-2 bg-gradient-to-r from-white/10 via-[#FFD000]/15 to-[#B8860B]/20 hover:from-white/20 hover:via-[#FFD000]/25 hover:to-[#B8860B]/30 border border-[#FFE270]/40 rounded-lg text-left text-xs font-bold text-[#FFF9C4] flex items-center justify-between transition-colors shadow-sm"
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FFD000]" />
                      {language === 'pt' ? 'Analisador Completo' : 'Full Analyzer & Calendar'}
                    </span>
                    <span className="text-[10px] font-mono badge-gold-blend px-1.5 py-0.5 rounded font-extrabold shadow-sm">
                      PRO
                    </span>
                  </button>

                  {datePresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        if (preset.id === 'custom') {
                          setDateDropdownOpen(false);
                          setPeriodSelectorModalOpen(true);
                        } else {
                          setDateRange(preset.id);
                          setDateDropdownOpen(false);
                        }
                      }}
                      className={`w-full px-3 py-1.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        dateRange === preset.id
                          ? 'btn-gold-blend shadow-sm'
                          : 'text-neutral-300 hover:bg-[#141414] hover:text-white'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {dateRange === preset.id && <Check className="w-3.5 h-3.5 text-black" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Store Selector */}
          <div className="relative">
            <button
              id="header-store-selector"
              onClick={() => {
                setStoreDropdownOpen(!storeDropdownOpen);
                setDateDropdownOpen(false);
                setCurrencyDropdownOpen(false);
                setNotifDropdownOpen(false);
              }}
              className="h-9 px-3 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/60 rounded-lg text-xs font-medium text-neutral-200 flex items-center gap-2 transition-colors max-w-[170px] shadow-sm"
            >
              <Store className="w-3.5 h-3.5 text-[#FFE76A] shrink-0" />
              <span className="truncate font-semibold">{currentStoreName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {storeDropdownOpen && (
              <div
                id="header-store-dropdown-menu"
                className="absolute right-0 mt-1.5 w-64 bg-[#0A0A0A] border border-[#222222] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border-b border-[#1C1C1C]">
                  {t.select_store}
                </div>
                {(stores || []).map((store) => (
                  <button
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store.id);
                      setStoreDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedStore === store.id
                        ? 'btn-gold-blend shadow-sm'
                        : 'text-neutral-300 hover:bg-[#141414] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{store.name}</span>
                    {selectedStore === store.id && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="relative">
            <button
              id="header-currency-selector"
              onClick={() => {
                setCurrencyDropdownOpen(!currencyDropdownOpen);
                setDateDropdownOpen(false);
                setStoreDropdownOpen(false);
                setNotifDropdownOpen(false);
              }}
              className="h-9 px-2.5 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/60 rounded-lg text-xs font-bold text-neutral-200 flex items-center gap-1.5 transition-colors font-mono shadow-sm"
            >
              <DollarSign className="w-3.5 h-3.5 text-[#FFE76A]" />
              <span>{selectedCurrency}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {currencyDropdownOpen && (
              <div
                id="header-currency-dropdown-menu"
                className="absolute right-0 mt-1.5 w-36 bg-[#0A0A0A] border border-[#222222] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                {currencies.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setSelectedCurrency(curr.code);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCurrency === curr.code
                        ? 'btn-gold-blend shadow-sm'
                        : 'text-neutral-300 hover:bg-[#141414] hover:text-white'
                    }`}
                  >
                    <span>{curr.label}</span>
                    {selectedCurrency === curr.code && <Check className="w-3.5 h-3.5 text-black" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install Desktop App Button */}
          <PWAInstallButton variant="header" />

          {/* Sync Button */}
          <button
            id="header-sync-btn"
            onClick={refreshData}
            disabled={isRefreshing}
            className="h-9 px-3 btn-gold-secondary rounded-lg text-xs flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            title={`${t.last_synced}: ${lastSyncedText}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FFE76A] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t.sync_now}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              onClick={() => {
                setNotifDropdownOpen(!notifDropdownOpen);
                setDateDropdownOpen(false);
                setStoreDropdownOpen(false);
                setCurrencyDropdownOpen(false);
              }}
              className="h-9 w-9 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/60 rounded-lg flex items-center justify-center text-neutral-300 hover:text-white transition-colors relative shadow-sm"
              title={t.notifications}
            >
              <Bell className="w-4 h-4 text-neutral-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full badge-gold-blend shadow-md animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div
                id="header-notifications-menu"
                className="absolute right-0 mt-1.5 w-80 bg-[#0A0A0A] border border-[#222222] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-4 py-2 flex items-center justify-between border-b border-[#1C1C1C]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {t.notifications} ({unreadCount})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-[#FFD000] hover:underline font-medium"
                    >
                      {t.mark_all_read}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#1C1C1C]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-500">
                      {t.no_notifications}
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 text-xs transition-colors cursor-pointer ${
                          notif.read ? 'bg-transparent text-neutral-400' : 'bg-[#141414] text-neutral-200'
                        }`}
                      >
                        <p className="font-semibold text-white">{notif.title}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-neutral-500 mt-1 block">{notif.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
