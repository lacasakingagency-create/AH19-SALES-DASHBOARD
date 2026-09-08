import React, { useState } from 'react';
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
  const { connectModalOpen, setConnectModalOpen, connectNewIntegration, addToast } = useApp();

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'auth' | 'success'>('select');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const platforms = [
    {
      id: 'meta',
      name: 'Meta Ads & Conversions API',
      category: 'Advertising & Social',
      iconKey: 'meta' as const,
      description: 'Sync Meta Ads spend, ad sets, and dual browser + server-side CAPI event deduplication.',
    },
    {
      id: 'google',
      name: 'Google Ads & Enhanced Conversions',
      category: 'Search & PMax Advertising',
      iconKey: 'google' as const,
      description: 'Import search keywords, PMax asset groups, and SHA-256 hashed first-party conversions.',
    },
    {
      id: 'tiktok',
      name: 'TikTok Ads & Events API',
      category: 'Video & Creator Marketing',
      iconKey: 'tiktok' as const,
      description: 'Direct integration with TikTok Business Center for Spark Ads and catalog tracking.',
    },
    {
      id: 'shopify',
      name: 'Shopify Store (Direct GraphQL API)',
      category: 'E-Commerce Engine',
      iconKey: 'shopify' as const,
      description: 'Real-time order webhooks, customer lifetime values, and product inventory tracking.',
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4 (GA4)',
      category: 'Traffic & Web Intelligence',
      iconKey: 'ga4' as const,
      description: 'Stream session duration, bounce rates, and cross-channel funnel tracking.',
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo Email & SMS',
      category: 'Retention Marketing',
      iconKey: 'klaviyo' as const,
      description: 'Sync email flows, VIP segments, and campaign-level attributable revenue.',
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
    setConnectModalOpen(false);
    setStep('select');
    setSelectedPlatform(null);
  };

  if (!connectModalOpen) return null;

  const currentPlatformObj = platforms.find((p) => p.id === selectedPlatform);

  return (
    <div
      id="connect-platform-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="connect-platform-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              {step === 'select' && 'Connect New Platform'}
              {step === 'auth' && `Authorize ${currentPlatformObj?.name}`}
              {step === 'success' && 'Integration Connected'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Select an advertising or e-commerce platform to connect via secure OAuth. No secrets are stored client-side.
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {platforms.map((p) => (
                  <button
                    key={p.id}
                    id={`connect-platform-${p.id}`}
                    onClick={() => handleStartAuth(p.id)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <BrandIcon iconKey={p.iconKey} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{p.description}</div>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'auth' && currentPlatformObj && (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
                <BrandIcon iconKey={currentPlatformObj.iconKey} className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  Grant Life4Billion Analytics Read Access
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We will securely synchronize reporting metrics, campaigns, and conversion attribution using official REST/GraphQL APIs.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Permissions Requested:</span>
                </div>
                <ul className="text-[11px] text-slate-500 list-disc pl-5 space-y-1">
                  <li>Read ad account campaign performance & spend data</li>
                  <li>Receive real-time purchase & add-to-cart webhook payloads</li>
                  <li>Compute server-side deduplicated conversion attribution</li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setStep('select')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 transition-colors"
                >
                  Back
                </button>
                <button
                  id="confirm-oauth-btn"
                  onClick={handleSimulateOAuth}
                  disabled={isAuthenticating}
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors shadow-xs flex items-center gap-2"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating OAuth...</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize with {currentPlatformObj.name.split(' ')[0]}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && currentPlatformObj && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900">Successfully Connected!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {currentPlatformObj.name} is now synchronized with your Life4Billion analytics pipeline.
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="finish-oauth-btn"
                  onClick={handleClose}
                  className="text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-6 py-2.5 rounded-lg transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
