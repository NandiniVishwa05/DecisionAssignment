import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteConfirmProps {
  isOpen: boolean;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting?: boolean;
}

export const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  deleting,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[2px] transition-opacity animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl p-7 w-full max-w-sm text-center border border-gray-100 shadow-2xl transform transition-all animate-scaleIn">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertTriangle size={22} />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-2">
          Delete Item?
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          "<strong>{title}</strong>" will be permanently deleted. This action cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete"
            onClick={onConfirm}
            disabled={deleting}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-colors ${
              deleting ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }`}
          >
            {deleting && <Loader2 size={14} className="animate-spin" />}
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
