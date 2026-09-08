import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Plus,
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  Award,
  Edit2,
  Trash2,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { CustomerItem } from '../types';
import { getInitials } from '../utils/avatarUtils';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    formatCurrency,
    setSelectedCustomer,
    setCustomerModalOpen,
    setCustomerToEdit,
    triggerDeleteConfirm,
    deleteCustomer,
    t,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'spent' | 'ltv' | 'orders'>('spent');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const matchQuery =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.country.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
          statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
        return matchQuery && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'ltv') return sortAsc ? a.ltv - b.ltv : b.ltv - a.ltv;
        if (sortBy === 'orders')
          return sortAsc ? a.ordersCount - b.ordersCount : b.ordersCount - a.ordersCount;
        return sortAsc ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent;
      });
  }, [customers, search, statusFilter, sortBy, sortAsc]);

  const totalCustomers = customers.length;
  const avgLtv = totalCustomers > 0 ? customers.reduce((acc, c) => acc + c.ltv, 0) / totalCustomers : 0;
  const repeatRate = '41.8%';
  const vipCount = customers.filter((c) => c.status === 'vip').length;

  const handleCreateCustomer = () => {
    setCustomerToEdit(null);
    setCustomerModalOpen(true);
  };

  const handleEditCustomer = (cust: CustomerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomerToEdit(cust);
    setCustomerModalOpen(true);
  };

  const handleDeleteCustomer = (cust: CustomerItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDeleteConfirm(
      `${t.action_delete} ${cust.name}`,
      `Deseja realmente excluir o cliente "${cust.name}"? Os históricos de compra serão preservados.`,
      () => deleteCustomer(cust.id)
    );
  };

  return (
    <div id="customers-page-container" className="space-y-6 select-none">
      {/* Header Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.cust_total_customers}</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">
            {totalCustomers.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#FFD000] font-semibold mt-1 font-mono">Base ativa AH19</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.cust_avg_ltv}</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">
            {formatCurrency(avgLtv)}
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Valor vitalício por cliente</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.cust_repeat_rate}</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">{repeatRate}</div>
          <div className="text-[10px] text-neutral-500 mt-1">Acima do benchmark (30%)</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#1C1C1C] flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-neutral-400">{t.cust_vip_tier}</div>
          <div className="text-2xl font-extrabold text-[#FFD000] mt-1 font-mono">{vipCount} VIPs</div>
          <div className="text-[10px] text-neutral-500 mt-1">Gasto &gt; $500</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#141414] border border-[#2A2A2A] text-xs font-semibold text-white py-2 px-3 rounded-lg focus:outline-none focus:border-[#FFD000]"
          >
            <option value="all">Todos os Segmentos</option>
            <option value="vip">Tier VIP</option>
            <option value="active">Ativo</option>
            <option value="at_risk">Em Risco</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSortBy(sortBy === 'spent' ? 'orders' : 'spent');
              setSortAsc(!sortAsc);
            }}
            className="px-3 py-2 rounded-lg bg-[#141414] border border-[#2A2A2A] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FFD000]" />
            <span>Ordenar: {sortBy === 'spent' ? 'Gasto' : 'Pedidos'}</span>
          </button>

          <button
            id="add-new-customer-btn"
            onClick={handleCreateCustomer}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.cust_add_new}</span>
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase tracking-wider font-semibold bg-[#111111]">
                <th className="py-3 px-4">{t.cust_name}</th>
                <th className="py-3 px-4">{t.cust_country}</th>
                <th className="py-3 px-4 text-center">{t.cust_orders_count}</th>
                <th className="py-3 px-4 text-right">{t.cust_total_spent}</th>
                <th className="py-3 px-4 text-right">{t.cust_ltv}</th>
                <th className="py-3 px-4 text-center">{t.cust_status}</th>
                <th className="py-3 px-4 text-right">{t.cust_last_order}</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    id={`customer-row-${cust.id}`}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-[#141414] transition-colors cursor-pointer group"
                  >
                    {/* Customer Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {cust.avatar ? (
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="w-8 h-8 rounded-lg object-cover border border-[#2A2A2A]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-xs text-[#FFD000]">
                            {getInitials(cust.name)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white group-hover:text-[#FFD000] transition-colors">
                            {cust.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />
                            <span>{cust.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="py-3.5 px-4 text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{cust.country}</span>
                      </div>
                    </td>

                    {/* Orders Count */}
                    <td className="py-3.5 px-4 text-center font-bold text-white font-mono">
                      {cust.ordersCount}
                    </td>

                    {/* Total Spent */}
                    <td className="py-3.5 px-4 text-right font-bold text-[#FFD000] font-mono text-sm">
                      {formatCurrency(cust.totalSpent)}
                    </td>

                    {/* LTV */}
                    <td className="py-3.5 px-4 text-right font-bold text-white font-mono">
                      {formatCurrency(cust.ltv)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          cust.status === 'vip'
                            ? 'bg-[#FFD000] text-black border-[#FFD000]'
                            : cust.status === 'active'
                            ? 'bg-[#141414] text-white border-[#2A2A2A]'
                            : 'bg-transparent text-neutral-500 border-neutral-700'
                        }`}
                      >
                        {cust.status === 'vip' ? 'VIP' : cust.status === 'active' ? 'Ativo' : 'Em Risco'}
                      </span>
                    </td>

                    {/* Last Order */}
                    <td className="py-3.5 px-4 text-right text-neutral-400 font-mono text-[11px]">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{cust.lastPurchaseDate || cust.firstOrderDate}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-cust-${cust.id}`}
                          onClick={(e) => handleEditCustomer(cust, e)}
                          className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-[#222222] transition-colors"
                          title={t.action_edit}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-cust-${cust.id}`}
                          onClick={(e) => handleDeleteCustomer(cust, e)}
                          className="p-1.5 rounded text-neutral-400 hover:text-[#FFD000] hover:bg-[#222222] transition-colors"
                          title={t.action_delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
