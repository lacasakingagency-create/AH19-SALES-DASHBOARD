import React, { useState } from 'react';
import {
  Globe,
  Search,
  BookOpen,
  FileText,
  Eye,
  Magnet,
  Settings,
  Download,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowDown,
  TrendingUp,
  DollarSign,
  Crown,
  Users,
} from 'lucide-react';
import { CustomerJourneyStage } from '../types';

interface CustomerJourney3DFunnelProps {
  stages: CustomerJourneyStage[];
  formatCurrency: (val: number) => string;
  isPt?: boolean;
  selectedCountryName?: string;
  selectedCountryFlag?: string;
  onSelectTier?: (tierName: 'awareness' | 'consideration' | 'decision') => void;
}

export const CustomerJourney3DFunnel: React.FC<CustomerJourney3DFunnelProps> = ({
  stages,
  formatCurrency,
  isPt = true,
  selectedCountryName,
  selectedCountryFlag,
  onSelectTier,
}) => {
  const [activeTier, setActiveTier] = useState<'awareness' | 'consideration' | 'decision'>('awareness');

  // Compute aggregated numbers for the 3 main tiers
  // 1. Awareness: Visitors / Discovery (Stage 0)
  const awarenessStage = stages[0] || { count: 184500, percentageOfTop: 100 };
  const awarenessCount = awarenessStage.count;

  // 2. Consideration: Product Views & Cart Additions (Stage 1 & 2)
  const stage1 = stages[1] || { count: 77490, percentageOfTop: 42 };
  const stage2 = stages[2] || { count: 23985, percentageOfTop: 13 };
  const considerationCount = stage1.count;
  const considerationConv = awarenessCount > 0 ? ((stage1.count / awarenessCount) * 100).toFixed(1) : '42.0';

  // 3. Decision: Checkout, Purchases & Retention (Stage 3, 4, 5)
  const purchaseStage = stages.find((s) => s.id === 'purchase') || stages[4] || { count: 5387, revenue: 479443 };
  const decisionCount = purchaseStage.count;
  const decisionRevenue = purchaseStage.revenue || 0;
  const decisionConv = awarenessCount > 0 ? ((decisionCount / awarenessCount) * 100).toFixed(2) : '2.92';

  const handleTierClick = (tier: 'awareness' | 'consideration' | 'decision') => {
    setActiveTier(tier);
    if (onSelectTier) {
      onSelectTier(tier);
    }
  };

  return (
    <div
      id="customer-journey-3d-funnel-container"
      className="relative w-full rounded-2xl overflow-hidden bg-radial from-[#0C101E] via-[#07090F] to-[#030407] border border-[#1E2433] p-6 sm:p-8 shadow-2xl text-white select-none"
    >
      {/* Background Neon Energy Rays & Orbital Rings */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[450px] h-[250px] bg-amber-500/15 rounded-full blur-[80px]" />

        {/* Constellation / Orbital SVG Rings */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#D946EF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD000" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle cx="50%" cy="48%" r="280" fill="none" stroke="url(#orbitGrad)" strokeWidth="0.75" strokeDasharray="4 8" />
          <circle cx="50%" cy="48%" r="380" fill="none" stroke="#2A334A" strokeWidth="0.5" strokeDasharray="3 12" />
          <line x1="20%" y1="30%" x2="80%" y2="70%" stroke="#1A2234" strokeWidth="0.5" />
          <line x1="80%" y1="30%" x2="20%" y2="70%" stroke="#1A2234" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Header Section Matching the Image */}
      <div className="relative z-10 text-center space-y-1.5 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101626] border border-[#23314D] text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isPt ? 'TELEMETRIA VISUAL 3D' : '3D VISUAL TELEMETRY'}</span>
          {selectedCountryName && (
            <span className="text-[#FFD000] border-l border-[#23314D] pl-2 font-sans font-bold">
              {selectedCountryFlag} {selectedCountryName}
            </span>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
          {isPt ? 'O FUNIL DA JORNADA DO CLIENTE' : 'THE CUSTOMER JOURNEY FUNNEL'}
        </h2>
        <p className="text-sm sm:text-base italic text-cyan-200/80 font-serif tracking-wide">
          {isPt ? 'Transição de Prospect para Cliente (Transitioning from Prospect to Client)' : 'Transitioning from Prospect to Client'}
        </p>
      </div>

      {/* Interactive Funnel 3D Visual Composition */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">

        {/* TIER 1: AWARENESS */}
        <div
          id="funnel-tier-1-awareness"
          onClick={() => handleTierClick('awareness')}
          className={`relative w-full max-w-[580px] cursor-pointer transition-all duration-300 group ${
            activeTier === 'awareness' ? 'scale-[1.02]' : 'hover:scale-[1.01]'
          }`}
        >
          {/* 3D Oval Glow Rim Top */}
          <div className="relative w-full h-[100px] sm:h-[110px] rounded-[50%] p-[2px] bg-gradient-to-r from-[#00D9FF] via-[#7B2CBF] to-[#00D9FF] shadow-[0_0_30px_rgba(0,217,255,0.45)]">
            <div className="w-full h-full rounded-[50%] bg-gradient-to-b from-[#0B1528] via-[#0E1B33]/80 to-[#0A1224] flex flex-col items-center justify-center p-2 border border-cyan-400/50 backdrop-blur-md">
              {/* Pill Badge */}
              <div className="px-5 py-1 rounded-full bg-gradient-to-r from-[#00A8FF] via-[#6A11CB] to-[#2575FC] text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_15px_rgba(0,168,255,0.6)] flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-200" />
                <span>1. AWARENESS (CONSCIENTIZAÇÃO)</span>
              </div>

              {/* Subtitle Inside Tier */}
              <p className="text-[11px] sm:text-xs text-cyan-100 font-medium mt-1 text-center max-w-sm drop-shadow-sm">
                {isPt
                  ? 'Blog Educacional, Artigos, Anúncios & Recursos'
                  : 'Educational Blog, Articles, Resources & Top Ads'}
              </p>

              {/* Icons Row Underneath Text */}
              <div className="flex items-center gap-3 mt-1 text-cyan-300/80">
                <FileText className="w-3.5 h-3.5 hover:text-cyan-200 transition-colors" />
                <BookOpen className="w-3.5 h-3.5 hover:text-cyan-200 transition-colors" />
                <Search className="w-3.5 h-3.5 hover:text-cyan-200 transition-colors" />
                <Eye className="w-3.5 h-3.5 hover:text-cyan-200 transition-colors" />
              </div>
            </div>
          </div>

          {/* Translucent Glass Cone Body */}
          <div className="relative -mt-10 mx-auto w-[82%] h-[65px] bg-gradient-to-b from-cyan-500/20 via-indigo-600/15 to-transparent clip-funnel border-x border-cyan-400/30 flex items-center justify-between px-6">
            <span className="text-[10px] font-mono text-cyan-300/90 font-bold bg-[#091120]/80 px-2 py-0.5 rounded border border-cyan-500/30 shadow-xs">
              {awarenessCount.toLocaleString()} {isPt ? 'Visitantes' : 'Visitors'}
            </span>
            <span className="text-[10px] font-mono text-cyan-300/90 font-bold bg-[#091120]/80 px-2 py-0.5 rounded border border-cyan-500/30 shadow-xs">
              100% {isPt ? 'do Topo' : 'Top of Funnel'}
            </span>
          </div>

          {/* Downward Transition Glowing Arrows */}
          <div className="flex justify-between items-center px-12 -my-2 relative z-20">
            <div className="flex flex-col items-center animate-bounce text-[#B5179E] drop-shadow-[0_0_8px_#B5179E]">
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="px-3 py-0.5 rounded-full bg-[#111728] border border-[#2B395E] text-[10px] font-mono text-purple-300 font-bold shadow-md">
              ↓ {considerationConv}% {isPt ? 'avançaram' : 'passed through'}
            </div>
            <div className="flex flex-col items-center animate-bounce text-[#B5179E] drop-shadow-[0_0_8px_#B5179E]">
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* TIER 2: CONSIDERATION */}
        <div
          id="funnel-tier-2-consideration"
          onClick={() => handleTierClick('consideration')}
          className={`relative w-full max-w-[460px] cursor-pointer transition-all duration-300 group -mt-1 ${
            activeTier === 'consideration' ? 'scale-[1.02]' : 'hover:scale-[1.01]'
          }`}
        >
          {/* 3D Oval Glow Rim Middle */}
          <div className="relative w-full h-[90px] sm:h-[100px] rounded-[50%] p-[2px] bg-gradient-to-r from-[#D946EF] via-[#9333EA] to-[#F43F5E] shadow-[0_0_30px_rgba(217,70,239,0.45)]">
            <div className="w-full h-full rounded-[50%] bg-gradient-to-b from-[#220B2E] via-[#1B0726]/80 to-[#14041C] flex flex-col items-center justify-center p-2 border border-fuchsia-400/50 backdrop-blur-md">
              {/* Pill Badge */}
              <div className="px-5 py-1 rounded-full bg-gradient-to-r from-[#C026D3] via-[#E11D48] to-[#9333EA] text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_15px_rgba(217,70,239,0.6)] flex items-center gap-2">
                <Magnet className="w-3.5 h-3.5 text-pink-200" />
                <span>2. CONSIDERATION (CONSIDERAÇÃO)</span>
              </div>

              {/* Subtitle Inside Tier */}
              <p className="text-[11px] sm:text-xs text-pink-100 font-medium mt-1 text-center max-w-sm drop-shadow-sm">
                {isPt
                  ? 'Iscas Digitais, Catálogo, Whitepapers & Carrinho'
                  : 'Lead Magnet / Valuable Tool, PDF Guides, Whitepapers, Web Tools'}
              </p>

              {/* Icons Row Underneath Text */}
              <div className="flex items-center gap-3 mt-1 text-pink-300/80">
                <Download className="w-3.5 h-3.5 hover:text-pink-200 transition-colors" />
                <Magnet className="w-3.5 h-3.5 hover:text-pink-200 transition-colors" />
                <Settings className="w-3.5 h-3.5 hover:text-pink-200 transition-colors" />
                <ShoppingCart className="w-3.5 h-3.5 hover:text-pink-200 transition-colors" />
              </div>
            </div>
          </div>

          {/* Translucent Glass Cone Body */}
          <div className="relative -mt-9 mx-auto w-[78%] h-[60px] bg-gradient-to-b from-fuchsia-600/20 via-pink-700/15 to-transparent clip-funnel border-x border-pink-400/30 flex items-center justify-between px-5">
            <span className="text-[10px] font-mono text-pink-300 font-bold bg-[#1B0624]/80 px-2 py-0.5 rounded border border-pink-500/30 shadow-xs">
              {considerationCount.toLocaleString()} {isPt ? 'Prospects Ativos' : 'Active Prospects'}
            </span>
            <span className="text-[10px] font-mono text-pink-300 font-bold bg-[#1B0624]/80 px-2 py-0.5 rounded border border-pink-500/30 shadow-xs">
              {considerationConv}% {isPt ? 'de Conversão' : 'Conversion'}
            </span>
          </div>

          {/* Downward Transition Glowing Arrows */}
          <div className="flex justify-between items-center px-10 -my-2 relative z-20">
            <div className="flex flex-col items-center animate-bounce text-[#FFD000] drop-shadow-[0_0_8px_#FFD000]">
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="px-3 py-0.5 rounded-full bg-[#181206] border border-[#44330E] text-[10px] font-mono text-[#FFD000] font-bold shadow-md">
              ↓ {decisionConv}% {isPt ? 'converteram em clientes' : 'became buyers'}
            </div>
            <div className="flex flex-col items-center animate-bounce text-[#FFD000] drop-shadow-[0_0_8px_#FFD000]">
              <ArrowDown className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* TIER 3: DECISION */}
        <div
          id="funnel-tier-3-decision"
          onClick={() => handleTierClick('decision')}
          className={`relative w-full max-w-[340px] cursor-pointer transition-all duration-300 group -mt-1 ${
            activeTier === 'decision' ? 'scale-[1.03]' : 'hover:scale-[1.02]'
          }`}
        >
          {/* 3D Oval Glow Rim & Solid Cylinder Base */}
          <div className="relative w-full rounded-2xl p-[2.5px] bg-gradient-to-b from-[#FFF275] via-[#FFD000] to-[#E68A00] shadow-[0_0_45px_rgba(255,208,0,0.6)]">
            <div className="w-full rounded-[14px] bg-gradient-to-b from-[#2A1D00] via-[#1C1400] to-[#0D0900] flex flex-col items-center justify-center p-4 border border-[#FFD000]/60 backdrop-blur-md text-center">
              {/* Pill Badge */}
              <div className="px-5 py-1 rounded-full bg-gradient-to-r from-[#FFD000] via-[#FF9900] to-[#FF6600] text-black text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_20px_rgba(255,208,0,0.8)] flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-black" />
                <span>3. DECISION (DECISÃO & CLIENTE)</span>
              </div>

              {/* Subtitle Inside Tier */}
              <p className="text-[11px] sm:text-xs text-amber-100 font-semibold mt-2 max-w-xs drop-shadow-sm">
                {isPt
                  ? 'Consultoria, Checkout Finalizado, Auditoria & Compra'
                  : 'Consultation / Free Audit, Strategy Call, Expert Review & Purchase'}
              </p>

              {/* Icons Row Underneath Text */}
              <div className="flex items-center gap-4 mt-2 text-[#FFD000]">
                <Users className="w-4 h-4 hover:scale-110 transition-transform" />
                <Calendar className="w-4 h-4 hover:scale-110 transition-transform" />
                <CheckCircle2 className="w-4 h-4 hover:scale-110 transition-transform" />
                <CreditCard className="w-4 h-4 hover:scale-110 transition-transform" />
              </div>

              {/* Real Revenue & Clients Counter */}
              <div className="mt-3 pt-2.5 border-t border-[#FFD000]/30 w-full flex items-center justify-around font-mono">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-amber-300/80 block font-bold">
                    {isPt ? 'Clientes Reais' : 'Real Clients'}
                  </span>
                  <span className="text-base font-black text-white">
                    {decisionCount.toLocaleString()}
                  </span>
                </div>
                <div className="w-[1px] h-6 bg-[#FFD000]/30" />
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-amber-300/80 block font-bold">
                    {isPt ? 'Receita Gerada' : 'Revenue'}
                  </span>
                  <span className="text-base font-black text-[#FFD000]">
                    {formatCurrency(decisionRevenue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Intense Ground Amber Aura Glow */}
          <div className="w-3/4 h-5 mx-auto bg-gradient-to-r from-transparent via-[#FFD000] to-transparent blur-md opacity-60 mt-1" />
        </div>

      </div>

      {/* Interactive Tier Details Footer Card */}
      <div className="relative z-10 mt-6 pt-5 border-t border-[#1C2538] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#FFD000] animate-pulse" />
          <span className="text-neutral-300">
            {activeTier === 'awareness' &&
              (isPt
                ? 'Etapa 1 (Awareness): Visitantes topo de funil capturados via campanhas e busca orgânica.'
                : 'Stage 1 (Awareness): Top-of-funnel visitors captured via paid campaigns and organic search.')}
            {activeTier === 'consideration' &&
              (isPt
                ? 'Etapa 2 (Consideration): Usuários engajados explorando o catálogo e iniciando pedidos.'
                : 'Stage 2 (Consideration): Engaged prospects evaluating products and initiating checkout.')}
            {activeTier === 'decision' &&
              (isPt
                ? 'Etapa 3 (Decision): Compras aprovadas com pagamentos liquidados e clientes fidelizados.'
                : 'Stage 3 (Decision): Approved transactions, settled Stripe payments, and recurring clients.')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-400 font-mono">
            {isPt ? 'Conversão Geral:' : 'Overall CVR:'}
          </span>
          <span className="px-2.5 py-1 rounded bg-[#FFD000] text-black font-black font-mono text-xs shadow-md">
            {decisionConv}%
          </span>
        </div>
      </div>
    </div>
  );
};
