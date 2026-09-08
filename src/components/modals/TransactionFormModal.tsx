import React, { useState } from 'react';
import { X, Receipt, DollarSign, Calendar, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransactionFormModal: React.FC = () => {
  const {
    transactionModalOpen,
    setTransactionModalOpen,
    addTransaction,
    t,
  } = useApp();

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Vendas E-commerce');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Stripe Direct');
  const [status, setStatus] = useState<'settled' | 'pending'>('settled');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!transactionModalOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!description.trim()) errs.description = t.auth_error_required;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = t.auth_error_required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      type,
      description,
      amount: Number(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status,
      paymentMethod,
    });

    setTransactionModalOpen(false);
    setDescription('');
    setAmount('');
  };

  return (
    <div
      id="transaction-form-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={() => setTransactionModalOpen(false)}
    >
      <div
        id="transaction-form-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 shadow-2xl space-y-6 select-none"
      >
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFD000]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t.fin_add_transaction}
              </h3>
              <p className="text-xs text-neutral-400">AH19 Cash Flow & Ledger</p>
            </div>
          </div>
          <button
            id="close-tx-modal-btn"
            onClick={() => setTransactionModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.fin_type}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="tx-type-income-btn"
                onClick={() => {
                  setType('income');
                  setCategory('Vendas E-commerce');
                }}
                className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-colors ${
                  type === 'income'
                    ? 'bg-[#FFD000] text-black border-[#FFD000]'
                    : 'bg-[#141414] text-neutral-400 border-[#2A2A2A] hover:text-white'
                }`}
              >
                + {t.fin_type_income}
              </button>
              <button
                type="button"
                id="tx-type-expense-btn"
                onClick={() => {
                  setType('expense');
                  setCategory('Marketing & Ads');
                }}
                className={`py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border transition-colors ${
                  type === 'expense'
                    ? 'bg-[#FFD000] text-black border-[#FFD000]'
                    : 'bg-[#141414] text-neutral-400 border-[#2A2A2A] hover:text-white'
                }`}
              >
                - {t.fin_type_expense}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.fin_description} *
            </label>
            <input
              id="tx-input-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Fatura Meta Ads Campanha Escala"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
            />
            {errors.description && <p className="text-xs text-[#FFD000] mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.fin_amount} *
              </label>
              <div className="relative">
                <input
                  id="tx-input-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2500.00"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <DollarSign className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
              {errors.amount && <p className="text-xs text-[#FFD000] mt-1">{errors.amount}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.fin_category}
              </label>
              <div className="relative">
                <select
                  id="tx-select-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                >
                  <option value="Vendas E-commerce">Vendas E-commerce</option>
                  <option value="Vendas B2B">Vendas B2B</option>
                  <option value="Marketing & Ads">Marketing & Ads</option>
                  <option value="Custo de Mercadoria (COGS)">Custo de Mercadoria (COGS)</option>
                  <option value="Logística & Frete">Logística & Frete</option>
                  <option value="Software & Ferramentas">Software & Ferramentas</option>
                  <option value="Taxas & Meios de Pagamento">Taxas & Meios de Pagamento</option>
                  <option value="Outras Despesas">Outras Despesas</option>
                </select>
                <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.fin_due_date}
              </label>
              <div className="relative">
                <input
                  id="tx-input-duedate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <Calendar className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                id="tx-select-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              >
                <option value="settled">{t.fin_status_settled}</option>
                <option value="pending">{t.fin_status_pending}</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.sales_payment_method}
            </label>
            <input
              id="tx-input-payment-method"
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              placeholder="Cartão Corporativo / Pix / Stripe"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
            <button
              type="button"
              id="cancel-tx-modal-btn"
              onClick={() => setTransactionModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#333333] text-neutral-300 hover:text-white hover:bg-[#1A1A1A] text-sm font-medium transition-colors"
            >
              {t.action_cancel}
            </button>
            <button
              type="submit"
              id="submit-tx-modal-btn"
              className="px-5 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-sm transition-colors shadow-sm"
            >
              {t.fin_add_transaction}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
