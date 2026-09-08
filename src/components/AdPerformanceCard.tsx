import React from 'react';
import { Megaphone, ArrowRight } from 'lucide-react';
import { MetaIcon, GoogleAdsIcon, TikTokIcon } from './BrandIcons';
import { AdPlatformMetric } from '../types';

interface AdPerformanceCardProps {
  platforms: AdPlatformMetric[];
  onGoToMarketing: () => void;
  currencySymbol?: string;
}

export const AdPerformanceCard: React.FC<AdPerformanceCardProps> = ({
  platforms,
  onGoToMarketing,
  currencySymbol = '$',
}) => {
  const getPlatformIcon = (id: string) => {
    switch (id) {
      case 'meta':
        return <MetaIcon className="w-4 h-4" />;
      case 'google':
        return <GoogleAdsIcon className="w-4 h-4" />;
      case 'tiktok':
        return <TikTokIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      id="ad-performance-card"
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] shadow-lg flex flex-col justify-between select-none"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg icon-badge-blend flex items-center justify-center shadow-md">
              <Megaphone className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,208,0,0.9)]" />
            </div>
            <h2 id="ad-performance-title" className="text-base font-bold text-white tracking-tight">
              Desempenho de Tráfego Pago & Canais
            </h2>
          </div>
          <span className="text-[10px] font-extrabold badge-gold-blend px-2.5 py-0.5 rounded uppercase font-mono shadow-md">
            Atribuição Ativa
          </span>
        </div>

        {/* 3 Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {platforms.map((plat) => (
            <div
              key={plat.id}
              id={`ad-platform-${plat.id}`}
              className="p-3.5 rounded-lg border border-[#1E1E1E] bg-[#141414] hover:border-[#FFD000]/60 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md icon-badge-blend flex items-center justify-center shadow-sm">
                    {getPlatformIcon(plat.id)}
                  </div>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {plat.name}
                  </span>
                </div>
                <span className="text-xs font-bold badge-gold-outline px-2 py-0.5 rounded font-mono shadow-xs">
                  {plat.roas} ROAS
                </span>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-[#1C1C1C] text-[11px] font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Investido</span>
                  <span className="font-semibold text-white">{plat.spend.replace('$', currencySymbol)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Receita</span>
                  <span className="font-semibold text-[#FFE76A]">{plat.revenue.replace('$', currencySymbol)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">CPA Médio</span>
                  <span className="font-semibold text-white">{plat.cpa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer link to marketing */}
      <div className="mt-4 pt-3 border-t border-[#161616] flex items-center justify-end">
        <button
          id="goto-marketing-btn"
          onClick={onGoToMarketing}
          className="btn-gold-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
        >
          <span>Gerenciar Campanhas e Anúncios</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
