import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerFormModal: React.FC = () => {
  const {
    customerModalOpen,
    setCustomerModalOpen,
    customerToEdit,
    setCustomerToEdit,
    addCustomer,
    updateCustomer,
    t,
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [country, setCountry] = useState('Brasil');
  const [status, setStatus] = useState<'active' | 'vip' | 'at-risk' | 'churned'>('active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name || '');
      setEmail(customerToEdit.email || '');
      setPhone(customerToEdit.phone || '');
      setCity(customerToEdit.city || 'São Paulo');
      setCountry(customerToEdit.country || 'Brasil');
      setStatus(customerToEdit.status || 'active');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCity('São Paulo');
      setCountry('Brasil');
      setStatus('active');
    }
    setErrors({});
  }, [customerToEdit, customerModalOpen]);

  if (!customerModalOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = t.auth_error_required;
    if (!email.trim()) {
      errs.email = t.auth_error_required;
    } else if (!email.includes('@')) {
      errs.email = t.auth_error_invalid_email;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, {
        name,
        email,
        phone,
        city,
        country,
        status,
      });
    } else {
      addCustomer({
        name,
        email,
        phone: phone || '+55 11 98888-7777',
        city,
        country,
        status,
      });
    }

    setCustomerModalOpen(false);
    setCustomerToEdit(null);
  };

  return (
    <div
      id="customer-form-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={() => {
        setCustomerModalOpen(false);
        setCustomerToEdit(null);
      }}
    >
      <div
        id="customer-form-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 shadow-2xl space-y-6 select-none"
      >
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFD000]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {customerToEdit ? t.cust_edit : t.cust_add_new}
              </h3>
              <p className="text-xs text-neutral-400">AH19 Customer CRM</p>
            </div>
          </div>
          <button
            id="close-customer-modal-btn"
            onClick={() => {
              setCustomerModalOpen(false);
              setCustomerToEdit(null);
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
            <input
              id="cust-input-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Luiza Albuquerque"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
            />
            {errors.name && <p className="text-xs text-[#FFD000] mt-1">{errors.name}</p>}
          </div>

          {/* Customer Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.cust_email} *
            </label>
            <div className="relative">
              <input
                id="cust-input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="luiza@exemplo.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            {errors.email && <p className="text-xs text-[#FFD000] mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.cust_phone}
            </label>
            <div className="relative">
              <input
                id="cust-input-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 11 98888-7777"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              />
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.cust_location}
              </label>
              <div className="relative">
                <input
                  id="cust-input-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="São Paulo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.cust_status}
              </label>
              <select
                id="cust-select-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              >
                <option value="active">{t.cust_status_active}</option>
                <option value="vip">{t.cust_status_vip}</option>
                <option value="inactive">{t.cust_status_inactive}</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
            <button
              type="button"
              id="cancel-customer-modal-btn"
              onClick={() => {
                setCustomerModalOpen(false);
                setCustomerToEdit(null);
              }}
              className="px-4 py-2 rounded-lg border border-[#333333] text-neutral-300 hover:text-white hover:bg-[#1A1A1A] text-sm font-medium transition-colors"
            >
              {t.action_cancel}
            </button>
            <button
              type="submit"
              id="submit-customer-modal-btn"
              className="px-5 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-sm transition-colors shadow-sm"
            >
              {customerToEdit ? t.action_save : t.cust_add_new}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
