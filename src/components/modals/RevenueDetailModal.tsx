import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  RotateCcw,
  Tag,
  Receipt,
  Truck,
  ArrowUpRight,
} from 'lucide-react';

export const RevenueDetailModal: React.FC = () => {
  const { revenueModalOpen, setRevenueModalOpen, formatCurrency, kpis, chartData, dateRangeLabel } = useApp();

  if (!revenueModalOpen) return null;

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalProfit = chartData.reduce((acc, curr) => acc + curr.profit, 0);
  const totalOrders = chartData.reduce((acc, curr) => acc + curr.orders, 0);
  const totalRefunds = chartData.reduce((acc, curr) => acc + curr.refunds, 0);
  const totalDiscounts = chartData.reduce((acc, curr) => acc + curr.discounts, 0);
  const totalTaxes = chartData.reduce((acc, curr) => acc + curr.taxes, 0);
  const totalShipping = chartData.reduce((acc, curr) => acc + curr.shipping, 0);

  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const marginPct = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  return (
    <div
      id="revenue-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setRevenueModalOpen(false)}
    >
      <div
        id="revenue-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900">Revenue & Profit Breakdown Analytics</h3>
              <span className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                P&L Statement
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive financial decomposition for {dateRangeLabel}</p>
          </div>

          <button
            onClick={() => setRevenueModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top 4 Key Financial Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="text-[11px] font-bold uppercase text-blue-600 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Gross Revenue</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-1">{formatCurrency(totalRevenue)}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 18.4% vs prev</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="text-[11px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                <span>Net Profit</span>
              </div>
              <div className="text-lg font-extrabold text-emerald-700 mt-1">{formatCurrency(totalProfit)}</div>
              <div className="text-[10px] text-emerald-800 font-bold mt-0.5">{marginPct}% Net Margin</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Total Orders</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-1">{totalOrders.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Fulfilled & Verified</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Average Order Value</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 mt-1">{formatCurrency(aov)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Basket Average</div>
            </div>
          </div>

          {/* Detailed Financial Line Deductions Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
              Financial Deductions & Line Items (Decomposition)
            </div>
            <div className="divide-y divide-slate-100 bg-white text-xs">
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Gross Sales (GMV)</span>
                    <span className="text-[11px] text-slate-400 block">Total order value before deductions</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 text-sm">{formatCurrency(totalRevenue)}</span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Discounts & Promos</span>
                    <span className="text-[11px] text-slate-400 block">Coupons, VIP tier sales & automatic volume bundles</span>
                  </div>
                </div>
                <span className="font-bold text-amber-600 text-sm">-{formatCurrency(totalDiscounts)}</span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Returns & Refunds</span>
                    <span className="text-[11px] text-slate-400 block">Deductions for approved customer returns</span>
                  </div>
                </div>
                <span className="font-bold text-rose-600 text-sm">-{formatCurrency(totalRefunds)}</span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Shipping Fees Collected</span>
                    <span className="text-[11px] text-slate-400 block">Paid express and international carrier surcharges</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 text-sm">+{formatCurrency(totalShipping)}</span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Taxes / VAT Collected</span>
                    <span className="text-[11px] text-slate-400 block">Remitted to US State Depts & EU VAT One-Stop-Shop</span>
                  </div>
                </div>
                <span className="font-bold text-slate-700 text-sm">{formatCurrency(totalTaxes)}</span>
              </div>

              <div className="p-4 bg-slate-50/80 flex items-center justify-between border-t-2 border-slate-200">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">Final Net Profit (Bottom-Line EAT)</span>
                  <span className="text-[11px] text-slate-500">Gross revenue minus COGS, ad spend, fees and taxes</span>
                </div>
                <span className="font-extrabold text-emerald-600 text-base">{formatCurrency(totalProfit)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setRevenueModalOpen(false)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
