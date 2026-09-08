import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  Megaphone,
  Globe2,
  Package,
  AlertTriangle,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { AIInsightItem } from '../types';

export const AIInsightsPage: React.FC = () => {
  const { activeSubTab, navigate, aiInsights, addToast, t } = useApp();

  const subTab = activeSubTab || 'overview';

  const filteredInsights = useMemo(() => {
    if (subTab === 'overview') return aiInsights;
    return aiInsights.filter((i) => i.category.toLowerCase() === subTab.toLowerCase());
  }, [aiInsights, subTab]);

  const handleAction = (insight: AIInsightItem) => {
    if (insight.actionType === 'navigate') {
      const parts = insight.actionTarget.replace(/^\//, '').split('/');
      navigate(parts[0] as any, parts[1] || 'overview', parts[2] || null);
    } else {
      addToast(
        `Otimização Aplicada`,
        `Regras automatizadas implantadas para ${insight.title}.`
      );
    }
  };

  return (
    <div id="ai-insights-page-container" className="space-y-6 select-none">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#1E1E1E] overflow-x-auto">
          {[
            { id: 'overview', label: t.ai_all_insights, icon: Sparkles, count: aiInsights.length },
            { id: 'marketing', label: 'Marketing & Anúncios', icon: Megaphone },
            { id: 'countries', label: 'Escalação Geográfica', icon: Globe2 },
            { id: 'products', label: 'Produtos & Estoque', icon: Package },
            { id: 'revenue', label: 'Margem & Receita', icon: TrendingUp },
            { id: 'alerts', label: 'Fadiga & Riscos', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`ai-insights-tab-${tab.id}`}
                onClick={() => navigate('ai-insights', tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((insight) => {
          return (
            <div
              key={insight.id}
              id={`ai-insight-card-${insight.id}`}
              className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-5 shadow-lg hover:border-[#333333] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/30 font-mono">
                    {insight.category}
                  </span>

                  <span className="text-[10px] font-bold font-mono text-neutral-400">
                    {insight.impact}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{insight.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{insight.description}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#161616] flex items-center justify-between">
                <div className="text-[11px] text-neutral-400 font-mono">
                  Potencial: <span className="text-[#FFD000] font-bold">Alto Retorno</span>
                </div>
                <button
                  onClick={() => handleAction(insight)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{insight.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
