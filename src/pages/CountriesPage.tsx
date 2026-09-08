import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Globe2,
  Search,
  ArrowUpDown,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  MapPin,
} from 'lucide-react';
import { CountryDetailModal } from '../components/modals/CountryDetailModal';
import { CountrySale } from '../types';

export const CountriesPage: React.FC = () => {
  const { countries, formatCurrency, currencySymbol, navigate, t } = useApp();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'orders' | 'roas' | 'profit'>('revenue');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountrySale | null>(null);

  const filteredCountries = useMemo(() => {
    return countries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'orders') return sortAsc ? a.orders - b.orders : b.orders - a.orders;
        if (sortBy === 'roas') return sortAsc ? a.roas - b.roas : b.roas - a.roas;
        if (sortBy === 'profit') return sortAsc ? a.profit - b.profit : b.profit - a.profit;
        return sortAsc ? a.rawAmount - b.rawAmount : b.rawAmount - a.rawAmount;
      });
  }, [countries, search, sortBy, sortAsc]);

  const totalGlobalRevenue = countries.reduce((acc, c) => acc + c.rawAmount, 0);
  const totalGlobalOrders = countries.reduce((acc, c) => acc + c.orders, 0);
  const totalAdSpend = countries.reduce((acc, c) => acc + c.adSpend, 0);

  return (
    <div id="countries-page-container" className="space-y-6 select-none">
      {/* Header Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Total de Vendas Globais</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {formatCurrency(totalGlobalRevenue)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Mercados internacionais</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Mercados Ativos</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">
            {countries.length} Países
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Conversão multi-moeda</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Investimento em Ads</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {formatCurrency(totalAdSpend)}
          </div>
          <div className="text-[10px] text-[#FFD000] font-mono mt-1">ROAS Consolidado 3.6x</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">Pedidos Internacionais</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {totalGlobalOrders.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">98.9% Taxa de Entrega</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1C1C1C] flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por país ou código ISO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFD000]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('geo-analytics')}
            className="btn-gold-blend px-3.5 py-2 rounded-lg text-xs font-bold text-black flex items-center gap-1.5 shadow-sm"
          >
            <Globe2 className="w-3.5 h-3.5 text-black" />
            <span>Analytics Geográfico Completo</span>
          </button>

          <button
            onClick={() => {
              setSortBy(sortBy === 'revenue' ? 'orders' : 'revenue');
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD000]" />
            <span>Ordenar por: {sortBy === 'revenue' ? 'Faturamento' : 'Pedidos'}</span>
          </button>
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                <th className="py-3 px-4">País / Território</th>
                <th className="py-3 px-4 text-center">Código</th>
                <th className="py-3 px-4 text-right">Faturamento</th>
                <th className="py-3 px-4 text-center">Pedidos</th>
                <th className="py-3 px-4 text-right">Ticket Médio</th>
                <th className="py-3 px-4 text-right">Investimento Ads</th>
                <th className="py-3 px-4 text-right">ROAS</th>
                <th className="py-3 px-4 text-right">Lucro Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {filteredCountries.map((c) => (
                <tr
                  key={c.code}
                  onClick={() => setSelectedCountry(c)}
                  className="hover:bg-[#141414] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{c.flag}</span>
                      <span className="font-bold text-white group-hover:text-[#FFD000] transition-colors">
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-neutral-400 font-mono text-[11px]">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-white font-mono">
                    {c.amount.replace('$', currencySymbol)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-neutral-300 font-semibold">
                    {c.orders}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-400">
                    {formatCurrency(c.aov)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-neutral-400">
                    {formatCurrency(c.adSpend)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#FFD000] text-sm">
                    {c.roas.toFixed(2)}x
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {formatCurrency(c.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Country Detail Modal */}
      {selectedCountry && (
        <CountryDetailModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};
