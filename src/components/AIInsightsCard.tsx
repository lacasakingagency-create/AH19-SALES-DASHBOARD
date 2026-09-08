import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AIInsightItem } from '../types';

interface AIInsightsCardProps {
  insights: AIInsightItem[];
  onViewAllInsights: () => void;
  onSelectInsight?: (insight: AIInsightItem) => void;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  insights,
  onViewAllInsights,
  onSelectInsight,
}) => {
  const displayInsights = insights.slice(0, 3);

  return (
    <div
      id="ai-insights-card"
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] shadow-lg flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg icon-badge-blend flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,208,0,0.9)]" />
            </div>
            <h2 id="ai-insights-title" className="text-base font-bold text-white tracking-tight">
              Insights & Recomendações
            </h2>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded badge-gold-blend font-mono shadow-md">
            AH19 Core
          </span>
        </div>

        {/* Three compact insight cards */}
        <div className="space-y-2.5">
          {displayInsights.map((insight) => (
            <div
              key={insight.id}
              id={`ai-insight-item-${insight.id}`}
              onClick={() => onSelectInsight && onSelectInsight(insight)}
              className="p-3 rounded-lg border border-[#1E1E1E] bg-[#141414] hover:border-[#FFD000]/60 transition-all cursor-pointer group text-left shadow-sm"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base shrink-0 select-none">{insight.icon}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#FFE76A] transition-colors truncate">
                    {insight.title}
                  </h3>
                  <p className="text-[11.5px] text-neutral-400 mt-0.5 leading-snug">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-[#161616] flex items-center justify-end">
        <button
          id="view-all-insights-btn"
          onClick={onViewAllInsights}
          className="btn-gold-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
        >
          <span>Ver todos os insights</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
