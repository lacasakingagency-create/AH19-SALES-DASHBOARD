import React from 'react';
import { useApp } from '../../context/AppContext';
import { CountrySale } from '../../types';
import { X, TrendingUp, DollarSign, ShoppingCart, Megaphone, MapPin, Building2, Package } from 'lucide-react';

interface CountryDetailModalProps {
  country: CountrySale | null;
  onClose: () => void;
}

export const CountryDetailModal: React.FC<CountryDetailModalProps> = ({ country, onClose }) => {
  const { formatCurrency, navigate } = useApp();

  if (!country) return null;

  return (
    <div
      id="country-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="country-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">{country.name}</h3>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {country.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Generates <span className="font-bold text-slate-800">{country.percentage}%</span> of total global revenue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Total Revenue</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {country.amount}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{country.orders} total orders</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">AOV</div>
              <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                {formatCurrency(country.aov)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">CVR {country.conversionRate}%</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Ad Spend</div>
              <div className="text-lg font-extrabold text-amber-600 mt-0.5">
                {formatCurrency(country.adSpend)}
              </div>
              <div className="text-[10px] text-purple-600 font-bold mt-1">{country.roas}x ROAS</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-400">Net Profit</div>
              <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
                {formatCurrency(country.profit)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Margin: {((country.profit / country.rawAmount) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Regional / State Breakdown */}
          {country.states && country.states.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Regional & State Distribution</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">Top Performing Regions</span>
              </div>

              <div className="space-y-2">
                {country.states.map((st, i) => {
                  const share = Math.round((st.revenue / country.rawAmount) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{st.name}</span>
                        <span>
                          {formatCurrency(st.revenue)} ({st.orders} orders • {share}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${share}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Cities & Top Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Top Cities */}
            {country.topCities && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Top Metro Cities</span>
                </h5>
                <div className="divide-y divide-slate-200/60">
                  {country.topCities.map((city, idx) => (
                    <div key={idx} className="py-2 flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{city.name}</span>
                      <span className="font-bold text-slate-900">{formatCurrency(city.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Products */}
            {country.topProducts && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  <span>Top Converting Products</span>
                </h5>
                <div className="divide-y divide-slate-200/60">
                  {country.topProducts.map((p, idx) => (
                    <div key={idx} className="py-2 flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{p.name}</span>
                      <span className="font-bold text-blue-600">{p.sales} units</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              navigate('marketing', 'overview');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>View {country.name} Marketing Campaigns</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
