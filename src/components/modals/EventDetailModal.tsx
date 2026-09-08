import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Activity, CheckCircle2, AlertTriangle, ShieldCheck, Copy } from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const { selectedEvent, setSelectedEvent, addToast, formatCurrency } = useApp();

  if (!selectedEvent) return null;

  return (
    <div
      id="event-detail-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setSelectedEvent(null)}
    >
      <div
        id="event-detail-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {selectedEvent.eventName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{selectedEvent.status}</span>
            </span>
          </div>

          <button
            onClick={() => setSelectedEvent(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Platform Pipeline</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{selectedEvent.platform}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Timestamp & Time Ago</span>
              <span className="font-mono text-slate-900 mt-0.5 block">
                {selectedEvent.timestamp} ({selectedEvent.timeAgo})
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Device & Geo</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">
                {selectedEvent.flag} {selectedEvent.country} • {selectedEvent.device}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 uppercase font-bold block text-[10px]">Event Value</span>
              <span className="font-bold text-emerald-600 mt-0.5 block">
                {selectedEvent.value ? formatCurrency(selectedEvent.value) : 'N/A (Non-Monetary)'}
              </span>
            </div>
          </div>

          {/* Event ID & Cookie Parameters */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payload Identifiers & Cookies
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(JSON.stringify(selectedEvent, null, 2));
                  addToast({ title: 'Event Payload JSON Copied', type: 'success' });
                }}
                className="text-[11px] text-blue-300 hover:text-blue-200 flex items-center gap-1 font-mono"
              >
                <Copy className="w-3 h-3" />
                <span>Copy JSON</span>
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="bg-slate-800 p-2 rounded border border-slate-700">
                <span className="text-slate-400">event_id: </span>
                <span className="text-emerald-400">{selectedEvent.eventId}</span>
              </div>
              {selectedEvent.fbp && (
                <div className="bg-slate-800 p-2 rounded border border-slate-700">
                  <span className="text-slate-400">_fbp: </span>
                  <span className="text-blue-300">{selectedEvent.fbp}</span>
                </div>
              )}
              {selectedEvent.fbc && (
                <div className="bg-slate-800 p-2 rounded border border-slate-700">
                  <span className="text-slate-400">_fbc: </span>
                  <span className="text-purple-300">{selectedEvent.fbc}</span>
                </div>
              )}
              <div className="bg-slate-800 p-2 rounded border border-slate-700 break-all">
                <span className="text-slate-400">source_url: </span>
                <span className="text-slate-200">{selectedEvent.sourceUrl}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
