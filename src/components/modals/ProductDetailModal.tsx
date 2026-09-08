import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, TrendingUp, DollarSign, Package, Globe2, Share2, Megaphone, ArrowUpRight } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, formatCurrency, navigate } = useApp();

  if (!selectedProduct) return null;

  return (
    <div
      id="product-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div
        id="product-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{selectedProduct.name}</h3>
              <div className="text-xs text-slate-400 font-mono">
                SKU: {selectedProduct.sku} • {selectedProduct.category}
              </div>
            </div>
          </div>

          <button
            id="close-product-modal-btn"
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Total Revenue</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {formatCurrency(selectedProduct.revenue)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">↑ 22.4% vs prev</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Units Sold</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {selectedProduct.unitsSold.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">in {selectedProduct.ordersCount} orders</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Gross Profit</div>
              <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                {formatCurrency(selectedProduct.profit)}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold mt-1">{selectedProduct.margin}% Margin</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Conversion Rate</div>
              <div className="text-lg font-extrabold text-blue-600 mt-0.5">
                {selectedProduct.conversionRate}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">AOV: {formatCurrency(selectedProduct.aov)}</div>
            </div>
          </div>

          {/* Mini 7-Day Performance Spark Chart */}
          <div className="p-4 rounded-xl bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span>7-Day Units & Revenue Velocity</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">Aug 15 – Aug 21</span>
            </div>

            <div className="h-28 flex items-end gap-2 pt-4">
              {selectedProduct.salesTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="text-[10px] font-mono text-slate-500 group-hover:text-blue-600 transition-colors">
                    {item.units}
                  </div>
                  <div className="w-full bg-slate-100 rounded-t-md h-20 relative flex items-end overflow-hidden">
                    <div
                      className="w-full bg-blue-500 group-hover:bg-blue-600 transition-all rounded-t-md"
                      style={{ height: `${(item.units / 75) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{item.date.split(' ')[1]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional & Channel Breakdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top Countries for this product */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>Geographic Demand Share</span>
              </div>
              <div className="space-y-2.5">
                {selectedProduct.topCountries.map((c, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span>{c.flag}</span>
                        <span>{c.country}</span>
                      </span>
                      <span>{c.share}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${c.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources & Active Campaigns */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-amber-500" />
                <span>Top Traffic Channels & Campaigns</span>
              </div>
              <div className="space-y-2">
                {selectedProduct.trafficSources.map((ts, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                    <span className="font-medium text-slate-700">{ts.source}</span>
                    <span className="font-bold text-slate-900">{ts.share}% of orders</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Active Ad Campaigns</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.campaigns.map((camp, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate('marketing', 'overview');
                      }}
                      className="text-[10px] font-mono font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1 transition-colors"
                    >
                      <span>{camp}</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedProduct(null);
              navigate('sales', 'orders');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View all orders with this product</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setSelectedProduct(null)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
