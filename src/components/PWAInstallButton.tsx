import React, { useState } from 'react';
import { Download, Monitor, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await promptInstall();
      if (!accepted) {
        setModalOpen(true);
      }
    } else {
      setModalOpen(true);
    }
  };

  if (variant === 'sidebar') {
    return (
      <>
        <button
          id="sidebar-pwa-install-btn"
          onClick={handleClick}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-neutral-300 hover:text-white hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/50 transition-colors group"
          title="Instalar SaaS no computador (PWA)"
        >
          <div className="w-6 h-6 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/20 flex items-center justify-center text-[#FFE76A] group-hover:scale-105 transition-transform">
            {isInstalled ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#FFE76A]" />
            )}
          </div>
          <div className="text-left flex-1 min-w-0">
            <span className="block truncate text-white">
              {isInstalled ? 'App no Computador' : 'Instalar no PC'}
            </span>
            <span className="block text-[10px] text-neutral-500 truncate">
              {isInstalled ? 'Instalado' : 'Versão Desktop'}
            </span>
          </div>
        </button>

        <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        id="header-pwa-install-btn"
        onClick={handleClick}
        className="h-9 px-3 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/60 rounded-lg text-xs font-bold text-neutral-200 flex items-center gap-2 transition-colors shadow-sm"
        title="Instalar aplicação no seu computador (Windows/Mac/Linux)"
      >
        <Monitor className="w-3.5 h-3.5 text-[#FFE76A]" />
        <span className="hidden md:inline">
          {isInstalled ? 'App Instalada' : 'Instalar no PC'}
        </span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
