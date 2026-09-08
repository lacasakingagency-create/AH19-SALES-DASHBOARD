import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Store,
  Users,
  Coins,
  Shield,
  CreditCard,
  CheckCircle2,
  Plus,
  Trash2,
  Key,
  Globe,
  Database,
  Upload,
  Camera,
  X as XIcon,
} from 'lucide-react';
import { CurrencyCode, Language } from '../types';
import { getInitials } from '../utils/avatarUtils';

export const SettingsPage: React.FC = () => {
  const {
    activeSubTab,
    navigate,
    selectedCurrency,
    setSelectedCurrency,
    selectedStore,
    setSelectedStore,
    stores,
    currentUser,
    setCurrentUser,
    language,
    setLanguage,
    addToast,
    formatCurrency,
    t,
  } = useApp();

  const subTab = activeSubTab || 'profile';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [userName, setUserName] = useState(currentUser?.name || 'Abismar Henrique');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'abismar@life4billion.com');
  const [userRole, setUserRole] = useState(currentUser?.role || 'Admin');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(currentUser?.avatar);

  // Team state
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'Abismar Henrique',
      email: 'abismar@life4billion.com',
      role: 'Owner & CEO',
      avatar: undefined as string | undefined,
    },
    {
      id: '2',
      name: 'Elena Rostova',
      email: 'elena@growthagency.io',
      role: 'Media Buyer (Admin)',
      avatar: undefined as string | undefined,
    },
    {
      id: '3',
      name: 'Marcus Chen',
      email: 'marcus@finops.com',
      role: 'Financial Analyst',
      avatar: undefined as string | undefined,
    },
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Analista');

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        addToast('Arquivo muito grande', 'A imagem de perfil deve ter menos de 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUserAvatar(base64);
        if (currentUser) {
          setCurrentUser({ ...currentUser, avatar: base64 });
        }
        addToast('Foto Atualizada', 'Foto de perfil carregada com sucesso.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUserAvatar(undefined);
    if (currentUser) {
      setCurrentUser({ ...currentUser, avatar: undefined });
    }
    addToast('Foto Removida', 'Agora exibindo iniciais elegantes no perfil.');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;
    setTeamMembers([
      ...teamMembers,
      {
        id: String(Date.now()),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: newMemberRole,
        avatar: undefined,
      },
    ]);
    setNewMemberEmail('');
    addToast('Convite Enviado', `Convite de acesso enviado para ${newMemberEmail}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: userName,
        email: userEmail,
        role: userRole,
        avatar: userAvatar,
      });
    }
    addToast('Perfil Atualizado', 'Suas informações de conta foram salvas com sucesso.');
  };

  return (
    <div id="settings-page-container" className="space-y-6 select-none">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#1E1E1E] overflow-x-auto max-w-full">
          {[
            { id: 'profile', label: t.set_profile, icon: User },
            { id: 'stores', label: t.set_stores, icon: Store, count: stores.length },
            { id: 'team', label: t.set_team, icon: Users, count: teamMembers.length },
            { id: 'currency', label: t.set_currency_lang, icon: Coins },
            { id: 'security', label: t.set_api_keys, icon: Shield },
            { id: 'billing', label: t.set_billing, icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => navigate('settings', tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#FFD000] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive ? 'bg-black text-[#FFD000]' : 'bg-[#1C1C1C] text-neutral-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW: PROFILE */}
      {subTab === 'profile' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 max-w-2xl shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-4">
              {userAvatar ? (
                <div className="relative group">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#2A2A2A]"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    title="Remover foto"
                    className="absolute -top-1 -right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-transform"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-xl text-[#FFD000] tracking-wider shadow-inner">
                  {getInitials(userName)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{userName}</h3>
                <p className="text-xs text-neutral-400 font-mono">{userEmail}</p>
                <span className="inline-block text-[10px] uppercase font-bold text-black bg-[#FFD000] px-2 py-0.5 rounded mt-2 font-mono">
                  {userRole}
                </span>
              </div>
            </div>

            {/* Photo Upload Actions */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-lg bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-[#FFD000]" />
                <span>{userAvatar ? 'Alterar Foto' : 'Carregar Foto Real'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.auth_name}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.auth_email}
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Cargo / Perfil
              </label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
              />
            </div>

            <div className="pt-4 border-t border-[#1C1C1C]">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                {t.action_save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: CURRENCY & LANGUAGE */}
      {subTab === 'currency' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 max-w-2xl shadow-lg space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">{t.set_currency_lang}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Configure as preferências de idioma e moeda padrão do AH19 SaaS.
            </p>
          </div>

          {/* Language Switch */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              {t.language}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  language === 'pt'
                    ? 'bg-[#FFD000] text-black border-[#FFD000] font-bold'
                    : 'bg-[#141414] text-neutral-300 border-[#2A2A2A] hover:border-[#444444]'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">Português (Brasil)</p>
                  <p className={`text-[10px] ${language === 'pt' ? 'text-neutral-800' : 'text-neutral-500'}`}>
                    Interface 100% em português
                  </p>
                </div>
                {language === 'pt' && <CheckCircle2 className="w-4 h-4 text-black" />}
              </button>

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  language === 'en'
                    ? 'bg-[#FFD000] text-black border-[#FFD000] font-bold'
                    : 'bg-[#141414] text-neutral-300 border-[#2A2A2A] hover:border-[#444444]'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">English (US)</p>
                  <p className={`text-[10px] ${language === 'en' ? 'text-neutral-800' : 'text-neutral-500'}`}>
                    Full English Interface
                  </p>
                </div>
                {language === 'en' && <CheckCircle2 className="w-4 h-4 text-black" />}
              </button>
            </div>
          </div>

          {/* Currency Switch */}
          <div className="space-y-2 pt-2 border-t border-[#1C1C1C]">
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Moeda Principal do Workspace
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['USD', 'EUR', 'GBP', 'BRL'] as CurrencyCode[]).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setSelectedCurrency(curr)}
                  className={`p-3 rounded-lg border text-center font-mono transition-colors ${
                    selectedCurrency === curr
                      ? 'bg-[#FFD000] text-black border-[#FFD000] font-bold'
                      : 'bg-[#141414] text-neutral-300 border-[#2A2A2A] hover:border-[#444444]'
                  }`}
                >
                  <span className="text-sm font-bold block">{curr}</span>
                  <span className="text-[10px] opacity-75">
                    {curr === 'USD' && '$ (Dólar)'}
                    {curr === 'EUR' && '€ (Euro)'}
                    {curr === 'GBP' && '£ (Libra)'}
                    {curr === 'BRL' && 'R$ (Real)'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: STORES */}
      {subTab === 'stores' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 space-y-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4">
            <div>
              <h3 className="text-base font-bold text-white">{t.set_stores}</h3>
              <p className="text-xs text-neutral-400">Lojas Shopify e canais de venda integrados ao AH19.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedStore === store.id
                    ? 'bg-[#141414] border-[#FFD000] ring-1 ring-[#FFD000]'
                    : 'bg-[#141414] border-[#222222] hover:border-[#333333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black border border-[#2A2A2A] flex items-center justify-center text-[#FFD000]">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{store.name}</h4>
                      <p className="text-[11px] text-neutral-400 font-mono">
                        {store.badge ? `Canal: ${store.badge}` : 'Canal Principal'}
                      </p>
                    </div>
                  </div>

                  {selectedStore === store.id && (
                    <span className="text-[10px] font-bold uppercase text-black bg-[#FFD000] px-2 py-0.5 rounded font-mono">
                      Ativa
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: TEAM */}
      {subTab === 'team' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 space-y-6 shadow-lg">
          <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4">
            <div>
              <h3 className="text-base font-bold text-white">{t.set_team}</h3>
              <p className="text-xs text-neutral-400">Controle de acessos, administradores e analistas.</p>
            </div>
          </div>

          {/* Add member form */}
          <form onSubmit={handleInviteMember} className="flex gap-3 flex-wrap">
            <input
              type="email"
              placeholder="novo.membro@empresa.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-[#FFD000]"
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-xs focus:outline-none focus:border-[#FFD000]"
            >
              <option value="Admin">Administrador (Total)</option>
              <option value="Media Buyer">Gestor de Tráfego</option>
              <option value="Analista">Analista Financeiro</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm"
            >
              Convidar Membro
            </button>
          </form>

          {/* Members list */}
          <div className="divide-y divide-[#1A1A1A]">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#2A2A2A]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-xs text-[#FFD000]">
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white">{member.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono">{member.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-white bg-[#141414] px-2.5 py-1 rounded border border-[#2A2A2A]">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: SECURITY & API */}
      {subTab === 'security' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 space-y-6 shadow-lg max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-white">{t.set_api_keys}</h3>
            <p className="text-xs text-neutral-400">Tokens de autenticação para webhooks e integrações server-side.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Chave de API Principal (Produção)</span>
                <span className="text-[10px] font-mono text-[#FFD000] bg-black px-2 py-0.5 rounded border border-[#2A2A2A]">
                  AH19_LIVE_TOKEN
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value="ah19_live_sec_9938f9202a0149bbcc8"
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg bg-black border border-[#2A2A2A] text-neutral-400 text-xs font-mono select-all"
                />
                <button
                  onClick={() => addToast('Copiado', 'Chave copiada para a área de transferência')}
                  className="px-3 py-2 rounded-lg bg-[#FFD000] text-black font-bold text-xs hover:bg-[#E6BC00] transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">URL Endpoint de Webhook</span>
                <span className="text-[10px] font-mono text-neutral-400">HTTPS POST</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value="https://api.ah19.life4billion.com/v1/webhooks/ingress"
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg bg-black border border-[#2A2A2A] text-neutral-400 text-xs font-mono select-all"
                />
                <button
                  onClick={() => addToast('Copiado', 'Webhook copiado')}
                  className="px-3 py-2 rounded-lg bg-[#222222] text-white font-bold text-xs hover:bg-[#333333] transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: BILLING */}
      {subTab === 'billing' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 space-y-6 shadow-lg max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white">{t.set_billing}</h3>
            <p className="text-xs text-neutral-400">Status da assinatura do motor de inteligência AH19.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#141414] border border-[#FFD000]/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#FFD000] tracking-wider font-mono">
                  Plano Ativo
                </span>
                <h4 className="text-lg font-extrabold text-white">AH19 Enterprise Scale</h4>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FFD000] text-black font-extrabold text-xs font-mono">
                Ativo
              </span>
            </div>

            <div className="text-xs text-neutral-400 space-y-1">
              <p>• Volume Ilimitado de Pedidos e Rastreamento</p>
              <p>• Multi-Store (Até 10 Lojas Shopify e Gateways)</p>
              <p>• Server-Side CAPI Tracking (Meta, Google, TikTok)</p>
              <p>• Atualização de Telemetria a Cada 60 Segundos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
