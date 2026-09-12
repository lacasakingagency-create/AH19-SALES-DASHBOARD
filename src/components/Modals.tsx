import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  Layers,
  Globe2,
  DollarSign,
  Shield,
  ShoppingBag,
  ExternalLink,
  Plus,
  RefreshCw,
  Sliders,
  Users,
  Search,
} from 'lucide-react';
import {
  CountrySale,
  AIInsightItem,
  OrderItem,
  IntegrationItem,
} from '../types';
import {
  ShopifyIcon,
  MetaIcon,
  GoogleAdsIcon,
  GA4Icon,
  TikTokIcon,
  KlaviyoIcon,
  StripeIcon,
  AmazonIcon,
} from './BrandIcons';
import { AVAILABLE_INTEGRATIONS_TO_CONNECT, ALL_COUNTRIES_EXPANDED } from '../data/mockData';

interface CountriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol?: string;
}

export const CountriesModal: React.FC<CountriesModalProps> = ({
  isOpen,
  onClose,
  currencySymbol = '$',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  if (!isOpen) return null;

  const filteredCountries = ALL_COUNTRIES_EXPANDED.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        id="countries-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col cursor-default"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Geographic Sales Intelligence</h3>
              <p className="text-xs text-slate-500">Global customer distribution across 18 countries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search country or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* List */}
        <div className="overflow-y-auto divide-y divide-slate-100 pr-1 flex-1">
          {filteredCountries.map((c, idx) => (
            <div key={c.code} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{c.flag}</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{c.code} Market</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-extrabold text-slate-900 block">
                  {c.amount.replace('$', currencySymbol)}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">{c.percentage}% share</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total International Volume: <strong>$42,850</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AIInsightItem[];
}

export const InsightsModal: React.FC<InsightsModalProps> = ({
  isOpen,
  onClose,
  insights,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        id="insights-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[85vh] flex flex-col cursor-default"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AH19 AI Deep Intelligence</h3>
              <p className="text-xs text-slate-500">Real-time performance heuristics & growth recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 my-4 pr-1 flex-1">
          {insights.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-purple-200 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono">
                  {item.impact}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              {item.actionLabel && (
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  <button className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100/80 px-2.5 py-1 rounded-md transition-colors">
                    {item.actionLabel} →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">AI Confidence Rating: 99.4%</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (name: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const [connectingKey, setConnectingKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedConnect = (name: string) => {
    setConnectingKey(name);
    setTimeout(() => {
      onConnect(name);
      setConnectingKey(null);
    }, 900);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        id="connect-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative cursor-default"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Connect Data Source</h3>
              <p className="text-xs text-slate-500">Integrate marketing, inventory & payout streams</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5 my-4">
          {AVAILABLE_INTEGRATIONS_TO_CONNECT.map((item) => (
            <div
              key={item.name}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white flex items-center justify-between gap-3 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {item.iconKey === 'klaviyo' ? (
                    <KlaviyoIcon className="w-4 h-4" />
                  ) : item.iconKey === 'stripe' ? (
                    <StripeIcon className="w-4 h-4" />
                  ) : (
                    <AmazonIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleSimulatedConnect(item.name)}
                disabled={connectingKey === item.name}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-75"
              >
                {connectingKey === item.name ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Authorize</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

interface OrderDetailModalProps {
  order: OrderItem | null;
  onClose: () => void;
  currencySymbol?: string;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  currencySymbol = '$',
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="order-modal-container"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center font-mono font-bold text-cyan-700 text-xs">
              {order.orderNumber}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Order Invoice Summary</h3>
              <p className="text-xs text-slate-500">{order.date} at {order.time}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-150">
            <div className="flex items-center gap-2">
              <img
                src={typeof order.customer === 'object' ? order.customer?.avatar : (order as any).avatar}
                alt={typeof order.customer === 'object' ? order.customer?.name : String(order.customer)}
                className="w-7 h-7 rounded-full object-cover"
              />
              <div>
                <span className="font-bold text-slate-900 block">
                  {typeof order.customer === 'object' ? order.customer?.name : String(order.customer)}
                </span>
                <span className="text-[11px] text-slate-500">{order.country} {order.flag}</span>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                order.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-1.5 border-y border-slate-100 py-3">
            <div className="flex justify-between text-slate-600">
              <span>Items Count:</span>
              <span className="font-semibold text-slate-900">{order.itemsCount} products</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Gateway:</span>
              <span className="font-semibold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Fulfillment Status:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> Ready to ship
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="text-sm font-bold text-slate-800">Total Charged:</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {order.amount.replace('$', currencySymbol)}
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        id="settings-modal-container"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Workspace Settings</h3>
              <p className="text-xs text-slate-500">Life4Billion AH19 Enterprise configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-800 block mb-1">Organization Name</label>
            <input
              type="text"
              readOnly
              value="Life4Billion Global Holdings"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Platform Engine</label>
              <input
                type="text"
                readOnly
                value="AH19 Real-Time v4.2"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Owner Account</label>
              <input
                type="text"
                readOnly
                value="Abismar H."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px]">SOC2 Type II & GDPR compliant end-to-end encryption enabled.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Build #AH19-2026.08</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-xs hover:bg-slate-800"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
};
