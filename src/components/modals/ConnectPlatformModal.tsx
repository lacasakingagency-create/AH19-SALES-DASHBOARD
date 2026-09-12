import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { BrandIcon } from '../BrandIcons';

export const ConnectPlatformModal: React.FC = () => {
  const {
    connectModalOpen,
    setConnectModalOpen,
    connectModalPlatform,
    closeConnectModal,
    connectNewIntegration,
    addToast,
    language,
  } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'auth' | 'success'>('select');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (connectModalOpen) {
      if (connectModalPlatform) {
        setSelectedPlatform(connectModalPlatform);
        setStep('auth');
      } else {
        setSelectedPlatform(null);
        setStep('select');
      }
    }
  }, [connectModalOpen, connectModalPlatform]);

  const platforms = [
    {
      id: 'shopify',
      name: 'Shopify Store',
      category: 'E-Commerce Engine',
      iconKey: 'shopify' as const,
      description: 'Webhooks de pedidos em tempo real, LTV de clientes e catálogo de inventário.',
    },
    {
      id: 'meta',
      name: 'Meta Ads & Conversions API',
      category: 'Advertising & Social',
      iconKey: 'meta' as const,
      description: 'Gastos de anúncios, campanhas e deduplicação server-side CAPI.',
    },
    {
      id: 'google',
      name: 'Google Ads & Enhanced Conversions',
      category: 'Search & PMax Advertising',
      iconKey: 'google' as const,
      description: 'Importação de palavras-chave, asset groups PMax e conversões SHA-256.',
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads & Events API',
      category: 'Video & Creator Marketing',
      iconKey: 'tiktok' as const,
      description: 'Integração direta com TikTok Business Center para Spark Ads e catálogo.',
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4 (GA4)',
      category: 'Traffic & Web Intelligence',
      iconKey: 'ga4' as const,
      description: 'Sessões, taxas de engajamento e funis multicanal em tempo real.',
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo Email & SMS',
      category: 'Retention Marketing',
      iconKey: 'klaviyo' as const,
      description: 'Fluxos de e-mail, segmentos VIP e receita atribuída a campanhas.',
    },
  ];

  const handleStartAuth = (platformId: string) => {
    setSelectedPlatform(platformId);
    setStep('auth');
  };

  const handleSimulateOAuth = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setStep('success');
      const matched = platforms.find((p) => p.id === selectedPlatform);
      if (matched) {
        connectNewIntegration(matched.name, matched.category, matched.iconKey);
      }
    }, 1200);
  };

  const handleClose = () => {
    closeConnectModal();
    setConnectModalOpen(false);
    setStep('select');
    setSelectedPlatform(null);
  };

  if (!connectModalOpen) return null;

  const currentPlatformObj = platforms.find((p) => p.id === selectedPlatform);

  return (
    <div
      id="connect-platform-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="connect-platform-modal"
        className="bg-[#111113] rounded-2xl shadow-2xl border border-white/10 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 my-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFD000]" />
            <h3 className="text-base font-bold text-white">
              {step === 'select' && (language === 'pt' ? 'Conectar Plataforma' : 'Connect New Platform')}
              {step === 'auth' && (language === 'pt' ? `Autorizar ${currentPlatformObj?.name}` : `Authorize ${currentPlatformObj?.name}`)}
              {step === 'success' && (language === 'pt' ? 'Integração Conectada' : 'Integration Connected')}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-xs text-white/60">
                {language === 'pt'
                  ? 'Selecione uma plataforma de vendas ou publicidade para conectar via OAuth seguro. Nenhuma senha ou segredo é armazenado no navegador.'
                  : 'Select an advertising or e-commerce platform to connect via secure OAuth. No secrets are stored client-side.'}
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    id={`connect-platform-${p.id}`}
                    onClick={() => handleStartAuth(p.id)}
                    className="w-full text-left p-3.5 rounded-xl border border-white/10 hover:border-[#FFD000]/60 hover:bg-white/[0.04] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                        <BrandIcon iconKey={p.iconKey} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-[#FFD000] transition-colors">
                          {p.name}
                        </div>
                        <div className="text-xs text-white/50 line-clamp-1">{p.description}</div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#FFD000] transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'auth' && currentPlatformObj && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FFD000]/10 text-[#FFD000] flex items-center justify-center mx-auto border border-[#FFD000]/30 shadow-sm">
                <BrandIcon iconKey={currentPlatformObj.iconKey} className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  {language === 'pt'
                    ? `Permitir Acesso de Leitura para ${currentPlatformObj.name}`
                    : `Grant Read Access for ${currentPlatformObj.name}`}
                </h4>
                <p className="text-xs text-white/60 mt-1.5 max-w-sm mx-auto">
                  {language === 'pt'
                    ? 'Sincronizaremos dados analíticos, métricas de receita e eventos de atribuição em tempo real usando as APIs oficiais.'
                    : 'We will securely synchronize reporting metrics, campaigns, and conversion attribution using official REST/GraphQL APIs.'}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-white font-medium">
                  <Lock className="w-3.5 h-3.5 text-[#FFD000]" />
                  <span>{language === 'pt' ? 'Permissões Solicitadas:' : 'Permissions Requested:'}</span>
                </div>
                <ul className="text-[11px] text-white/60 list-disc pl-5 space-y-1">
                  <li>{language === 'pt' ? 'Leitura de pedidos e faturamento consolidado' : 'Read order performance and spend data'}</li>
                  <li>{language === 'pt' ? 'Recebimento de webhooks e eventos em tempo real' : 'Receive real-time purchase webhook payloads'}</li>
                  <li>{language === 'pt' ? 'Deduplicação de conversões com proteção de dados' : 'Compute server-side deduplicated attribution'}</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setStep('select')}
                  className="text-xs font-semibold text-white/70 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                >
                  {language === 'pt' ? 'Voltar' : 'Back'}
                </button>
                <button
                  id="confirm-oauth-btn"
                  onClick={handleSimulateOAuth}
                  disabled={isAuthenticating}
                  className="text-xs font-bold text-black bg-[#FFD000] hover:bg-[#ffe040] px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>{language === 'pt' ? 'Autenticando via OAuth...' : 'Authenticating OAuth...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'pt' ? `Conectar ${currentPlatformObj.name.split(' ')[0]}` : `Authorize with ${currentPlatformObj.name.split(' ')[0]}`}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && currentPlatformObj && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  {language === 'pt' ? 'Conexão Estabelecida com Sucesso!' : 'Successfully Connected!'}
                </h4>
                <p className="text-xs text-white/60 mt-1.5 max-w-sm mx-auto">
                  {language === 'pt'
                    ? `${currentPlatformObj.name} está agora integrada ao pipeline de dados da sua empresa.`
                    : `${currentPlatformObj.name} is now synchronized with your analytics pipeline.`}
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="finish-oauth-btn"
                  onClick={handleClose}
                  className="text-xs font-bold text-black bg-[#FFD000] hover:bg-[#ffe040] px-6 py-2.5 rounded-xl transition-colors"
                >
                  {language === 'pt' ? 'Concluir e Voltar ao Dashboard' : 'Return to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
