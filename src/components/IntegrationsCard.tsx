import React from 'react';
import { Layers, Plus, Check, X, CreditCard } from 'lucide-react';
import {
  ShopifyIcon,
  MetaIcon,
  GoogleAdsIcon,
  GA4Icon,
  TikTokIcon,
} from './BrandIcons';
import { IntegrationItem } from '../types';

interface IntegrationsCardProps {
  integrations: IntegrationItem[];
  onConnectNew: () => void;
  onSelectIntegration?: (item: IntegrationItem) => void;
}

export const IntegrationsCard: React.FC<IntegrationsCardProps> = ({
  integrations,
  onConnectNew,
  onSelectIntegration,
}) => {
  const getIcon = (key?: string) => {
    const k = (key || '').toLowerCase();
    if (k.includes('shopify')) return <ShopifyIcon className="w-5 h-5" />;
    if (k.includes('meta') || k.includes('facebook')) return <MetaIcon className="w-5 h-5" />;
    if (k.includes('google') || k.includes('gads')) return <GoogleAdsIcon className="w-5 h-5" />;
    if (k.includes('ga4') || k.includes('analytics')) return <GA4Icon className="w-5 h-5" />;
    if (k.includes('tiktok')) return <TikTokIcon className="w-5 h-5" />;
    if (k.includes('stripe')) return <CreditCard className="w-5 h-5 text-indigo-400" />;
    return <Layers className="w-5 h-5 text-neutral-400" />;
  };

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;

  return (
    <div
      id="integrations-section-card"
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] shadow-lg w-full select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#161616]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg icon-badge-blend flex items-center justify-center shadow-md">
            <Layers className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,208,0,0.9)]" />
          </div>
          <div>
            <h2 id="integrations-title" className="text-base font-bold text-white tracking-tight">
              Fontes de Dados & Integrações
            </h2>
            <p className="text-xs text-neutral-400">
              {connectedCount} de {integrations.length} canais ativos e conectados
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-extrabold badge-gold-blend px-3 py-1 rounded-md shadow-md">
          <span className={`w-2 h-2 rounded-full ${connectedCount > 0 ? 'bg-black animate-pulse' : 'bg-red-500'}`} />
          <span>{connectedCount > 0 ? 'Sincronizado' : 'Offline'}</span>
        </div>
      </div>

      {/* Integration Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {integrations.map((item) => {
          const isConnected = item.status === 'connected';
          return (
            <div
              key={item.id}
              id={`integration-badge-${item.id}`}
              onClick={() => onSelectIntegration && onSelectIntegration(item)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all cursor-pointer group text-center shadow-sm ${
                isConnected
                  ? 'border-[#1E1E1E] bg-[#141414] hover:border-[#FFD000]/70'
                  : 'border-red-950/40 bg-[#0E0B0B] hover:border-red-600/50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg icon-badge-blend flex items-center justify-center mb-2 shadow-sm">
                {getIcon(item.iconKey || item.id)}
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#FFE76A] transition-colors truncate max-w-full px-1">
                {item.name}
              </span>
              {isConnected ? (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-400 font-mono font-bold">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
                  <span>Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1 text-[10px] text-red-400 font-mono font-bold">
                  <X className="w-3 h-3 text-red-400 stroke-[2.5]" />
                  <span>Não conectado</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Connect New Button */}
        <button
          id="connect-new-integration-btn"
          onClick={onConnectNew}
          className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-[#3A3A3A] bg-[#0E0E0E] hover:border-[#FFD000] hover:bg-[#181818] transition-all cursor-pointer text-neutral-400 hover:text-white group shadow-sm"
        >
          <div className="w-9 h-9 rounded-lg btn-gold-secondary flex items-center justify-center mb-2 shadow-sm">
            <Plus className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xs font-bold text-white">+ Conectar</span>
          <span className="text-[10px] text-neutral-400 font-mono">Nova API</span>
        </button>
      </div>
    </div>
  );
};
