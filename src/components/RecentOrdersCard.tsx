import React from 'react';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import { OrderItem } from '../types';
import { useApp } from '../context/AppContext';
import { getInitials } from '../utils/avatarUtils';

interface RecentOrdersCardProps {
  orders: OrderItem[];
  onViewAllOrders?: () => void;
  onSelectOrder?: (order: OrderItem) => void;
  currencySymbol?: string;
}

export const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({
  orders,
  onViewAllOrders,
  onSelectOrder,
  currencySymbol = '$',
}) => {
  const { t } = useApp();

  return (
    <div
      id="recent-orders-card"
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] shadow-lg flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#161616]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg icon-badge-blend flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5 drop-shadow-[0_0_4px_rgba(255,208,0,0.8)]" />
            </div>
            <h2 id="recent-orders-title" className="text-base font-bold text-white tracking-tight">
              {t.dash_recent_orders}
            </h2>
          </div>
          {onViewAllOrders && (
            <button
              id="recent-orders-view-all"
              onClick={onViewAllOrders}
              className="btn-gold-blend text-black px-2.5 py-1 rounded-md text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <span>{t.dash_view_all}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A] text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="pb-2">{t.sales_order_number}</th>
                <th className="pb-2">{t.sales_customer}</th>
                <th className="pb-2 hidden sm:table-cell">País</th>
                <th className="pb-2 text-right">{t.sales_total}</th>
                <th className="pb-2 text-right pl-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]">
              {orders.slice(0, 5).map((order) => {
                const customerName =
                  typeof order.customer === 'object' ? order.customer?.name : String(order.customer);
                const customerAvatar =
                  typeof order.customer === 'object' ? order.customer?.avatar : undefined;

                return (
                  <tr
                    key={order.id}
                    id={`order-row-${order.orderNumber.replace('#', '')}`}
                    onClick={() => onSelectOrder && onSelectOrder(order)}
                    className="group hover:bg-[#141414] transition-colors cursor-pointer"
                  >
                    {/* Order Number */}
                    <td className="py-2.5 font-bold text-white font-mono group-hover:text-[#FFD000] transition-colors">
                      {order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-2.5 text-neutral-300 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {customerAvatar ? (
                          <img
                            src={customerAvatar}
                            alt={customerName}
                            className="w-5 h-5 rounded-full object-cover border border-[#2A2A2A]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full icon-badge-blend flex items-center justify-center text-[9px] font-extrabold text-black">
                            {getInitials(customerName)}
                          </div>
                        )}
                        <span className="truncate max-w-[120px]">{customerName}</span>
                      </div>
                    </td>

                    {/* Country */}
                    <td className="py-2.5 text-neutral-400 hidden sm:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{order.flag}</span>
                        <span className="truncate max-w-[90px]">{order.country}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 font-bold text-[#FFE76A] text-right font-mono whitespace-nowrap">
                      {order.amount.replace('$', currencySymbol)}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-2.5 text-right pl-2 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${
                          order.status === 'Paid'
                            ? 'badge-gold-blend'
                            : order.status === 'Pending'
                            ? 'badge-gold-outline'
                            : 'bg-[#161616] text-neutral-500 border border-neutral-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
