import React, { useState } from 'react';
import {
  Users,
  Eye,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Repeat,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Smartphone,
  Monitor,
  Sparkles,
  Info,
  Filter,
  Layers,
  ChevronDown,
  Globe,
  DollarSign,
  ArrowDown,
} from 'lucide-react';
import { CustomerJourneyStage } from '../types';
import { CustomerJourney3DFunnel } from './CustomerJourney3DFunnel';

interface CustomerJourneyFunnelProps {
  stages: CustomerJourneyStage[];
  title?: string;
  subtitle?: string;
  mode?: 'geographic' | 'sales';
  selectedCountryName?: string;
  selectedCountryFlag?: string;
  onSelectCountry?: (countryCode: string) => void;
  countriesList?: { code: string; name: string; flag: string }[];
  formatCurrency: (val: number) => string;
  isPt?: boolean;
}

export const CustomerJourneyFunnel: React.FC<CustomerJourneyFunnelProps> = ({
  stages,
  title,
  subtitle,
  mode = 'sales',
  selectedCountryName,
  selectedCountryFlag,
  onSelectCountry,
  countriesList,
  formatCurrency,
  isPt = true,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(stages[0]?.id || 'visitors');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [funnelViewMode, setFunnelViewMode] = useState<'3d' | 'steps' | 'both'>('both');

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[0];

  const topStageCount = stages[0]?.count || 1;
  const finalPurchaseStage = stages.find((s) => s.id === 'purchase') || stages[4] || stages[stages.length - 2];
  const overallConversionRate = topStageCount > 0 && finalPurchaseStage
    ? ((finalPurchaseStage.count / topStageCount) * 100).toFixed(2)
    : '2.92';

  const repeatStage = stages.find((s) => s.id === 'retention') || stages[stages.length - 1];
  const repeatRate = finalPurchaseStage && finalPurchaseStage.count > 0 && repeatStage
    ? ((repeatStage.count / finalPurchaseStage.count) * 100).toFixed(1)
    : '18.1';

  // Helper to get stage icon
  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'users':
        return <Users className="w-4 h-4" />;
      case 'eye':
        return <Eye className="w-4 h-4" />;
      case 'shopping-cart':
        return <ShoppingCart className="w-4 h-4" />;
      case 'credit-card':
        return <CreditCard className="w-4 h-4" />;
      case 'check-circle':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'repeat':
        return <Repeat className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div
      id="customer-journey-funnel-card"
      className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl p-5 md:p-6 shadow-2xl space-y-6 select-none"
    >
      {/* Top Header & Context Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1C1C1C] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#2B2B2B] flex items-center justify-center text-[#FFD000] shadow-md">
              <Filter className="w-4 h-4" />
            </div>
            <h2 id="funnel-main-title" className="text-lg md:text-xl font-black text-white tracking-tight">
              {title || (isPt ? 'Funil de Conversão & Jornada do Cliente' : 'Customer Journey & Conversion Funnel')}
            </h2>
            {selectedCountryName && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141414] border border-[#FFD000]/40 text-[#FFD000] text-xs font-semibold">
                <span>{selectedCountryFlag || '🌐'}</span>
                <span>{selectedCountryName}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            {subtitle ||
              (isPt
                ? 'Visão ponta a ponta sobre todas as 6 etapas da jornada: descoberta, consideração, intenção de compra, checkout, conversão e retenção.'
                : 'End-to-end telemetry across all 6 customer lifecycle stages: discovery, catalog browsing, purchase intent, checkout, conversion, and retention.')}
          </p>
        </div>

        {/* Global Key Metrics Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* CVR Global Topo ao Fim */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2 flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              {isPt ? 'CVR Geral (Visitante → Venda)' : 'Overall CVR'}
            </span>
            <span className="text-sm font-black text-[#FFD000] font-mono">{overallConversionRate}%</span>
          </div>

          {/* Taxa de Recompra */}
          <div className="bg-[#121212] border border-[#262626] rounded-xl px-3.5 py-2 flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              {isPt ? 'Taxa de Recompra (LTV)' : 'Repeat Rate'}
            </span>
            <span className="text-sm font-black text-emerald-400 font-mono">{repeatRate}%</span>
          </div>

          {/* Optional Country Filter Dropdown in Geographic Mode */}
          {mode === 'geographic' && countriesList && onSelectCountry && (
            <div className="flex items-center gap-1.5 bg-[#121212] border border-[#262626] rounded-xl px-2.5 py-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FFD000]" />
              <select
                id="funnel-country-selector"
                value={selectedCountryName || 'Global'}
                onChange={(e) => onSelectCountry(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#141414] text-white">
                  {isPt ? '🌍 Todos os Países (Global)' : '🌍 All Countries (Global)'}
                </option>
                {countriesList.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#141414] text-white">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Funnel View Switcher (3D Funnel vs 6 Steps vs Both) */}
          <div className="flex items-center bg-[#121212] border border-[#222222] rounded-xl p-1">
            <button
              id="funnel-view-both"
              type="button"
              onClick={() => setFunnelViewMode('both')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                funnelViewMode === 'both'
                  ? 'bg-[#FFD000] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{isPt ? 'Visão 3D + Detalhes' : '3D + Details'}</span>
            </button>
            <button
              id="funnel-view-3d"
              type="button"
              onClick={() => setFunnelViewMode('3d')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                funnelViewMode === '3d'
                  ? 'bg-[#FFD000] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isPt ? 'Funil 3D' : '3D Funnel'}</span>
            </button>
            <button
              id="funnel-view-steps"
              type="button"
              onClick={() => setFunnelViewMode('steps')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                funnelViewMode === 'steps'
                  ? 'bg-[#FFD000] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{isPt ? '6 Etapas' : '6 Steps'}</span>
            </button>
          </div>

          {/* Device Filter Quick Toggle */}
          <div className="flex items-center bg-[#121212] border border-[#222222] rounded-xl p-1">
            <button
              id="device-filter-all"
              type="button"
              onClick={() => setDeviceFilter('all')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                deviceFilter === 'all'
                  ? 'bg-[#FFD000] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isPt ? 'Todos' : 'All'}
            </button>
            <button
              id="device-filter-mobile"
              type="button"
              onClick={() => setDeviceFilter('mobile')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                deviceFilter === 'mobile'
                  ? 'bg-[#FFD000] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Mobile</span>
            </button>
            <button
              id="device-filter-desktop"
              type="button"
              onClick={() => setDeviceFilter('desktop')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                deviceFilter === 'desktop'
                  ? 'bg-[#FFD000] text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Customer Journey Funnel (Transitioning from Prospect to Client) */}
      {(funnelViewMode === 'both' || funnelViewMode === '3d') && (
        <div className="mb-6">
          <CustomerJourney3DFunnel
            stages={stages}
            formatCurrency={formatCurrency}
            isPt={isPt}
            selectedCountryName={selectedCountryName}
            selectedCountryFlag={selectedCountryFlag}
            onSelectTier={(tier) => {
              if (tier === 'awareness') {
                setSelectedStageId(stages[0]?.id || 'visitors');
              } else if (tier === 'consideration') {
                setSelectedStageId(stages[2]?.id || stages[1]?.id || 'cart');
              } else if (tier === 'decision') {
                setSelectedStageId(stages[4]?.id || stages[stages.length - 2]?.id || 'purchase');
              }
            }}
          />
        </div>
      )}

      {/* Visual Stepped Funnel Bars Grid */}
      {(funnelViewMode === 'both' || funnelViewMode === 'steps') && (
        <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold uppercase tracking-wider px-1">
          <span>{isPt ? 'Etapa do Cliente' : 'Customer Journey Stage'}</span>
          <div className="flex items-center gap-6">
            <span>{isPt ? 'Volume / Usuários' : 'Volume / Users'}</span>
            <span className="w-20 text-right">{isPt ? '% do Topo' : '% of Top'}</span>
            <span className="w-24 text-right hidden sm:inline-block">
              {isPt ? 'Abandono' : 'Drop-off'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {stages.map((stage, idx) => {
            const isSelected = selectedStageId === stage.id;
            const prevStage = idx > 0 ? stages[idx - 1] : null;

            // Compute device-adjusted counts if filtered
            let displayCount = stage.count;
            if (deviceFilter === 'mobile') {
              displayCount = Math.round(stage.count * (stage.mobileRate / 100));
            } else if (deviceFilter === 'desktop') {
              displayCount = Math.round(stage.count * (stage.desktopRate / 100));
            }

            return (
              <div
                key={stage.id}
                id={`funnel-stage-row-${stage.id}`}
                onClick={() => setSelectedStageId(stage.id)}
                className={`p-3.5 md:p-4 rounded-xl border transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-[#141414] border-[#FFD000] shadow-[0_0_15px_rgba(255,208,0,0.1)]'
                    : 'bg-[#0E0E0E] border-[#1C1C1C] hover:border-[#2C2C2C] hover:bg-[#121212]'
                }`}
              >
                {/* Stage Header Info */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black transition-colors ${
                        isSelected
                          ? 'bg-[#FFD000] text-black shadow-md'
                          : 'bg-[#1A1A1A] text-neutral-300 group-hover:text-white'
                      }`}
                    >
                      {getStageIcon(stage.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-extrabold text-white">
                          {stage.stepNumber}. {stage.label}
                        </span>
                        {stage.revenue !== undefined && stage.revenue > 0 && (
                          <span className="text-[11px] font-bold font-mono text-[#FFD000] bg-[#FFD000]/10 border border-[#FFD000]/30 px-1.5 py-0.2 rounded">
                            {formatCurrency(stage.revenue)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 hidden sm:inline-block">
                        {stage.sublabel}
                      </span>
                    </div>
                  </div>

                  {/* Right metrics numbers */}
                  <div className="flex items-center gap-4 md:gap-6 font-mono text-xs md:text-sm">
                    <div className="text-right">
                      <span className="font-extrabold text-white block">
                        {displayCount.toLocaleString()}
                      </span>
                      {stage.avgOrderValue !== undefined && stage.avgOrderValue > 0 && (
                        <span className="text-[10px] text-neutral-400 block">
                          AOV: {formatCurrency(stage.avgOrderValue)}
                        </span>
                      )}
                    </div>

                    <div className="w-20 text-right">
                      <span className="font-extrabold text-[#FFD000] text-xs md:text-sm">
                        {stage.percentageOfTop}%
                      </span>
                      {prevStage && (
                        <span className="text-[10px] text-neutral-400 block">
                          {stage.conversionFromPrev}% {isPt ? 'passou' : 'next'}
                        </span>
                      )}
                    </div>

                    <div className="w-24 text-right hidden sm:block">
                      {stage.dropOffRate > 0 ? (
                        <div>
                          <span className="font-bold text-red-400 text-xs">
                            -{stage.dropOffRate}%
                          </span>
                          <span className="text-[10px] text-neutral-500 block">
                            -{stage.dropOffCount.toLocaleString()} {isPt ? 'saíram' : 'left'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-500 font-semibold">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stepped Funnel Visual Progress Bar with AH19 Gold Gradient */}
                <div className="relative w-full h-3 rounded-full bg-[#181818] border border-[#242424] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(stage.percentageOfTop, 3)}%`,
                      background: isSelected
                        ? 'linear-gradient(90deg, #996B00 0%, #E6BC00 60%, #FFD000 100%)'
                        : 'linear-gradient(90deg, #5C450B 0%, #A37F15 70%, #E6BC00 100%)',
                    }}
                  />
                </div>

                {/* Device Split Footer inside row */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2 pt-1.5 border-t border-[#181818]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-mono">
                      <Smartphone className="w-3 h-3 text-neutral-400" />
                      <span>{stage.mobileRate}% Mobile</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Monitor className="w-3 h-3 text-neutral-400" />
                      <span>{stage.desktopRate}% Desktop</span>
                    </span>
                  </div>

                  <span className="text-[10px] text-neutral-500 italic truncate max-w-xs md:max-w-md">
                    {stage.topDropoffReason}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Interactive Deep Inspector for Selected Stage */}
      {selectedStage && (
        <div
          id="funnel-stage-inspector"
          className="bg-[#121212] border border-[#2C2C2C] rounded-xl p-4 md:p-5 space-y-4 relative animate-in fade-in"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#202020] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFD000] text-black flex items-center justify-center font-bold">
                {getStageIcon(selectedStage.iconName)}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm md:text-base flex items-center gap-2">
                  <span>
                    {isPt ? 'Diagnóstico Detalhado:' : 'Detailed Stage Diagnosis:'}{' '}
                    {selectedStage.stepNumber}. {selectedStage.label}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/30">
                    {selectedStage.percentageOfTop}% do Topo
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">{selectedStage.sublabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#282828]">
                <span className="text-neutral-400 block text-[10px] uppercase">
                  {isPt ? 'Volume Total' : 'Total Count'}
                </span>
                <span className="text-white font-extrabold text-sm">
                  {selectedStage.count.toLocaleString()}
                </span>
              </div>
              {selectedStage.dropOffRate > 0 && (
                <div className="bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#282828]">
                  <span className="text-neutral-400 block text-[10px] uppercase">
                    {isPt ? 'Taxa de Abandono' : 'Drop-off Rate'}
                  </span>
                  <span className="text-red-400 font-extrabold text-sm">
                    {selectedStage.dropOffRate}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3 Columns of Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Column 1: Main Friction Point */}
            <div className="bg-[#161616] p-3.5 rounded-xl border border-[#242424] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isPt ? 'Principal Ponto de Atrito' : 'Primary Friction Bottleneck'}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                {selectedStage.topDropoffReason}
              </p>
              <div className="text-[11px] text-neutral-500 font-mono pt-1">
                {isPt ? 'Impacto estimado:' : 'Estimated impact:'}{' '}
                <span className="text-white font-bold">
                  {selectedStage.dropOffCount.toLocaleString()} {isPt ? 'clientes perdidos' : 'lost users'}
                </span>
              </div>
            </div>

            {/* Column 2: Diagnostic Telemetry */}
            <div className="bg-[#161616] p-3.5 rounded-xl border border-[#242424] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD000]">
                <Info className="w-3.5 h-3.5" />
                <span>{isPt ? 'Comportamento & Dispositivos' : 'Behavior & Hardware'}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedStage.insight}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-mono pt-1">
                <span>📱 {selectedStage.mobileRate}% Mobile</span>
                <span>💻 {selectedStage.desktopRate}% Desktop</span>
              </div>
            </div>

            {/* Column 3: AI Recommendation */}
            <div className="bg-[#161616] p-3.5 rounded-xl border border-[#FFD000]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFD000]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD000]" />
                <span>{isPt ? 'Recomendação AH19 IA' : 'AH19 AI Recommendation'}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                {selectedStage.actionableRecommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
