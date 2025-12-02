// components/QRCodeModal.tsx
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, X } from 'lucide-react';

interface QRCodeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, isOpen, onClose }) => {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0B1D3A', // couleur principale de ton thème
          light: '#FFFFFF', // fond QR
        },
      })
        .then((dataUrl) => setQrSrc(dataUrl))
        .catch((err) => console.error('Erreur génération QR :', err));
    }
  }, [url, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      aria-describedby="qr-modal-desc"
    >
      <div className="bg-[#152C52] border border-white/10 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center relative shadow-2xl animate-float">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cosmic-500 rounded-full p-1"
          aria-label="Fermer le modal QR"
          title="Fermer"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h3 id="qr-modal-title" className="text-xl font-bold text-white mb-2 text-center">
          Votre BioLink QR
        </h3>
        <p id="qr-modal-desc" className="text-sm text-gray-400 mb-6 text-center">
          Partagez votre identité numérique instantanément.
        </p>

        {/* QR Code */}
        <div className="p-4 bg-white rounded-xl mb-6 shadow-inner flex items-center justify-center">
          {qrSrc ? (
            <img
              src={qrSrc}
              alt="Code QR généré pour votre BioLink"
              className="w-48 h-48 md:w-56 md:h-56 object-contain"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-200 animate-pulse rounded" />
          )}
        </div>

        {/* Bouton téléchargement */}
        <a
          href={qrSrc}
          download="biolink-qr.png"
          className="flex items-center gap-2 px-6 py-3 bg-cosmic-500 hover:bg-cosmic-400 text-white rounded-lg font-medium transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-cosmic-400"
        >
          <Download size={18} />
          Télécharger l'image
        </a>
      </div>
    </div>
  );
};

export default QRCodeModal;
