import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Play, Eye, ShoppingCart, TrendingUp, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const CreativeDetailModal: React.FC = () => {
  const { selectedCreative, setSelectedCreative, formatCurrency, navigate } = useApp();

  if (!selectedCreative) return null;

  return (
    <div
      id="creative-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedCreative(null)}
    >
      <div
        id="creative-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {selectedCreative.platform}
            </span>
            <h3 className="text-base font-extrabold text-slate-900">{selectedCreative.title}</h3>
          </div>

          <button
            onClick={() => setSelectedCreative(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Visual & Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Visual Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-4/5 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                <img
                  src={selectedCreative.thumbnail}
                  alt={selectedCreative.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[11px] font-mono text-white/90 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
                  <span>{selectedCreative.format}</span>
                  <span className="font-bold text-emerald-400">{selectedCreative.roas}x ROAS</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                {selectedCreative.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Total Spend</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {formatCurrency(selectedCreative.spend)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">CPC: {formatCurrency(selectedCreative.cpc)}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Revenue Generated</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                    {formatCurrency(selectedCreative.revenue)}
                  </div>
                  <div className="text-[10px] text-purple-600 font-bold mt-0.5">{selectedCreative.roas}x ROAS</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Purchases / CPA</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">
                    {selectedCreative.purchases} orders
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">CPA: {formatCurrency(selectedCreative.cpa)}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Click-Through (CTR)</div>
                  <div className="text-base font-extrabold text-blue-600 mt-0.5">
                    {selectedCreative.ctr}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Above account avg</div>
                </div>
              </div>

              {/* Creative Video Hook & Retention Diagnostics */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Video Retention Diagnostics
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedCreative.fatigueStatus === 'Fresh'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : selectedCreative.fatigueStatus === 'Scaling'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    Status: {selectedCreative.fatigueStatus}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                      <span>3-Second Hook Rate (Thumbstop)</span>
                      <span className="font-bold font-mono text-emerald-400">{selectedCreative.hookRate}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full" style={{ width: selectedCreative.hookRate }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 text-[11px] mb-1">
                      <span>15-Second Hold Rate</span>
                      <span className="font-bold font-mono text-blue-400">{selectedCreative.holdRate}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: selectedCreative.holdRate }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">Associated Campaign: </span>
                <span className="font-mono text-blue-600">{selectedCreative.campaignName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedCreative(null)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
