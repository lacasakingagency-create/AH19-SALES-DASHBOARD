import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Activity,
  Plus,
  RefreshCw,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import { BrandIcon } from '../components/BrandIcons';

export const IntegrationsPage: React.FC = () => {
  const {
    activeSubTab,
    navigate,
    integrations,
    eventStream,
    setConnectModalOpen,
    setSelectedEvent,
    disconnectIntegration,
    addToast,
    t,
  } = useApp();

  const subTab = activeSubTab || 'overview';
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast(
        'Pipelines Sincronizados',
        'Meta CAPI, Google Ads, TikTok e Shopify sincronizados com sucesso.'
      );
    }, 1000);
  };

  return (
    <div id="integrations-page-container" className="space-y-6 select-none">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#1E1E1E]">
          {[
            {
              id: 'overview',
              label: t.integ_connected_platforms,
              icon: ShieldCheck,
              count: integrations.length,
            },
            {
              id: 'debugger',
              label: t.integ_live_debugger,
              icon: Activity,
              count: eventStream.length,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`integrations-tab-${tab.id}`}
                onClick={() => navigate('integrations', tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFD000] text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
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

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="text-xs font-semibold text-neutral-200 bg-[#0A0A0A] hover:bg-[#141414] px-3.5 py-2 rounded-lg border border-[#222222] flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#FFD000] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : t.integ_sync_all}</span>
          </button>

          <button
            onClick={() => setConnectModalOpen(true)}
            className="text-xs font-bold text-black bg-[#FFD000] hover:bg-[#E6BC00] px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.integ_connect_platform}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Connected Platforms */}
      {subTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integ) => (
            <div
              key={integ.id}
              className="p-5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between space-y-4 hover:border-[#333333] transition-colors shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-[#2A2A2A] flex items-center justify-center">
                    <BrandIcon iconKey={integ.iconKey} className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{integ.name}</h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Último sync: {integ.lastSync}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/30 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  {integ.status}
                </span>
              </div>

              {/* Pipeline Stats */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#141414] border border-[#1E1E1E] text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Eventos Hoje</span>
                  <span className="font-bold text-white">{integ.eventsToday.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Saúde do Pipeline</span>
                  <span className="font-bold text-[#FFD000]">{integ.eventHealth}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#161616]">
                <button
                  onClick={() => disconnectIntegration(integ.id)}
                  className="text-xs text-neutral-500 hover:text-[#FFD000] font-medium transition-colors"
                >
                  {t.integ_disconnect}
                </button>
                <button
                  onClick={() => setConnectModalOpen(true)}
                  className="text-xs font-bold text-white hover:text-[#FFD000] flex items-center gap-1 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurações</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Debugger Stream */}
      {subTab === 'debugger' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
            <div>
              <h3 className="font-bold text-white text-sm">Registro de Eventos em Tempo Real</h3>
              <p className="text-xs text-neutral-400">Attribution Pipeline Server-Side (CAPI / Webhooks)</p>
            </div>
            <span className="text-xs font-mono text-[#FFD000] bg-[#141414] px-2.5 py-1 rounded border border-[#2A2A2A]">
              ● Conexão Ativa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                  <th className="py-3 px-4">Horário</th>
                  <th className="py-3 px-4">Evento</th>
                  <th className="py-3 px-4">Origem / Plataforma</th>
                  <th className="py-3 px-4">Dispositivo</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {eventStream.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-[#141414] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono text-neutral-400">{evt.timeAgo || evt.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-white font-mono">{evt.eventName}</td>
                    <td className="py-3 px-4 text-neutral-300 font-semibold">{evt.platform}</td>
                    <td className="py-3 px-4 text-neutral-400">{evt.device}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs font-bold text-[#FFD000] font-mono">
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
