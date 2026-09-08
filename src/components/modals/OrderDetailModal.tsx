import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  MapPin,
  Smartphone,
  Share2,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const OrderDetailModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, formatCurrency, addToast, setSelectedCustomer, customers } = useApp();

  if (!selectedOrder) return null;

  const handleOpenCustomer = () => {
    const cust = (customers || []).find((c) => c.name === selectedOrder.customer.name || c.email === selectedOrder.customer.email);
    if (cust) {
      setSelectedCustomer(cust);
      setSelectedOrder(null);
    } else {
      addToast({ title: 'Viewing Customer Record', type: 'info' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Paid & Fulfilled</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Payment Pending</span>
          </span>
        );
      case 'Refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refunded</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div
      id="order-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedOrder(null)}
    >
      <div
        id="order-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {selectedOrder.orderNumber}
            </span>
            {getStatusBadge(selectedOrder.status)}
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Store: {selectedOrder.storeId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-order-link-btn"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                addToast({ title: 'Order Link Copied to Clipboard', type: 'success' });
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Copy Order Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              id="close-order-modal-btn"
              onClick={() => setSelectedOrder(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Customer & Timestamp Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={selectedOrder.customer.avatar}
                alt={selectedOrder.customer.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{selectedOrder.customer.name}</h4>
                  <button
                    onClick={handleOpenCustomer}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <div className="text-xs text-slate-500">{selectedOrder.customer.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedOrder.date} at {selectedOrder.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">{selectedOrder.flag}</span>
                <span className="font-semibold">{selectedOrder.country}</span>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-slate-500" />
              <span>Purchased Line Items ({selectedOrder.items.length})</span>
            </h5>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.sku} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment & Security */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span>Payment & Security</span>
              </div>
              <div className="text-xs text-slate-700 flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-900">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="text-xs text-slate-700 flex justify-between">
                <span className="text-slate-500">Fraud Analysis:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Low Risk (Passed 3DS)</span>
                </span>
              </div>
              <div className="text-xs text-slate-700 flex justify-between">
                <span className="text-slate-500">Device Platform:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedOrder.device}</span>
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-800">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Discount applied:</span>
                  <span>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-500">
                <span>Shipping:</span>
                <span className="font-medium text-slate-800">
                  {selectedOrder.shipping === 0 ? 'Free Shipping' : formatCurrency(selectedOrder.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Estimated Tax / VAT:</span>
                <span className="font-medium text-slate-800">{formatCurrency(selectedOrder.tax)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatCurrency(selectedOrder.rawAmount)}</span>
              </div>
            </div>
          </div>

          {/* Marketing & Attribution Tracking */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Attribution & UTM Parameters</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {selectedOrder.trafficSource}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 text-[10px] block uppercase">Campaign</span>
                <span className="font-mono text-slate-200 truncate block mt-0.5">{selectedOrder.campaign}</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 text-[10px] block uppercase">utm_source</span>
                <span className="font-mono text-slate-200 block mt-0.5">{selectedOrder.utm.source}</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 text-[10px] block uppercase">utm_medium</span>
                <span className="font-mono text-slate-200 block mt-0.5">{selectedOrder.utm.medium}</span>
              </div>
              {selectedOrder.utm.content && (
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 text-[10px] block uppercase">utm_content (Ad Creative)</span>
                  <span className="font-mono text-slate-200 truncate block mt-0.5">{selectedOrder.utm.content}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            id="modal-refund-btn"
            onClick={() => {
              addToast({
                title: `Refund Initiated for ${selectedOrder.orderNumber}`,
                description: 'Sent to Shopify & payment gateway for processing.',
                type: 'info',
              });
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
          >
            Issue Refund / Return
          </button>

          <button
            id="modal-close-btn"
            onClick={() => setSelectedOrder(null)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
