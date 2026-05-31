import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-emerald-600" />,
  error: <XCircle size={16} className="text-red-600" />,
  info: <AlertCircle size={16} className="text-indigo-600" />,
};

const TOAST_CLASSES: Record<ToastType, string> = {
  success: 'bg-emerald-50/95 border-emerald-200/80 text-emerald-900',
  error:   'bg-red-50/95 border-red-200/80 text-red-900',
  info:    'bg-indigo-50/95 border-indigo-200/80 text-indigo-900',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container - Positioned Top Right */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2.5 max-w-[360px] w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`animate-slideInRight flex items-center gap-3 p-3.5 px-4 rounded-xl border backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] text-sm font-semibold transition-all ${
              TOAST_CLASSES[toast.type]
            }`}
          >
            <span className="flex-shrink-0">{ICONS[toast.type]}</span>
            <span className="flex-1 leading-snug">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
