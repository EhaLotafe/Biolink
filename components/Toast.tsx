// components/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  // On garde le timer interne pour la sécurité, mais le Context gère aussi la suppression
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Configuration ultra-précise des styles 2026
  const config = {
    success: {
      icon: <CheckCircle size={18} className="text-emerald-400" />,
      borderColor: 'border-emerald-500/30',
      bgColor: 'bg-emerald-500/5',
      progressBg: 'bg-emerald-500/40'
    },
    error: {
      icon: <XCircle size={18} className="text-red-400" />,
      borderColor: 'border-red-500/30',
      bgColor: 'bg-red-500/5',
      progressBg: 'bg-red-500/40'
    },
    warning: {
      icon: <AlertTriangle size={18} className="text-amber-400" />,
      borderColor: 'border-amber-500/30',
      bgColor: 'bg-amber-500/5',
      progressBg: 'bg-amber-500/40'
    },
    info: {
      icon: <Info size={18} className="text-indigo-400" />,
      borderColor: 'border-indigo-500/30',
      bgColor: 'bg-indigo-500/5',
      progressBg: 'bg-indigo-500/40'
    }
  };

  const currentStyle = config[type];

  return (
    <div className="w-full max-w-[380px] sm:max-w-[400px] pointer-events-auto">
      <div
        className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl 
                    backdrop-blur-2xl border bg-[#0B1D3A]/80 overflow-hidden
                    ${currentStyle.borderColor} ${currentStyle.bgColor}`}
      >
        {/* Barre de progression synchronisée */}
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 4, ease: "linear" }}
          className={`absolute bottom-0 left-0 h-[2px] ${currentStyle.progressBg}`}
        />

        {/* Icône avec effet de lueur */}
        <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 blur-lg opacity-20 bg-current" />
            {currentStyle.icon}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-white/95 leading-tight tracking-tight">
            {message}
          </p>
        </div>

        {/* Bouton Fermer optimisé A11y */}
        <button 
          onClick={onClose}
          aria-label="Fermer la notification"
          title="Fermer"
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all group active:scale-90"
        >
          <X size={14} className="text-white/40 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default Toast;