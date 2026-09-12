import React, { useState } from 'react';
import {
  Monitor,
  Download,
  CheckCircle2,
  X,
  Laptop,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const installed = await promptInstall();
    if (installed) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div
      id="pwa-install-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none cursor-pointer"
    >
      <div
        id="pwa-install-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0A] border border-[#222222] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white cursor-default"
      >
        {/* Close Button */}
        <button
          id="pwa-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFE76A]/20 via-[#FFD000]/10 to-transparent border border-[#FFD000]/40 flex items-center justify-center shadow-lg">
            <Monitor className="w-6 h-6 text-[#FFE76A]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Instalar AH19 OS no Computador
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#FFD000]/10 text-[#FFE76A] border border-[#FFD000]/30">
                PWA Desktop
              </span>
            </h3>
            <p className="text-xs text-neutral-400">
              Transforme a plataforma numa aplicação nativa para Windows, macOS ou Linux
            </p>
          </div>
        </div>

        {/* Status / Success Banner */}
        {isInstalled || installSuccess ? (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 mb-5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-300">
                Aplicação Instalada com Sucesso
              </p>
              <p className="text-[11px] text-emerald-400/80 mt-0.5">
                O AH19 Commerce OS está configurado e disponível no menu de aplicações e barra de tarefas do seu sistema operacional.
              </p>
            </div>
          </div>
        ) : null}

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-[#121212] border border-[#1F1F1F] rounded-xl p-3 text-center">
            <Zap className="w-4 h-4 text-[#FFE76A] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-white block">Acesso Rápido</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Ícone no desktop</span>
          </div>

          <div className="bg-[#121212] border border-[#1F1F1F] rounded-xl p-3 text-center">
            <Laptop className="w-4 h-4 text-[#FFE76A] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-white block">Janela Nativa</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Sem abas do browser</span>
          </div>

          <div className="bg-[#121212] border border-[#1F1F1F] rounded-xl p-3 text-center">
            <ShieldCheck className="w-4 h-4 text-[#FFE76A] mx-auto mb-1.5" />
            <span className="text-[11px] font-bold text-white block">100% Seguro</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Sandbox do sistema</span>
          </div>
        </div>

        {/* How it works info */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-3.5 mb-6 text-xs text-neutral-300 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[#FFE76A] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Como funciona a instalação no PC?</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Utiliza a tecnologia PWA (Progressive Web App) padronizada pela Google e Microsoft. O sistema funciona com desempenho máximo, cache local da aplicação e sincronização segura de dados com o Supabase e Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1C1C1C]">
          <button
            id="pwa-modal-cancel-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-[#141414] hover:bg-[#1C1C1C] rounded-lg transition-colors"
          >
            Fechar
          </button>

          {isInstallable ? (
            <button
              id="pwa-modal-install-btn"
              onClick={handleInstallClick}
              className="px-4 py-2 text-xs font-bold btn-gold-blend rounded-lg flex items-center gap-2 shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Instalar Agora no Computador</span>
            </button>
          ) : (
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <span>Para instalar: use o ícone de instalação na barra de endereços do Chrome/Edge</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
