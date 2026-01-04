// components/QRCodeModal.tsx
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, QrCode as QrIcon, Share2, Check } from 'lucide-react';
import { useNotify } from './ToastContext'; // Import du système de notification global

interface QRCodeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, isOpen, onClose }) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useNotify();

  useEffect(() => {
    if (isOpen && url) {
      // Génération haute définition pour impression (800px)
      QRCode.toDataURL(url, {
        width: 800, 
        margin: 2,
        color: {
          dark: '#0B1D3A', // Indigo Profond BioLink
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H' 
      })
        .then((dataUrl) => setQrSrc(dataUrl))
        .catch((err) => console.error('Erreur génération QR :', err));
    }
  }, [url, isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast("Lien copié dans le presse-papier !", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Erreur lors de la copie", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Overlay avec flou cinétique */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Fenêtre Modal "Liquid Glass" */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="relative w-full max-w-sm bg-[#030712] border border-white/10 rounded-[40px] p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col items-center z-10 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
          >
            {/* Décoration lumineuse interne */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />

            {/* Bouton Fermer Pro */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-90"
              aria-label="Fermer"
              title="Fermer"
            >
              <X size={20} />
            </button>

            {/* Header Icon & Text */}
            <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-inner">
              <QrIcon size={28} />
            </div>

            <h3 id="qr-title" className="text-2xl font-black text-white mb-2 text-center tracking-tighter">
              Partager mon BioLink
            </h3>
            <p className="text-sm text-slate-400 mb-8 text-center leading-relaxed font-medium">
              Téléchargez votre QR Code haute résolution pour vos supports physiques.
            </p>

            {/* QR Code avec conteneur de protection */}
            <div className="relative group mb-10">
              <div className="absolute -inset-4 bg-indigo-500/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                {qrSrc ? (
                  <img
                    src={qrSrc}
                    alt="Votre QR Code BioLink RDC"
                    className="w-48 h-48 md:w-56 md:h-56 object-contain pointer-events-none select-none"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Boutons d'Action SaaS */}
            <div className="w-full space-y-3">
              <a
                href={qrSrc}
                download={`biolink-qr-pro.png`}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
              >
                <Download size={18} />
                Télécharger le QR
              </a>
              
              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest
                           ${copied 
                             ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                             : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                           }`}
              >
                {copied ? (
                  <>
                    <Check size={14} className="stroke-[3px]" />
                    Lien copié !
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    Copier l'URL directe
                  </>
                )}
              </button>
            </div>

            {/* Micro-Branding de confiance */}
            <div className="mt-10 flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
              <div className="w-4 h-4 rounded bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white">B</div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Verified by BioLink.cd</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Icône de chargement simple si Lucide n'est pas dispo
const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default QRCodeModal;