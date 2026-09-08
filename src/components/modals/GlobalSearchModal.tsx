import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, ShoppingBag, Package, User, Megaphone, Globe2, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    orders,
    products,
    customers,
    campaigns,
    countries,
    setSelectedOrder,
    setSelectedProduct,
    setSelectedCustomer,
    setSelectedCampaign,
    navigate,
    formatCurrency,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (globalSearchOpen) {
      setQuery('');
    }
  }, [globalSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    const matchedOrders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.country.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q))
    );

    const matchedProducts = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );

    const matchedCustomers = customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );

    const matchedCampaigns = campaigns.filter(
      (c) => c.name.toLowerCase().includes(q) || c.platform.toLowerCase().includes(q)
    );

    const matchedCountries = countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );

    return {
      orders: matchedOrders,
      products: matchedProducts,
      customers: matchedCustomers,
      campaigns: matchedCampaigns,
      countries: matchedCountries,
      total:
        matchedOrders.length +
        matchedProducts.length +
        matchedCustomers.length +
        matchedCampaigns.length +
        matchedCountries.length,
    };
  }, [query, orders, products, customers, campaigns, countries]);

  if (!globalSearchOpen) return null;

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto"
      onClick={() => setGlobalSearchOpen(false)}
    >
      <div
        id="global-search-modal"
        className="bg-[#0A0A0A] rounded-2xl shadow-2xl border border-[#222222] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1C1C1C] gap-3 bg-[#0E0E0E]">
          <Search className="w-5 h-5 text-[#FFE76A] shrink-0" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search orders (#10045), products, customers, campaigns, countries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-hidden font-medium"
          />
          <button
            id="close-search-button"
            onClick={() => setGlobalSearchOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!query.trim() && (
            <div className="py-8 px-4 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl icon-badge-blend text-white mb-3 shadow-md">
                <Search className="w-6 h-6 drop-shadow-[0_0_5px_rgba(255,208,0,0.8)]" />
              </div>
              <h4 className="text-sm font-bold text-white">Quick Global Search</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                Type an order number like <span className="font-mono font-bold text-[#FFE76A]">#10045</span>, a customer name like <span className="font-semibold text-white">Alexander</span>, or a product like <span className="font-semibold text-white">Smart Ring</span>.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-neutral-400 font-mono">
                <span className="px-2 py-0.5 bg-[#141414] rounded border border-[#2A2A2A] text-neutral-300">ESC</span> to close
                <span>•</span>
                <span className="px-2 py-0.5 badge-gold-outline rounded">⌘K</span> to trigger
              </div>
            </div>
          )}

          {results && results.total === 0 && (
            <div className="py-10 text-center text-neutral-400">
              <p className="text-sm font-semibold text-neutral-300">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-500 mt-1">Try checking for typos or search by another keyword.</p>
            </div>
          )}

          {results && results.orders.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 flex items-center gap-1.5 font-mono">
                <div className="w-4 h-4 rounded icon-badge-blend flex items-center justify-center">
                  <ShoppingBag className="w-2.5 h-2.5 text-black stroke-[2.5]" />
                </div>
                <span>Orders ({results.orders.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.orders.map((order) => (
                  <button
                    key={order.id}
                    id={`search-res-order-${order.id}`}
                    onClick={() => {
                      setSelectedOrder(order);
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#141414] border border-transparent hover:border-[#222222] flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-mono font-bold badge-gold-blend px-2 py-0.5 rounded shadow-sm">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs font-semibold text-white">{order.customer.name}</span>
                      <span className="text-xs text-neutral-400">• {order.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FFE76A] font-mono">{formatCurrency(order.rawAmount)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FFE76A] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && results.products.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 flex items-center gap-1.5 font-mono">
                <div className="w-4 h-4 rounded icon-badge-blend flex items-center justify-center">
                  <Package className="w-2.5 h-2.5 text-black stroke-[2.5]" />
                </div>
                <span>Products ({results.products.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.products.map((product) => (
                  <button
                    key={product.id}
                    id={`search-res-prod-${product.id}`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#141414] border border-transparent hover:border-[#222222] flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-7 h-7 rounded-md object-cover border border-[#2A2A2A] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{product.name}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{product.sku}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FFE76A] font-mono">{formatCurrency(product.price)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FFE76A] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && results.customers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 flex items-center gap-1.5 font-mono">
                <div className="w-4 h-4 rounded icon-badge-blend flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-black stroke-[2.5]" />
                </div>
                <span>Customers ({results.customers.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.customers.map((customer) => (
                  <button
                    key={customer.id}
                    id={`search-res-cust-${customer.id}`}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#141414] border border-transparent hover:border-[#222222] flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#2A2A2A] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{customer.name}</div>
                        <div className="text-[10px] text-neutral-400">{customer.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold badge-gold-blend px-2 py-0.5 rounded shadow-sm">
                        LTV {formatCurrency(customer.ltv)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FFE76A] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && results.campaigns.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 flex items-center gap-1.5 font-mono">
                <div className="w-4 h-4 rounded icon-badge-blend flex items-center justify-center">
                  <Megaphone className="w-2.5 h-2.5 text-black stroke-[2.5]" />
                </div>
                <span>Campaigns ({results.campaigns.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.campaigns.map((camp) => (
                  <button
                    key={camp.id}
                    id={`search-res-camp-${camp.id}`}
                    onClick={() => {
                      setSelectedCampaign(camp);
                      navigate('marketing', camp.platform);
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#141414] border border-transparent hover:border-[#222222] flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded badge-gold-blend shadow-sm">
                        {camp.platform}
                      </span>
                      <div className="text-xs font-bold text-white truncate max-w-sm">{camp.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FFE76A] font-mono">{camp.roas}x ROAS</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FFE76A] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && results.countries.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 flex items-center gap-1.5 font-mono">
                <div className="w-4 h-4 rounded icon-badge-blend flex items-center justify-center">
                  <Globe2 className="w-2.5 h-2.5 text-black stroke-[2.5]" />
                </div>
                <span>Countries ({results.countries.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {results.countries.map((country) => (
                  <button
                    key={country.code}
                    id={`search-res-country-${country.code}`}
                    onClick={() => {
                      navigate('countries', 'overview', country.code);
                      setGlobalSearchOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#141414] border border-transparent hover:border-[#222222] flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{country.flag}</span>
                      <div className="text-xs font-bold text-white">{country.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FFE76A] font-mono">{country.amount}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FFE76A] transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
