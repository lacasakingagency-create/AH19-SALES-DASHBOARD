import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Check, User, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getFirstLetter } from '../../utils/avatarUtils';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose, mode }) => {
  const { loginWithGoogle, authLoading, language } = useApp();

  const detectedGoogleEmail = 'lacasaking.agency@gmail.com';
  const detectedGoogleName = 'La Casa King Agency';

  const [useCustomAccount, setUseCustomAccount] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [connectingAccount, setConnectingAccount] = useState<string | null>(null);

  // Update preview avatar as user types custom email
  useEffect(() => {
    const trimmed = customEmail.trim().toLowerCase();
    if (trimmed && trimmed.includes('@') && trimmed.includes('.')) {
      setPreviewAvatar(`https://unavatar.io/${encodeURIComponent(trimmed)}`);
    } else {
      setPreviewAvatar('');
    }
  }, [customEmail]);

  if (!isOpen) return null;

  const handleSelectDetected = async () => {
    setConnectingAccount(detectedGoogleEmail);
    const photoUrl = `https://unavatar.io/${encodeURIComponent(detectedGoogleEmail)}`;
    await loginWithGoogle({
      email: detectedGoogleEmail,
      name: detectedGoogleName,
      avatarUrl: photoUrl,
    });
    setConnectingAccount(null);
    onClose();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customEmail.trim().toLowerCase();
    if (!trimmed) {
      setCustomError(language === 'pt' ? 'Insira um e-mail do Google válido' : 'Enter a valid Google email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setCustomError(language === 'pt' ? 'Formato de e-mail inválido' : 'Invalid email format');
      return;
    }

    setCustomError(null);
    setConnectingAccount(trimmed);

    const derivedName = customName.trim() || trimmed.split('@')[0].replace(/[._-]/g, ' ');
    const photoUrl = `https://unavatar.io/${encodeURIComponent(trimmed)}`;

    await loginWithGoogle({
      email: trimmed,
      name: derivedName,
      avatarUrl: photoUrl,
    });

    setConnectingAccount(null);
    onClose();
  };

  return (
    <div
      id="google-auth-modal-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="google-auth-modal"
        className="w-full max-w-md bg-[#0D0D0D] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Google Header */}
        <div className="p-6 border-b border-[#1F1F1F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google SVG Logo */}
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.99 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {mode === 'register'
                  ? (language === 'pt' ? 'Cadastrar com o Google' : 'Sign up with Google')
                  : (language === 'pt' ? 'Fazer login com o Google' : 'Sign in with Google')}
              </h2>
              <p className="text-xs text-neutral-400">
                {language === 'pt'
                  ? 'Escolha uma conta para continuar para AH19 SaaS'
                  : 'Choose an account to continue to AH19 SaaS'}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-google-auth-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {!useCustomAccount ? (
            <div className="space-y-3">
              {/* Detected Primary Google Account */}
              <button
                type="button"
                id="select-detected-google-account"
                onClick={handleSelectDetected}
                disabled={Boolean(connectingAccount) || authLoading}
                className="w-full p-4 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] hover:border-[#FFD000]/60 transition-all flex items-center justify-between group cursor-pointer text-left disabled:opacity-60"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img
                      src={`https://unavatar.io/${encodeURIComponent(detectedGoogleEmail)}`}
                      alt={detectedGoogleName}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-11 h-11 rounded-full object-cover border border-[#333333]"
                    />
                    <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center font-bold text-sm text-[#FFD000]">
                      {getFirstLetter(detectedGoogleName)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-[#FFD000] transition-colors flex items-center gap-1.5">
                      <span>{detectedGoogleName}</span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">
                      {detectedGoogleEmail}
                    </div>
                    <div className="text-[10px] text-[#FFD000] font-mono mt-0.5">
                      {language === 'pt' ? '• Foto do email será vinculada' : '• Email photo will be synced'}
                    </div>
                  </div>
                </div>

                <div>
                  {connectingAccount === detectedGoogleEmail ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#FFD000]" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
              </button>

              {/* Option to use another Google account */}
              <button
                type="button"
                id="switch-to-custom-google-account"
                onClick={() => setUseCustomAccount(true)}
                className="w-full py-2.5 px-3 rounded-lg border border-dashed border-[#2A2A2A] hover:border-neutral-500 text-xs text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#FFD000]" />
                <span>
                  {language === 'pt' ? 'Usar outra conta Google' : 'Use another Google account'}
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {customError && (
                <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-lg border border-red-800/50">
                  {customError}
                </p>
              )}

              {/* Live Preview Avatar if available */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141414] border border-[#222222]">
                <div className="relative shrink-0">
                  {previewAvatar ? (
                    <img
                      src={previewAvatar}
                      alt="Google Preview"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="w-10 h-10 rounded-full object-cover border border-[#333333]"
                    />
                  ) : null}
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center font-bold text-sm text-[#FFD000]">
                    {getFirstLetter(customName || customEmail || 'G')}
                  </div>
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    {language === 'pt' ? 'Foto de perfil do e-mail' : 'Email profile photo'}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {language === 'pt'
                      ? 'O sistema busca automaticamente a foto oficial do Google.'
                      : 'The system automatically pulls the official Google avatar.'}
                  </span>
                </div>
              </div>

              {/* Google Email Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  {language === 'pt' ? 'E-mail Google / Gmail' : 'Google / Gmail Email'}{' '}
                  <span className="text-[#FFD000]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="seu.nome@gmail.com"
                    autoFocus
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  {language === 'pt' ? 'Nome Completo (Opcional)' : 'Full Name (Optional)'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUseCustomAccount(false)}
                  className="flex-1 py-2 rounded-lg bg-[#181818] hover:bg-[#222222] text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
                >
                  {language === 'pt' ? 'Voltar' : 'Back'}
                </button>
                <button
                  type="submit"
                  id="confirm-custom-google-account"
                  disabled={Boolean(connectingAccount) || authLoading}
                  className="flex-1 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {connectingAccount ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{language === 'pt' ? 'Continuar com Google' : 'Continue with Google'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-2 text-center text-[11px] text-neutral-500 leading-tight">
            {language === 'pt'
              ? 'Ao continuar, o Google compartilhará seu nome, endereço de e-mail e foto do perfil com o AH19 SaaS.'
              : 'By continuing, Google will share your name, email address, and profile picture with AH19 SaaS.'}
          </div>
        </div>
      </div>
    </div>
  );
};
