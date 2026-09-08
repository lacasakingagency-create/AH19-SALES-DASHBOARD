import React, { useState, useEffect } from 'react';
import { X, PackagePlus, DollarSign, Layers, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductFormModal: React.FC = () => {
  const {
    productModalOpen,
    setProductModalOpen,
    productToEdit,
    setProductToEdit,
    addProduct,
    updateProduct,
    t,
  } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Eletrônicos');
  const [price, setPrice] = useState('139.00');
  const [cost, setCost] = useState('32.50');
  const [stock, setStock] = useState('50');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setSku(productToEdit.sku || '');
      setCategory(productToEdit.category || 'Geral');
      setPrice(String(productToEdit.price || 139));
      setCost(String(productToEdit.cost || 32));
      setStock(String(productToEdit.stock || 50));
    } else {
      setName('');
      setSku('');
      setCategory('Wearables & Tech');
      setPrice('139.00');
      setCost('32.50');
      setStock('50');
    }
    setErrors({});
  }, [productToEdit, productModalOpen]);

  if (!productModalOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = t.auth_error_required;
    if (!sku.trim()) errs.sku = t.auth_error_required;
    if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = t.auth_error_required;
    if (!cost || isNaN(Number(cost)) || Number(cost) < 0) errs.cost = t.auth_error_required;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numPrice = Number(price);
    const numCost = Number(cost);
    const numStock = Number(stock) || 0;

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name,
        sku,
        category,
        price: numPrice,
        cost: numCost,
        stock: numStock,
        profit: (numPrice - numCost) * (productToEdit.unitsSold || 1),
        margin: Math.round(((numPrice - numCost) / numPrice) * 100),
      });
    } else {
      addProduct({
        name,
        sku,
        category,
        price: numPrice,
        cost: numCost,
        stock: numStock,
      });
    }

    setProductModalOpen(false);
    setProductToEdit(null);
  };

  return (
    <div
      id="product-form-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={() => {
        setProductModalOpen(false);
        setProductToEdit(null);
      }}
    >
      <div
        id="product-form-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 shadow-2xl space-y-6 select-none"
      >
        <div className="flex items-center justify-between border-b border-[#222222] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFD000]">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {productToEdit ? t.prod_edit : t.prod_add_new}
              </h3>
              <p className="text-xs text-neutral-400">AH19 Inventory Catalog</p>
            </div>
          </div>
          <button
            id="close-product-modal-btn"
            onClick={() => {
              setProductModalOpen(false);
              setProductToEdit(null);
            }}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              {t.prod_name} *
            </label>
            <input
              id="prod-input-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Titanium Smart Ring Ultra"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
            />
            {errors.name && <p className="text-xs text-[#FFD000] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SKU */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.prod_sku} *
              </label>
              <div className="relative">
                <input
                  id="prod-input-sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="RING-TIT-001"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#FFD000] transition-colors uppercase font-mono"
                />
                <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
              {errors.sku && <p className="text-xs text-[#FFD000] mt-1">{errors.sku}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.prod_category}
              </label>
              <select
                id="prod-select-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              >
                <option value="Wearables & Tech">Wearables & Tech</option>
                <option value="Ergonomics & Office">Ergonomics & Office</option>
                <option value="Electronics & Charging">Electronics & Charging</option>
                <option value="Acessórios Premium">Acessórios Premium</option>
                <option value="Lifestyle & Viagem">Lifestyle & Viagem</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.prod_price} *
              </label>
              <div className="relative">
                <input
                  id="prod-input-price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <DollarSign className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
              </div>
              {errors.price && <p className="text-xs text-[#FFD000] mt-1">{errors.price}</p>}
            </div>

            {/* Cost */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.prod_cost} *
              </label>
              <div className="relative">
                <input
                  id="prod-input-cost"
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <DollarSign className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
              </div>
              {errors.cost && <p className="text-xs text-[#FFD000] mt-1">{errors.cost}</p>}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                {t.prod_stock}
              </label>
              <div className="relative">
                <input
                  id="prod-input-stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white text-sm focus:outline-none focus:border-[#FFD000] transition-colors font-mono"
                />
                <Layers className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
            <button
              type="button"
              id="cancel-product-modal-btn"
              onClick={() => {
                setProductModalOpen(false);
                setProductToEdit(null);
              }}
              className="px-4 py-2 rounded-lg border border-[#333333] text-neutral-300 hover:text-white hover:bg-[#1A1A1A] text-sm font-medium transition-colors"
            >
              {t.action_cancel}
            </button>
            <button
              type="submit"
              id="submit-product-modal-btn"
              className="px-5 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-sm transition-colors shadow-sm"
            >
              {productToEdit ? t.action_save : t.prod_add_new}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
