import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, DollarSign, User, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderItem } from '../../types';

export const SaleFormModal: React.FC = () => {
  const { orderModalOpen, setOrderModalOpen, orderToEdit, setOrderToEdit, addOrder, updateOrder, t } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('129.00');
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'PayPal' | 'Pix' | 'Shop Pay' | 'Klarna'>('Credit Card');
  const [status, setStatus] = useState<'Paid' | 'Pending' | 'Cancelled' | 'Refunded'>('Paid');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (orderToEdit) {
      setCustomerName(orderToEdit.customer?.name || '');
      setCustomerEmail(orderToEdit.customer?.email || '');
      setProductName(orderToEdit.items?.[0]?.name || 'Produto AH19');
      setAmount(String(orderToEdit.rawAmount || 129));
      setPaymentMethod((orderToEdit.paymentMethod as any) || 'Credit Card');
      setStatus((orderToEdit.status as any) || 'Paid');
    } else {
      setCustomerName('');
      setCustomerEmail('');
      setProductName('');
      setAmount('129.00');
      setPaymentMethod('Credit Card');
      setStatus('Paid');
    }
    setErrors({});
  }, [orderToEdit, orderModalOpen]);

  if (!orderModalOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!customerName.trim()) errs.customerName = t.auth_error_required;
    if (!customerEmail.trim()) {
      errs.customerEmail = t.auth_error_required;
    } else if (!customerEmail.includes('@')) {
      errs.customerEmail = t.auth_error_invalid_email;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = t.auth_error_required;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numAmount = Number(amount);

    if (orderToEdit) {
      updateOrder(orderToEdit.id, {
        rawAmount: numAmount,
        amount: `$${numAmount.toFixed(2)}`,
        status,
        paymentMethod,
        customer: {
          id: orderToEdit.customer?.id || 'cust-1',
          name: customerName,
          email: customerEmail,
          avatar: orderToEdit.customer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
      });
    } else {
      addOrder({
        rawAmount: numAmount,
        amount: `$${numAmount.toFixed(2)}`,
        status,
        paymentMethod,
        customer: {
          id: `cust-${Date.now()}`,
          name: customerName,
          email: customerEmail,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        },
        items: [
          {
            id: `item-${Date.now()}`,
            name: productName || 'Produto Especial AH19',
            sku: 'AH19-ITEM',
            quantity: 1,
            price: numAmount,
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=120&auto=format&fit=crop&q=80',
          },
        ],
      });
    }

    setOrderModalOpen(false);
    setOrderToEdit(null);
  };

  return (
    <div
      id="sale-form-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={() => {
        setOrderModalOpen(false);
        setOrderToEdit(null);
      }}
    >
      <div
        id="sale-form-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 shadow-2xl space-y-6 select-none"
      >
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFD000]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {orderToEdit ? t.sales_edit : t.sales_add_new}
              </h3>
              <p className="text-xs text-neutral-400">
                {orderToEdit ? orderToEdit.orderNumber : 'AH19 Order Creator'}
              </p>
            </div>
          </div>
          <button
            id="close-sale-modal-btn"
            onClick={() => {
              setOrderModalOpen(false);
              setOrderToEdit(null);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.cust_name} *
            </label>
            <div className="relative">
              <input
                id="sale-input-customer-name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Carlos Eduardo Silva"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            {errors.customerName && <p className="text-xs text-[#FFD000] mt-1">{errors.customerName}</p>}
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.cust_email} *
            </label>
            <input
              id="sale-input-customer-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="cliente@exemplo.com"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
            />
            {errors.customerEmail && <p className="text-xs text-[#FFD000] mt-1">{errors.customerEmail}</p>}
          </div>

          {/* Product Name (Optional/Default) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.prod_name}
            </label>
            <input
              id="sale-input-product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Titanium Smart Ring Ultra"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.sales_total} *
              </label>
              <div className="relative">
                <input
                  id="sale-input-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <DollarSign className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
              {errors.amount && <p className="text-xs text-[#FFD000] mt-1">{errors.amount}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.sales_status}
              </label>
              <select
                id="sale-select-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              >
                <option value="Paid">{t.sales_status_paid}</option>
                <option value="Pending">{t.sales_status_pending}</option>
                <option value="Cancelled">{t.sales_status_cancelled}</option>
                <option value="Refunded">{t.sales_status_refunded}</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.sales_payment_method}
            </label>
            <div className="relative">
              <select
                id="sale-select-payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              >
                <option value="Credit Card">Cartão de Crédito / Stripe</option>
                <option value="Pix">PIX Instantâneo</option>
                <option value="Shop Pay">Shop Pay</option>
                <option value="PayPal">PayPal</option>
                <option value="Klarna">Klarna Pay</option>
              </select>
              <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
            <button
              type="button"
              id="cancel-sale-modal-btn"
              onClick={() => {
                setOrderModalOpen(false);
                setOrderToEdit(null);
              }}
              className="px-4 py-2 rounded-lg border border-[#333333] text-neutral-300 hover:text-white hover:bg-[#1A1A1A] text-sm font-medium transition-colors"
            >
              {t.action_cancel}
            </button>
            <button
              type="submit"
              id="submit-sale-modal-btn"
              className="px-5 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-sm transition-colors shadow-sm"
            >
              {orderToEdit ? t.action_save : t.sales_add_new}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
