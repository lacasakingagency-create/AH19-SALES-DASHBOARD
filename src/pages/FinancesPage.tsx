import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Search,
  Receipt,
  Trash2,
  Calendar,
  Layers,
  Percent,
} from 'lucide-react';
import { TransactionItem } from '../types';

export const FinancesPage: React.FC = () => {
  const {
    transactions,
    formatCurrency,
    setTransactionModalOpen,
    deleteTransaction,
    triggerDeleteConfirm,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'settled' | 'pending'>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        tx.category.toLowerCase().includes(search.toLowerCase()) ||
        (tx.paymentMethod && tx.paymentMethod.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, search, typeFilter, statusFilter]);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const netMargin = totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0;

  const handleDelete = (tx: TransactionItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDeleteConfirm(
      `${t.action_delete} Lançamento`,
      `Deseja realmente remover o lançamento "${tx.description}" de ${formatCurrency(tx.amount)}?`,
      () => deleteTransaction(tx.id)
    );
  };

  return (
    <div id="finances-page-container" className="space-y-6 select-none">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.fin_total_income}</span>
            <ArrowUpRight className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-[#FFD000] mt-2 font-mono">
            {formatCurrency(totalIncome)}
          </p>
          <span className="text-[10px] text-neutral-500 mt-1 font-mono">Faturamento e receitas operacionais</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.fin_total_expenses}</span>
            <ArrowDownRight className="w-4 h-4 text-neutral-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">
            {formatCurrency(totalExpenses)}
          </p>
          <span className="text-[10px] text-neutral-500 mt-1 font-mono">COGS, anúncios e custos operacionais</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.fin_net_profit}</span>
            <Wallet className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-2 font-mono">
            {formatCurrency(netBalance)}
          </p>
          <span className="text-[10px] text-neutral-500 mt-1 font-mono">Resultado operacional consolidado</span>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase">
            <span>{t.fin_net_margin}</span>
            <Percent className="w-4 h-4 text-[#FFD000]" />
          </div>
          <p className="text-2xl font-extrabold text-[#FFD000] mt-2 font-mono">{netMargin}%</p>
          <span className="text-[10px] text-neutral-500 mt-1 font-mono">Margem líquida após todas deduções</span>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1C1C1C] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#141414] border border-[#2A2A2A] rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FFD000]"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="bg-[#141414] border border-[#2A2A2A] text-xs font-semibold text-white py-2 px-3 rounded-lg focus:outline-none focus:border-[#FFD000]"
          >
            <option value="all">Todas as Operações</option>
            <option value="income">Apenas Entradas (+)</option>
            <option value="expense">Apenas Saídas (-)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#141414] border border-[#2A2A2A] text-xs font-semibold text-white py-2 px-3 rounded-lg focus:outline-none focus:border-[#FFD000]"
          >
            <option value="all">Todos os Status</option>
            <option value="settled">Liquidados</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>

        <button
          id="add-new-transaction-btn"
          onClick={() => setTransactionModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.fin_add_transaction}</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
          <h3 className="font-bold text-white text-sm">Extrato Consolidado & Livro Caixa</h3>
          <span className="text-xs text-neutral-400 font-mono">
            {filteredTransactions.length} lançamentos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                <th className="py-3 px-4">{t.fin_type}</th>
                <th className="py-3 px-4">{t.fin_description}</th>
                <th className="py-3 px-4">{t.fin_category}</th>
                <th className="py-3 px-4">{t.fin_date}</th>
                <th className="py-3 px-4">{t.sales_payment_method}</th>
                <th className="py-3 px-4 text-right">{t.fin_amount}</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    Nenhum lançamento encontrado.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                          tx.type === 'income'
                            ? 'bg-[#FFD000]/15 text-[#FFD000] border border-[#FFD000]/30'
                            : 'bg-[#1C1C1C] text-neutral-400 border border-[#2A2A2A]'
                        }`}
                      >
                        {tx.type === 'income' ? '+ Entrada' : '- Saída'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{tx.description}</td>
                    <td className="py-3 px-4 text-neutral-300">{tx.category}</td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">{tx.date}</td>
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                      {tx.paymentMethod || 'Stripe Direct'}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                        tx.type === 'income' ? 'text-[#FFD000]' : 'text-white'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          tx.status === 'settled'
                            ? 'bg-[#FFD000] text-black border-[#FFD000]'
                            : 'bg-[#141414] text-neutral-300 border-[#2A2A2A]'
                        }`}
                      >
                        {tx.status === 'settled' ? 'Liquidado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => handleDelete(tx, e)}
                        className="p-1.5 rounded text-neutral-400 hover:text-[#FFD000] hover:bg-[#222222] transition-colors"
                        title={t.action_delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
