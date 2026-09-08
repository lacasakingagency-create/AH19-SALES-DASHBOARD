import React, { useState, useId } from 'react';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Building,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  KeyRound,
} from 'lucide-react';
import { GoldCrownIcon } from '../components/BrandIcons';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const {
    login,
    registerUser,
    resetPassword,
    authMode,
    setAuthMode,
    authLoading,
    language,
    setLanguage,
    t,
  } = useApp();

  // Controlled form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('abismar@life4billion.com');
  const [password, setPassword] = useState('ah19master');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = useState(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  const nameInputId = useId();
  const emailInputId = useId();
  const passInputId = useId();
  const confirmPassInputId = useId();
  const companyInputId = useId();
  const phoneInputId = useId();

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: '', color: 'bg-neutral-800' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: language === 'pt' ? 'Fraca' : 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: language === 'pt' ? 'Média' : 'Medium', color: 'bg-[#FFD000]' };
    return { score: 3, label: language === 'pt' ? 'Forte' : 'Strong', color: 'bg-emerald-400' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    setFormGeneralError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = t.auth_error_required;
    } else if (!emailRegex.test(email.trim())) {
      errs.email = t.auth_error_invalid_email;
    }

    if (authMode === 'register') {
      if (!name.trim()) {
        errs.name = t.auth_error_required;
      }

      if (!password) {
        errs.password = t.auth_error_required;
      } else if (password.length < 6) {
        errs.password = t.auth_error_password_length;
      }

      if (!confirmPassword) {
        errs.confirmPassword = t.auth_error_required;
      } else if (password !== confirmPassword) {
        errs.confirmPassword = t.auth_error_password_match;
      }

      if (!termsAccepted) {
        errs.terms = t.auth_error_terms;
      }
    } else if (authMode === 'login') {
      if (!password) {
        errs.password = t.auth_error_required;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || authLoading) return;

    setFormGeneralError(null);
    setEmailConfirmationRequired(false);

    if (authMode === 'login') {
      const res = await login(email, password);
      if (!res.success && res.error) {
        setFormGeneralError(res.error);
      }
    } else if (authMode === 'register') {
      const res = await registerUser({
        fullName: name,
        email,
        password,
        companyName: companyName.trim() || undefined,
        phone: phone.trim() || undefined,
      });

      if (res.success) {
        if (res.needsEmailConfirmation) {
          setEmailConfirmationRequired(true);
        } else {
          setRegisterSuccessMessage(t.auth_account_created_success);
        }
      } else if (res.error) {
        setFormGeneralError(res.error);
      }
    } else if (authMode === 'forgot') {
      const res = await resetPassword(email);
      if (res.success) {
        setForgotSuccessMessage(res.message || t.auth_forgot_sent);
      } else if (res.error) {
        setFormGeneralError(res.error);
      }
    }
  };

  const handleDemoAccess = async () => {
    setEmail('abismar@life4billion.com');
    setPassword('ah19master');
    await login('abismar@life4billion.com', 'ah19master');
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setErrors({});
    setFormGeneralError(null);
    setEmailConfirmationRequired(false);
    setForgotSuccessMessage(null);
    setRegisterSuccessMessage(null);
    setAuthMode(newMode);
  };

  return (
    <div
      id="auth-container"
      className="min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between selection:bg-[#FFD000] selection:text-black font-sans"
    >
      {/* Top Header Navigation */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#222222] flex items-center justify-center shadow-lg">
            <GoldCrownIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">AH19</span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-[#FFD000]/10 border border-[#FFD000]/30 text-[#FFD000] font-bold">
                SaaS
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono tracking-wider uppercase block">
              Financial Intelligence & Commerce
            </span>
          </div>
        </div>

        {/* Right Header: Language Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0A0A0A] border border-[#222222] rounded-lg p-1">
            <Globe className="w-4 h-4 text-neutral-400 ml-1.5" />
            <button
              id="lang-pt-auth-btn"
              type="button"
              onClick={() => setLanguage('pt')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                language === 'pt' ? 'bg-[#FFD000] text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              PT
            </button>
            <button
              id="lang-en-auth-btn"
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                language === 'en' ? 'bg-[#FFD000] text-black shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#222222] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle gold top line accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD000] via-[#FFE76A] to-[#FFD000]" />

          {/* Heading */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {authMode === 'login' && t.auth_login_title}
              {authMode === 'register' && t.auth_register_title}
              {authMode === 'forgot' && t.auth_forgot_password}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md mx-auto">
              {authMode === 'login' && t.auth_welcome_sub}
              {authMode === 'register' &&
                (language === 'pt'
                  ? 'Crie sua credencial administrativa conectada ao Supabase Auth para gerenciar seu SaaS.'
                  : 'Create your administrative credential connected to Supabase Auth to manage your SaaS.')}
              {authMode === 'forgot' && t.auth_forgot_sub}
            </p>
          </div>

          {/* Global Form Error Banner */}
          {formGeneralError && (
            <div
              id="auth-error-banner"
              className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3 text-red-200 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">{formGeneralError}</div>
            </div>
          )}

          {/* Success Banner - Email Confirmation Required */}
          {emailConfirmationRequired && (
            <div
              id="auth-email-confirm-banner"
              className="p-5 rounded-xl bg-[#141414] border border-[#FFD000]/40 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFD000]/10 border border-[#FFD000]/30 mx-auto flex items-center justify-center text-[#FFD000]">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">{t.auth_email_confirm_notice}</h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                {t.auth_confirm_email_sub}
              </p>
              <button
                id="auth-confirmed-proceed-btn"
                type="button"
                onClick={() => switchMode('login')}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#FFD000] text-black font-bold text-xs hover:bg-[#E6BC00] transition-colors"
              >
                {t.auth_sign_in_link}
              </button>
            </div>
          )}

          {/* Success Banner - Password Reset Email Sent */}
          {forgotSuccessMessage && (
            <div
              id="auth-forgot-success-banner"
              className="p-5 rounded-xl bg-[#141414] border border-[#FFD000]/40 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#FFD000]/10 border border-[#FFD000]/30 mx-auto flex items-center justify-center text-[#FFD000]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">{t.auth_forgot_sent}</h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                {forgotSuccessMessage}
              </p>
              <button
                id="auth-back-from-forgot-btn"
                type="button"
                onClick={() => switchMode('login')}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#FFD000] text-black font-bold text-xs hover:bg-[#E6BC00] transition-colors"
              >
                {t.auth_sign_in_link}
              </button>
            </div>
          )}

          {/* Registration Success Message */}
          {registerSuccessMessage && (
            <div
              id="auth-register-success-banner"
              className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-emerald-200 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{registerSuccessMessage}</span>
            </div>
          )}

          {/* Form */}
          {!emailConfirmationRequired && !forgotSuccessMessage && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Register Mode Extra Fields */}
              {authMode === 'register' && (
                <>
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor={nameInputId}
                      className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
                    >
                      {t.auth_name} <span className="text-[#FFD000]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={nameInputId}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Abismar Henrique"
                        disabled={authLoading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50"
                      />
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                    {errors.name && <p className="text-xs text-[#FFD000] mt-1">{errors.name}</p>}
                  </div>

                  {/* Company Name (Optional) */}
                  <div>
                    <label
                      htmlFor={companyInputId}
                      className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
                    >
                      {t.auth_company_name}
                    </label>
                    <div className="relative">
                      <input
                        id={companyInputId}
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Ex: Life4Billion Commerce"
                        disabled={authLoading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50"
                      />
                      <Building className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Phone / WhatsApp (Optional) */}
                  <div>
                    <label
                      htmlFor={phoneInputId}
                      className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
                    >
                      {t.auth_phone}
                    </label>
                    <div className="relative">
                      <input
                        id={phoneInputId}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+55 (11) 98765-4321"
                        disabled={authLoading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50 font-mono"
                      />
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label
                  htmlFor={emailInputId}
                  className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
                >
                  {t.auth_email} <span className="text-[#FFD000]">*</span>
                </label>
                <div className="relative">
                  <input
                    id={emailInputId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@empresa.com"
                    disabled={authLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                </div>
                {errors.email && <p className="text-xs text-[#FFD000] mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor={passInputId}
                      className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider"
                    >
                      {t.auth_password} <span className="text-[#FFD000]">*</span>
                    </label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        id="auth-forgot-password-link"
                        onClick={() => switchMode('forgot')}
                        className="text-xs text-neutral-400 hover:text-[#FFD000] transition-colors"
                      >
                        {t.auth_forgot_password}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id={passInputId}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={authLoading}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50 font-mono"
                    />
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-neutral-400 hover:text-white absolute right-3 top-2.5"
                      title="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-[#FFD000] mt-1">{errors.password}</p>}

                  {/* Password Strength Indicator (Register mode) */}
                  {authMode === 'register' && password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400 font-mono">
                          {language === 'pt' ? 'Segurança:' : 'Strength:'}{' '}
                          <span className="font-bold text-white">{passwordStrength.label}</span>
                        </span>
                        <span className="text-neutral-500 text-[10px]">
                          {language === 'pt' ? 'Mínimo 6 caracteres' : 'Min 6 chars'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden flex gap-1">
                        <div
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                          }`}
                        />
                        <div
                          className={`h-full flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password (Register mode) */}
              {authMode === 'register' && (
                <div>
                  <label
                    htmlFor={confirmPassInputId}
                    className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5"
                  >
                    {t.auth_confirm_password} <span className="text-[#FFD000]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id={confirmPassInputId}
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={authLoading}
                      className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors disabled:opacity-50 font-mono"
                    />
                    <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-neutral-400 hover:text-white absolute right-3 top-2.5"
                      title="Toggle password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-[#FFD000] mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Remember Me Checkbox (Login) */}
              {authMode === 'login' && (
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      id="auth-remember-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={authLoading}
                      className="accent-[#FFD000] w-4 h-4 rounded"
                    />
                    <span>{t.auth_remember_me}</span>
                  </label>
                </div>
              )}

              {/* Accept Terms Checkbox (Register) */}
              {authMode === 'register' && (
                <div>
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-neutral-400 select-none">
                    <input
                      id="auth-terms-checkbox"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={authLoading}
                      className="accent-[#FFD000] w-4 h-4 rounded mt-0.5"
                    />
                    <span className="leading-snug">{t.auth_accept_terms}</span>
                  </label>
                  {errors.terms && <p className="text-xs text-[#FFD000] mt-1">{errors.terms}</p>}
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={authLoading}
                className="w-full py-3 rounded-xl bg-[#FFD000] hover:bg-[#E6BC00] text-black font-extrabold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>
                      {authMode === 'register' && t.auth_creating_account}
                      {authMode === 'login' && t.auth_authenticating}
                      {authMode === 'forgot' && (language === 'pt' ? 'Enviando link...' : 'Sending link...')}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && t.auth_sign_in_btn}
                      {authMode === 'register' && t.auth_sign_up_btn}
                      {authMode === 'forgot' &&
                        (language === 'pt' ? 'Enviar Link de Redefinição' : 'Send Reset Link')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* One-click Demo Access Button (in Login mode) */}
              {authMode === 'login' && (
                <button
                  type="button"
                  id="auth-demo-access-btn"
                  onClick={handleDemoAccess}
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFD000]" />
                  <span>{t.auth_demo_access}</span>
                </button>
              )}

              {/* Mode Switchers */}
              <div className="text-center pt-3 text-xs text-neutral-400 space-y-1 border-t border-[#1C1C1C]">
                {authMode === 'login' && (
                  <p>
                    {t.auth_no_account}{' '}
                    <button
                      type="button"
                      id="switch-to-register-btn"
                      onClick={() => switchMode('register')}
                      className="text-[#FFD000] font-bold hover:underline ml-1 cursor-pointer"
                    >
                      {t.auth_sign_up_link}
                    </button>
                  </p>
                )}

                {authMode === 'register' && (
                  <p>
                    {t.auth_have_account}{' '}
                    <button
                      type="button"
                      id="switch-to-login-btn"
                      onClick={() => switchMode('login')}
                      className="text-[#FFD000] font-bold hover:underline ml-1 cursor-pointer"
                    >
                      {t.auth_sign_in_link}
                    </button>
                  </p>
                )}

                {authMode === 'forgot' && (
                  <p>
                    <button
                      type="button"
                      id="back-to-login-from-forgot-btn"
                      onClick={() => switchMode('login')}
                      className="text-[#FFD000] font-bold hover:underline cursor-pointer"
                    >
                      ← {t.auth_sign_in_link}
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-neutral-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFD000]" />
          <span>AH19 Enterprise SaaS • Powered by Supabase Auth</span>
        </div>
        <div>Strict 2-Color Architecture (#000000 & #FFD000)</div>
      </footer>
    </div>
  );
};
