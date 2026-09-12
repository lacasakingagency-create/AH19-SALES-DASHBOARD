import React, { useState } from 'react';
import { Download, Monitor, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';
import { useApp } from '../context/AppContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'sidebar';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const { language } = useApp();
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
          type="button"
          onClick={handleClick}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-[#0D0D0D] hover:bg-[#151515] border border-[#222222] hover:border-[#FFD000]/60 transition-all text-left cursor-pointer group shadow-sm"
          title={
            isInstalled
              ? language === 'pt'
                ? 'Aplicativo instalado no computador'
                : 'App installed on computer'
              : language === 'pt'
              ? 'Instalar aplicação no seu computador (Windows / Mac / Linux)'
              : 'Install app on computer (Windows / Mac / Linux)'
          }
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFE76A] shrink-0 group-hover:scale-105 transition-transform">
              {isInstalled ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Monitor className="w-4 h-4 text-[#FFD000]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-white group-hover:text-[#FFE76A] transition-colors leading-tight">
                {isInstalled
                  ? language === 'pt'
                    ? 'Aplicativo Instalado'
                    : 'App Installed'
                  : language === 'pt'
                  ? 'Instalar no Computador'
                  : 'Install on Computer'}
              </span>
              <span className="block text-[10px] text-neutral-400 font-mono mt-0.5 leading-none">
                {isInstalled
                  ? language === 'pt'
                    ? 'Pronto no Desktop'
                    : 'Desktop Ready'
                  : language === 'pt'
                  ? 'App Windows & Mac'
                  : 'Windows & Mac App'}
              </span>
            </div>
          </div>

          <div className="w-6 h-6 rounded-md bg-[#161616] border border-[#262626] group-hover:border-[#FFD000]/40 flex items-center justify-center text-neutral-400 group-hover:text-[#FFD000] shrink-0 transition-colors ml-1">
            {isInstalled ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
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
        type="button"
        onClick={handleClick}
        className="h-9 px-3 bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#FFD000]/60 rounded-lg text-xs font-bold text-neutral-200 flex items-center gap-2 transition-colors shadow-sm shrink-0 cursor-pointer"
        title={
          isInstalled
            ? language === 'pt'
              ? 'Aplicativo instalado no computador'
              : 'App installed on computer'
            : language === 'pt'
            ? 'Instalar aplicação no seu computador (Windows / Mac / Linux)'
            : 'Install app on computer (Windows / Mac / Linux)'
        }
      >
        <Monitor className="w-3.5 h-3.5 text-[#FFE76A] shrink-0" />
        <span className="whitespace-nowrap">
          {isInstalled
            ? language === 'pt'
              ? 'App Instalado'
              : 'App Installed'
            : language === 'pt'
            ? 'Instalar no Computador'
            : 'Install on PC'}
        </span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
