import React from 'react';
import { Globe, ArrowUpRight } from 'lucide-react';
import { CountrySale } from '../types';

interface TopCountriesCardProps {
  countries: CountrySale[];
  onViewAll: () => void;
  currencySymbol?: string;
}

export const TopCountriesCard: React.FC<TopCountriesCardProps> = ({
  countries,
  onViewAll,
  currencySymbol = '$',
}) => {
  return (
    <div
      id="top-countries-card"
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] shadow-lg flex flex-col justify-between select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#161616]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg icon-badge-blend flex items-center justify-center shadow-md">
            <Globe className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,208,0,0.9)]" />
          </div>
          <h2 id="top-countries-title" className="text-base font-bold text-white tracking-tight">
            Distribuição por País
          </h2>
        </div>

        <button
          id="top-countries-view-all"
          onClick={onViewAll}
          className="btn-gold-secondary px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shadow-sm"
        >
          <span>Ver todos</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* World Map Visual (Gold, Yellow, White Theme) */}
      <div
        id="top-countries-map-visual"
        className="w-full h-[110px] rounded-lg bg-[#141414] border border-[#222222] relative overflow-hidden flex items-center justify-center p-2 mb-3 shadow-inner"
      >
        <svg
          viewBox="0 0 380 160"
          className="w-full h-full fill-current text-[#2A2A2A]"
        >
          <defs>
            <linearGradient id="mapGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#FFF275" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#FFD000" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B8860B" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {/* North America */}
          <path d="M45,25 Q70,18 100,28 Q115,45 105,75 Q85,85 75,70 Q60,78 40,60 Q35,40 45,25 Z" fill="#2E2E2E" />
          {/* South America (Highlighted in Gold/Yellow Blend) */}
          <path d="M90,90 Q110,95 118,115 Q115,145 98,155 Q85,135 88,105 Z" fill="url(#mapGoldGrad)" />
          {/* Europe */}
          <path d="M170,28 Q200,25 215,42 Q205,62 185,60 Q170,55 170,28 Z" fill="#383838" />
          {/* Africa */}
          <path d="M175,70 Q215,72 225,105 Q205,140 185,120 Q170,95 175,70 Z" fill="#222222" />
          {/* Asia */}
          <path d="M225,25 Q305,20 335,60 Q305,95 260,85 Q235,65 225,25 Z" fill="#2E2E2E" />
          {/* Australia */}
          <path d="M295,110 Q330,108 340,130 Q315,148 290,135 Q285,120 295,110 Z" fill="#222222" />
        </svg>

        {/* Pulse Beacons on Key Markets (Gold + White + Yellow) */}
        <div className="absolute top-[38%] left-[23%] flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-[#FFD000]/50 animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#B8860B] via-[#FFD000] to-white ring-1 ring-white relative shadow-[0_0_8px_rgba(255,208,0,0.9)]" />
        </div>

        <div className="absolute top-[70%] left-[26%] flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-[#FFD000]/50 animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#B8860B] via-[#FFD000] to-white ring-1 ring-white relative shadow-[0_0_8px_rgba(255,208,0,0.9)]" />
        </div>
      </div>

      {/* Top Countries List */}
      <div className="space-y-2">
        {countries.slice(0, 4).map((country) => (
          <div
            key={country.code}
            className="flex items-center justify-between p-2 rounded-lg bg-[#141414] border border-[#1E1E1E] text-xs hover:border-[#333333] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base">{country.flag}</span>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">{country.name}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{country.orders} pedidos</p>
              </div>
            </div>

            <div className="text-right font-mono">
              <p className="font-bold text-[#FFD000]">{country.amount.replace('$', currencySymbol)}</p>
              <p className="text-[10px] text-neutral-400">{country.percentage}% do total</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
