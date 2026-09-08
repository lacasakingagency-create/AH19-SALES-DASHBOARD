import React from 'react';
import { Filter } from 'lucide-react';
import { FunnelStage } from '../types';

interface SalesFunnelCardProps {
  funnelData: FunnelStage[];
  conversionRate?: string;
}

export const SalesFunnelCard: React.FC<SalesFunnelCardProps> = ({
  funnelData,
  conversionRate = '2.1%',
}) => {
  return (
    <div
      id="sales-funnel-card"
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] shadow-lg flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#161616]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg icon-badge-blend flex items-center justify-center shadow-md">
            <Filter className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,208,0,0.9)]" />
          </div>
          <h2 id="sales-funnel-title" className="text-base font-bold text-white tracking-tight">
            Funil de Conversão
          </h2>
        </div>
        <div className="flex items-center gap-1.5 badge-gold-blend px-2.5 py-1 rounded-md shadow-md">
          <span className="text-[10px] text-black uppercase font-extrabold tracking-wider">Conv.</span>
          <span className="text-xs font-black text-black font-mono">{conversionRate}</span>
        </div>
      </div>

      {/* Visual Funnel Steps */}
      <div className="space-y-3 my-1">
        {funnelData.map((stage) => {
          return (
            <div key={stage.label} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-300">{stage.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-white">{stage.formattedCount}</span>
                  <span className="text-[11px] font-bold text-[#FFE270] w-12 text-right">
                    {stage.percentageOfTop}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with Gold-Yellow-White Blend */}
              <div className="w-full h-2.5 rounded-full bg-[#141414] border border-[#222222] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full chart-bar-blend transition-all duration-300"
                  style={{ width: `${Math.max(stage.percentageOfTop, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-[#161616] text-[11px] text-neutral-500 font-mono text-center">
        48.910 Sessões Únicas no Período
      </div>
    </div>
  );
};
