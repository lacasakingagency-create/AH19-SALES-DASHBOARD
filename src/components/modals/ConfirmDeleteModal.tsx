import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfirmDeleteModal: React.FC = () => {
  const { confirmModal, closeConfirmModal, t } = useApp();

  if (!confirmModal.isOpen) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    closeConfirmModal();
  };

  return (
    <div
      id="confirm-delete-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={closeConfirmModal}
    >
      <div
        id="confirm-delete-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0A0A0A] border border-[#222222] rounded-xl p-6 shadow-2xl space-y-5 select-none"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFD000]/10 border border-[#FFD000]/30 flex items-center justify-center text-[#FFD000]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {confirmModal.title || t.action_confirm}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">AH19 System Protection</p>
            </div>
          </div>
          <button
            id="close-confirm-modal-btn"
            onClick={closeConfirmModal}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed">
          {confirmModal.message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="cancel-confirm-btn"
            onClick={closeConfirmModal}
            className="px-4 py-2 rounded-lg border border-[#333333] text-neutral-300 hover:text-white hover:bg-[#1A1A1A] font-medium text-sm transition-colors"
          >
            {confirmModal.cancelText || t.action_cancel}
          </button>
          <button
            id="execute-confirm-btn"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-sm transition-colors shadow-sm"
          >
            {confirmModal.confirmText || t.action_confirm}
          </button>
        </div>
      </div>
    </div>
  );
};
