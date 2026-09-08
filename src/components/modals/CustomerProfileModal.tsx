import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { getInitials } from '../../utils/avatarUtils';

export const CustomerProfileModal: React.FC = () => {
  const { selectedCustomer, setSelectedCustomer, formatCurrency, setSelectedOrder, orders, t } = useApp();

  if (!selectedCustomer) return null;

  return (
    <div
      id="customer-profile-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedCustomer(null)}
    >
      <div
        id="customer-profile-modal"
        className="bg-[#0A0A0A] rounded-2xl shadow-2xl border border-[#222222] w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-150 my-8 text-white select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Avatar & Status */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1C1C1C] bg-[#0E0E0E]">
          <div className="flex items-center gap-4">
            {selectedCustomer.avatar ? (
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#2A2A2A] shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-lg text-[#FFD000] shrink-0">
                {getInitials(selectedCustomer.name)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                {selectedCustomer.status === 'vip' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-[#FFD000] text-black border border-[#FFD000]">
                    <Award className="w-3 h-3" />
                    <span>VIP Customer</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#181818] text-neutral-300 border border-[#2A2A2A] capitalize">
                    {selectedCustomer.status}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-neutral-500" />
                  {selectedCustomer.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  {selectedCustomer.city}, {selectedCustomer.country} {selectedCustomer.flag}
                </span>
              </div>
            </div>
          </div>

          <button
            id="close-customer-modal-btn"
            onClick={() => setSelectedCustomer(null)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#181818] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Lifetime Value & Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1E1E1E]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Spent</div>
              <div className="text-lg font-extrabold text-white mt-0.5">
                {formatCurrency(selectedCustomer.totalSpent)}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">{selectedCustomer.ordersCount} total orders</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1E1E1E]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Estimated LTV</div>
              <div className="text-lg font-extrabold text-[#FFD000] mt-0.5">
                {formatCurrency(selectedCustomer.ltv)}
              </div>
              <div className="text-[10px] text-[#FFD000]/80 font-semibold mt-1">High retention tier</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1E1E1E]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Average Order (AOV)</div>
              <div className="text-lg font-extrabold text-white mt-0.5">
                {formatCurrency(selectedCustomer.aov)}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">per checkout</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#121212] border border-[#1E1E1E]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">First Order Date</div>
              <div className="text-xs font-bold text-white mt-1.5 font-mono">
                {selectedCustomer.firstOrderDate}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">Last: {selectedCustomer.lastPurchaseDate}</div>
            </div>
          </div>

          {/* Acquisition Attribution */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#1E1E1E] text-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Acquisition Multi-Touch</span>
              <span className="text-[11px] text-[#FFD000] font-mono">{selectedCustomer.acquisitionSource}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-[#181818] p-2.5 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">First Touch Ad Campaign</span>
                <span className="text-neutral-200 font-mono mt-0.5 block truncate">{selectedCustomer.firstTouchCampaign}</span>
              </div>
              <div className="bg-[#181818] p-2.5 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Last Touch Converting Campaign</span>
                <span className="text-neutral-200 font-mono mt-0.5 block truncate">{selectedCustomer.lastTouchCampaign}</span>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#FFD000]" />
              <span>Purchase History ({selectedCustomer.orders.length})</span>
            </h4>
            <div className="divide-y divide-[#1C1C1C] border border-[#222222] rounded-xl overflow-hidden">
              {selectedCustomer.orders.map((ord) => (
                <div key={ord.id} className="p-3.5 flex items-center justify-between gap-4 bg-[#101010] hover:bg-[#161616]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-black bg-[#FFD000] px-2 py-0.5 rounded">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">{ord.date}</span>
                    </div>
                    <div className="text-xs text-neutral-300 font-medium mt-1">{ord.itemsSummary}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white font-mono">{formatCurrency(ord.total)}</span>
                    <button
                      onClick={() => {
                        const fullOrder = (orders || []).find((o) => o.orderNumber === ord.orderNumber);
                        if (fullOrder) {
                          setSelectedOrder(fullOrder);
                          setSelectedCustomer(null);
                        }
                      }}
                      className="text-xs font-bold text-[#FFD000] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Invoice</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Journey Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FFD000]" />
              <span>Multi-Touch Customer Journey Timeline</span>
            </h4>
            <div className="space-y-3 pl-2 border-l-2 border-[#262626]">
              {selectedCustomer.journey.map((step, idx) => (
                <div key={idx} className="relative pl-4">
                  <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#FFD000] border-2 border-black" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{step.event}</span>
                    <span className="text-neutral-500 font-mono text-[10px]">{step.date}</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">{step.details}</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#181818] text-neutral-300 border border-[#282828]">
                    {step.channel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0E0E0E] border-t border-[#1C1C1C] flex justify-end">
          <button
            onClick={() => setSelectedCustomer(null)}
            className="text-xs font-bold text-black bg-[#FFD000] hover:bg-[#E6BC00] px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
