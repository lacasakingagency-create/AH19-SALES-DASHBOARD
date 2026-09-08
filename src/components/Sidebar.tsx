import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  Wallet,
  FileBarChart,
  Megaphone,
  Layers,
  Settings,
  LogOut,
  Search,
  Globe,
} from 'lucide-react';
import { AH19Logo } from './brand/AH19Logo';
import { useApp } from '../context/AppContext';
import { MainNavId } from '../types';
import { getInitials } from '../utils/avatarUtils';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const {
    activeNav,
    navigate,
    setGlobalSearchOpen,
    currentUser,
    logout,
    language,
    setLanguage,
    t,
  } = useApp();

  const navItems: { id: MainNavId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'geo-analytics', label: t.nav_geo_analytics, icon: Globe },
    { id: 'sales', label: t.nav_sales, icon: TrendingUp },
    { id: 'customers', label: t.nav_customers, icon: Users },
    { id: 'products', label: t.nav_products, icon: Package },
    { id: 'finances', label: t.nav_finances, icon: Wallet },
    { id: 'reports', label: t.nav_reports, icon: FileBarChart },
    { id: 'marketing', label: t.nav_marketing, icon: Megaphone },
    { id: 'integrations', label: t.nav_integrations, icon: Layers },
    { id: 'settings', label: t.nav_settings, icon: Settings },
  ];

  const handleNavClick = (id: MainNavId) => {
    navigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-[245px] shrink-0 bg-[#000000] border-r border-[#1C1C1C] flex flex-col justify-between select-none transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding & Navigation */}
        <div className="flex flex-col">
          {/* Brand Header with Professional AH19 Logo and Human Purpose Slogan */}
          <div
            id="sidebar-brand-header"
            onClick={() => handleNavClick('dashboard')}
            className="h-20 px-4 flex items-center border-b border-[#1C1C1C] cursor-pointer hover:bg-[#0A0A0A] transition-colors"
          >
            <AH19Logo size="md" sloganLanguage={language} showSlogan={true} />
          </div>

          {/* Quick Search */}
          <div className="px-3 pt-4 pb-2">
            <button
              id="sidebar-search-btn"
              onClick={() => setGlobalSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/50 text-neutral-400 hover:text-white transition-all text-xs"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#FFE76A]" />
                <span className="truncate">{t.search_placeholder.slice(0, 16)}...</span>
              </div>
              <span className="text-[10px] font-mono badge-gold-outline px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav id="sidebar-navigation" className="px-3 py-2 space-y-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isSelected =
                activeNav === item.id || (item.id === 'dashboard' && activeNav === 'overview');

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all group text-left cursor-pointer ${
                    isSelected
                      ? 'btn-gold-blend text-black shadow-md font-extrabold'
                      : 'text-neutral-400 hover:text-white hover:bg-[#0E0E0E]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 transition-colors ${
                        isSelected
                          ? 'text-black stroke-[2.5]'
                          : 'text-neutral-400 group-hover:text-[#FFE76A]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Area: Language Selector & User Profile */}
        <div className="p-3 border-t border-[#1C1C1C] space-y-3">
          {/* Language Switcher */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0A0A0A] border border-[#1E1E1E]">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Globe className="w-3.5 h-3.5 text-[#FFE76A]" />
              <span>{t.language}:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="sidebar-lang-pt"
                onClick={() => setLanguage('pt')}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition-all ${
                  language === 'pt'
                    ? 'btn-gold-blend shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                id="sidebar-lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-extrabold transition-all ${
                  language === 'en'
                    ? 'btn-gold-blend shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Install Desktop App PWA */}
          <div className="mb-2">
            <PWAInstallButton variant="sidebar" />
          </div>

          {/* User Profile Card & Logout */}
          <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#1E1E1E] flex items-center justify-between">
            <div
              className="flex items-center gap-2.5 min-w-0 cursor-pointer"
              onClick={() => handleNavClick('settings')}
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser?.name || 'User'}
                  className="w-8 h-8 rounded-lg object-cover border border-[#2A2A2A]"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-xs text-[#FFD000] shrink-0">
                  {getInitials(currentUser?.name || 'Abismar Henrique')}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser?.name || 'Abismar H.'}
                </p>
                <p className="text-[10px] text-[#FFD000] truncate font-medium">
                  {currentUser?.company || 'Life4Billion'}
                </p>
              </div>
            </div>

            <button
              id="sidebar-logout-btn"
              onClick={logout}
              title={`${t.nav_logout} (Supabase Auth)`}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-[#FFD000] hover:bg-[#141414] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
