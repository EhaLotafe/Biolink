// components/Toast.tsx
import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 
                     md:left-auto md:right-8 md:translate-x-0 
                     z-[60]"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg 
                        backdrop-blur-xl border bg-[#0B1D3A]/70
                        ${
                          type === 'success'
                            ? 'border-emerald-500/40'
                            : 'border-red-500/40'
                        }`}
          >
            {type === 'success' ? (
              <CheckCircle size={20} className="text-emerald-400" />
            ) : (
              <XCircle size={20} className="text-red-400" />
            )}

            <span className="text-sm font-medium text-white">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default Toast;