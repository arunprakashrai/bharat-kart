import React from 'react';
import { Mail, HelpCircle, X, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MANAGER_CREDENTIALS } from '../data/initialData';

export const FloatingWidgets: React.FC = () => {
  const { toasts, removeToast, setContactModalOpen, setTrackOrderModalOpen, requireAuth } = useApp();

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed bottom-32 sm:bottom-16 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3 rounded-xl shadow-xl text-xs font-semibold text-white animate-in slide-in-from-bottom duration-300 ${
              toast.type === 'error'
                ? 'bg-red-600'
                : toast.type === 'info'
                ? 'bg-[#071A33]'
                : 'bg-[#138808]'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Floating Support & Email Badge - Neatly Pinned to bottom-right */}
      <div className="fixed bottom-20 right-4 md:bottom-4 md:right-4 z-40 flex items-center gap-2">
        <a
          href={`mailto:${MANAGER_CREDENTIALS.email}`}
          className="flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E86F00] text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group font-bold text-xs cursor-pointer border border-white/20"
          title={`Direct Email Support with Store Manager (${MANAGER_CREDENTIALS.email})`}
        >
          <Mail className="w-4 h-4 text-white shrink-0" />
          <span className="font-bold text-xs whitespace-nowrap">Email Manager</span>
        </a>
      </div>
    </>
  );
};
