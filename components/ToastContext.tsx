// components/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from './Toast';
import { AnimatePresence, motion } from 'framer-motion';

// Définition de la structure d'une notification individuelle
interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Supprimer un toast par son ID
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Afficher un nouveau toast (ajoute à la liste au lieu de remplacer)
  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString();
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-suppression après 4 secondes (doit matcher la durée dans Toast.tsx)
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Conteneur global des notifications */}
      <div className="fixed bottom-0 right-0 z-[100] p-6 w-full max-w-[420px] pointer-events-none flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="pointer-events-auto origin-bottom"
            >
              <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={() => removeToast(toast.id)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useNotify = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useNotify doit être utilisé à l'intérieur d'un ToastProvider");
  }
  return context;
};