import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Megaphone,
  TrendingUp,
  Layers,
  Sparkles,
  Search,
  ArrowUpDown,
  Plus,
  BarChart3,
  DollarSign,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { BrandIcon } from '../components/BrandIcons';
import { AdCampaignItem, AdCreativeItem } from '../types';

export const MarketingPage: React.FC = () => {
  const {
    activeSubTab,
    navigate,
    campaigns,
    adSets,
    creatives,
    integrations,
    formatCurrency,
    setSelectedCreative,
    setSelectedCampaign,
    setConnectModalOpen,
    t,
  } = useApp();

  const subTab = activeSubTab || 'overview';

  // Filters for campaigns
  const [campSearch, setCampSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [campSortBy, setCampSortBy] = useState<'roas' | 'spend' | 'revenue'>('roas');
  const [campSortAsc, setCampSortAsc] = useState(false);

  // Filters for creatives
  const [creativeFilter, setCreativeFilter] = useState('all');

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => {
        const matchName = c.name.toLowerCase().includes(campSearch.toLowerCase());
        const matchPlatform =
          platformFilter === 'all' || c.platform.toLowerCase() === platformFilter.toLowerCase();
        return matchName && matchPlatform;
      })
      .sort((a, b) => {
        if (campSortBy === 'roas') return campSortAsc ? a.roas - b.roas : b.roas - a.roas;
        if (campSortBy === 'spend') return campSortAsc ? a.spend - b.spend : b.spend - a.spend;
        return campSortAsc ? a.revenue - b.revenue : b.revenue - a.revenue;
      });
  }, [campaigns, campSearch, platformFilter, campSortBy, campSortAsc]);

  // Filtered creatives
  const filteredCreatives = useMemo(() => {
    return creatives.filter((c) => {
      if (creativeFilter === 'all') return true;
      return c.platform.toLowerCase() === creativeFilter.toLowerCase();
    });
  }, [creatives, creativeFilter]);

  // Aggregate metrics
  const totalMarketingSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalAttributedRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalPurchases = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const blendedRoas =
    totalMarketingSpend > 0 ? (totalAttributedRevenue / totalMarketingSpend).toFixed(2) : '3.62';
  const blendedCpa = totalPurchases > 0 ? totalMarketingSpend / totalPurchases : 15.6;

  return (
    <div id="marketing-page-container" className="space-y-6 select-none">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#1E1E1E] overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: t.mkt_all_channels, icon: BarChart3 },
            { id: 'meta', label: 'Meta Ads', iconKey: 'meta' as const },
            { id: 'google', label: 'Google Ads', iconKey: 'google' as const },
            { id: 'tiktok', label: 'TikTok Ads', iconKey: 'tiktok' as const },
            { id: 'campaigns', label: t.mkt_campaigns, icon: Megaphone, count: campaigns.length },
            { id: 'creatives', label: t.mkt_creatives, icon: Sparkles, count: creatives.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`marketing-subtab-${tab.id}`}
                onClick={() => navigate('marketing', tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#FFD000] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                {tab.iconKey ? (
                  <BrandIcon name={tab.iconKey} className="w-3.5 h-3.5" />
                ) : Icon ? (
                  <Icon className="w-3.5 h-3.5" />
                ) : null}
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

        <button
          onClick={() => setConnectModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Conectar Conta de Anúncios</span>
        </button>
      </div>

      {/* Aggregate Marketing KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.mkt_total_spend}</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {formatCurrency(totalMarketingSpend)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1 font-mono">Meta + Google + TikTok</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.mkt_attributed_rev}</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">
            {formatCurrency(totalAttributedRevenue)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Vendas via UTM e tracking</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.mkt_blended_roas}</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">{blendedRoas}x</div>
          <div className="text-[10px] text-neutral-500 mt-1">Retorno consolidado</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.mkt_cpa_avg}</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">{formatCurrency(blendedCpa)}</div>
          <div className="text-[10px] text-neutral-500 mt-1">{totalPurchases} conversões</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1C1C1C] flex flex-wrap items-center justify-between gap-3 bg-[#0E0E0E]">
          <div className="relative w-72">
            <input
              type="text"
              placeholder={t.search_placeholder}
              value={campSearch}
              onChange={(e) => setCampSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFD000]"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2A] text-xs font-semibold text-white py-2 px-3 rounded-lg focus:outline-none focus:border-[#FFD000]"
            >
              <option value="all">Todas as Redes</option>
              <option value="meta">Meta Ads</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
            </select>

            <button
              onClick={() => {
                setCampSortBy(campSortBy === 'roas' ? 'spend' : 'roas');
                setCampSortAsc(!campSortAsc);
              }}
              className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD000]" />
              <span>Ordenar: {campSortBy === 'roas' ? 'ROAS' : 'Gasto'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                <th className="py-3 px-4">{t.mkt_campaign}</th>
                <th className="py-3 px-4">{t.mkt_channel}</th>
                <th className="py-3 px-4 text-right">{t.mkt_spend}</th>
                <th className="py-3 px-4 text-right">{t.mkt_revenue}</th>
                <th className="py-3 px-4 text-right">{t.mkt_roas}</th>
                <th className="py-3 px-4 text-right">{t.mkt_cpa}</th>
                <th className="py-3 px-4 text-center">{t.mkt_status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {filteredCampaigns.map((camp) => (
                <tr
                  key={camp.id}
                  onClick={() => setSelectedCampaign(camp)}
                  className="hover:bg-[#141414] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-white group-hover:text-[#FFD000] transition-colors">
                    {camp.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="capitalize text-neutral-300 font-semibold">{camp.platform}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-white">
                    {formatCurrency(camp.spend)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#FFD000]">
                    {formatCurrency(camp.revenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#FFD000] text-sm">
                    {camp.roas.toFixed(2)}x
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-400">
                    ${camp.cpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        camp.status === 'Active'
                          ? 'bg-[#FFD000] text-black border-[#FFD000]'
                          : 'bg-[#141414] text-neutral-400 border-[#2A2A2A]'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
