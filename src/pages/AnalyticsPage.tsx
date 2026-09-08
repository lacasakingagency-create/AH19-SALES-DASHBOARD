import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Filter,
  Layers,
  Smartphone,
  Share2,
  ArrowRight,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { activeSubTab, navigate, funnelData, utmAnalytics, formatCurrency, dateRangeLabel, t } =
    useApp();

  const subTab = activeSubTab || 'funnel';

  return (
    <div id="analytics-page-container" className="space-y-6 select-none">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#1E1E1E] overflow-x-auto">
          {[
            { id: 'funnel', label: t.ana_funnel, icon: Filter },
            { id: 'attribution', label: t.ana_attribution, icon: Layers },
            { id: 'utm', label: t.ana_utm, icon: Share2, count: utmAnalytics.length },
            { id: 'devices', label: t.ana_devices, icon: Smartphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`analytics-tab-${tab.id}`}
                onClick={() => navigate('analytics', tab.id)}
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

      {/* 1. CONVERSION FUNNEL SUBTAB */}
      {subTab === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#1C1C1C] shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Fluxo de Conversão de E-Commerce (Funil)
                </h3>
                <p className="text-xs text-neutral-400">
                  Taxa de abandono e conclusão de checkout ({dateRangeLabel})
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-black bg-[#FFD000] px-3 py-1 rounded font-mono">
                  CVR Final: 2.1%
                </span>
              </div>
            </div>

            {/* Visual Funnel Step Bars */}
            <div className="space-y-3">
              {funnelData.map((stage, idx) => {
                return (
                  <div
                    key={stage.id}
                    className="space-y-2 p-3.5 rounded-xl bg-[#141414] border border-[#222222]"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-black text-[#FFD000] font-bold flex items-center justify-center text-[10px] font-mono border border-[#2A2A2A]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white">{stage.label}</span>
                      </div>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-neutral-400 font-medium">
                          {stage.formattedCount || stage.count.toLocaleString()} usuários
                        </span>
                        <span className="font-bold text-[#FFD000] text-sm">
                          {stage.percentageOfTop}%
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#1C1C1C] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFD000] rounded-full transition-all duration-500"
                        style={{ width: `${stage.percentageOfTop}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. MULTI-TOUCH ATTRIBUTION */}
      {subTab === 'attribution' && (
        <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#1C1C1C] shadow-lg space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-white">Modelos de Atribuição Multi-Toque</h3>
            <p className="text-xs text-neutral-400">
              Distribuição de crédito de conversão entre Primeiro Clique, Último Clique e Data-Driven.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
                Primeiro Contato (First Click)
              </span>
              <p className="text-xl font-bold text-white font-mono">Meta Ads: 52%</p>
              <p className="text-[11px] text-neutral-500">Maior motor de descoberta e topo de funil.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#FFD000]/40 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#FFD000] font-mono">
                Data-Driven (AH19 AI)
              </span>
              <p className="text-xl font-bold text-[#FFD000] font-mono">Meta 41% | Google 39%</p>
              <p className="text-[11px] text-neutral-400">Modelo algorítmico balanceado com CAPI.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
                Último Contato (Last Click)
              </span>
              <p className="text-xl font-bold text-white font-mono">Google Search: 48%</p>
              <p className="text-[11px] text-neutral-500">Fundo de funil e termos de marca.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. UTM PARAMETERS */}
      {subTab === 'utm' && (
        <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
          <div className="p-4 border-b border-[#1C1C1C] bg-[#0E0E0E]">
            <h3 className="text-sm font-bold text-white">Rastreamento de Tags UTM</h3>
            <p className="text-xs text-neutral-400">Parâmetros de campanha, canais e links gerados.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                  <th className="py-3 px-4">UTM Source / Medium</th>
                  <th className="py-3 px-4">Campanha</th>
                  <th className="py-3 px-4 text-center">Cliques / Visitas</th>
                  <th className="py-3 px-4 text-center">Pedidos</th>
                  <th className="py-3 px-4 text-right">Receita Gerada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {utmAnalytics.map((utm, idx) => (
                  <tr key={idx} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-white">{utm.source}/{utm.medium}</td>
                    <td className="py-3 px-4 text-neutral-300">{utm.campaign}</td>
                    <td className="py-3 px-4 text-center font-mono text-neutral-300">{utm.clicks}</td>
                    <td className="py-3 px-4 text-center font-mono text-neutral-300">{utm.orders}</td>
                    <td className="py-3 px-4 text-right font-bold text-[#FFD000] font-mono text-sm">
                      {formatCurrency(utm.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DEVICES */}
      {subTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] space-y-2">
            <div className="text-xs uppercase font-bold text-neutral-400">Mobile (iOS / Android)</div>
            <p className="text-2xl font-extrabold text-[#FFD000] font-mono">78.4%</p>
            <span className="text-[11px] text-neutral-500">Maior volume de tráfego (Instagram & TikTok)</span>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] space-y-2">
            <div className="text-xs uppercase font-bold text-neutral-400">Desktop / Mac / PC</div>
            <p className="text-2xl font-extrabold text-white font-mono">19.2%</p>
            <span className="text-[11px] text-neutral-500">Maior taxa de conversão média (3.4%)</span>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] space-y-2">
            <div className="text-xs uppercase font-bold text-neutral-400">Tablet</div>
            <p className="text-2xl font-extrabold text-white font-mono">2.4%</p>
            <span className="text-[11px] text-neutral-500">Tráfego residual</span>
          </div>
        </div>
      )}
    </div>
  );
};
