import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Target,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Package,
} from 'lucide-react';
import { KPIData } from '../types';

interface KPICardProps {
  kpi: KPIData;
  isSelected?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, isSelected, onClick }) => {
  const getIcon = () => {
    const iconClass = "w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,208,0,0.9)]";
    switch (kpi.id) {
      case 'revenue':
      case 'aov':
        return <DollarSign className={iconClass} />;
      case 'profit':
        return <TrendingUp className={iconClass} />;
      case 'ad_spend':
        return <CreditCard className={iconClass} />;
      case 'roas':
        return <Target className={iconClass} />;
      case 'orders':
        return <ShoppingBag className={iconClass} />;
      case 'customers':
        return <Users className={iconClass} />;
      case 'products_sold':
        return <Package className={iconClass} />;
      default:
        return <DollarSign className={iconClass} />;
    }
  };

  // Generate smooth SVG sparkline path
  const generateSparklinePath = (points: number[]) => {
    if (!points || points.length < 2) return '';
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    const width = 120;
    const height = 24;
    const padding = 2;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return [x, y];
    });

    let path = `M ${coords[0][0]} ${coords[0][1]}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev[0] + curr[0]) / 2;
      path += ` C ${midX} ${prev[1]}, ${midX} ${curr[1]}, ${curr[0]} ${curr[1]}`;
    }
    return path;
  };

  const sparklinePath = generateSparklinePath(kpi.sparkline);

  return (
    <div
      id={`kpi-card-${kpi.id}`}
      onClick={onClick}
      className={`bg-[#0A0A0A] rounded-xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer relative overflow-hidden group select-none shadow-lg ${
        isSelected
          ? 'border-[#FFF4A3] ring-1 ring-[#FFD000] shadow-[0_0_20px_rgba(255,208,0,0.35)]'
          : 'border-[#1C1C1C] hover:border-[#333333]'
      }`}
    >
      {/* Top Header Row: Icon + Metric Name + Change Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg icon-badge-blend flex items-center justify-center shrink-0 shadow-md">
            {getIcon()}
          </div>
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            {kpi.name}
          </span>
        </div>

        {/* Change Badge (Figurinha) in Gold-Yellow-White Blend */}
        <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-md badge-gold-blend font-mono tracking-tight shadow-md">
          {kpi.isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[3] text-black" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 stroke-[3] text-black" />
          )}
          {kpi.change}
        </span>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          {kpi.value}
        </span>
      </div>

      {/* Footer Comparison & Sparkline */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#161616]">
        <span className="text-[11px] text-neutral-500 font-medium">
          {kpi.period || 'vs. período anterior'}
        </span>

        {/* Sparkline Chart */}
        {sparklinePath && (
          <div className="w-[80px] h-[20px] opacity-85 group-hover:opacity-100 transition-opacity">
            <svg
              viewBox="0 0 120 24"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`kpi-spark-${kpi.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FFF275" />
                  <stop offset="70%" stopColor="#FFD000" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>
              <path
                d={sparklinePath}
                fill="none"
                stroke={`url(#kpi-spark-${kpi.id})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
