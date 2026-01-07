// components/PublicProfile.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LinkItem } from '../types';
import { THEMES } from '../constants';
import { Icon } from './Icons';
import { Share2, Check, ExternalLink, MessageCircle, QrCode } from 'lucide-react'; // Ajout de QrCode
import { supabase } from '../supabaseClient';
import QRCodeModal from './QRCodeModal'; // Import de la modal QR

interface PublicProfileProps {
  user: UserProfile;
  previewMode?: boolean;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ user, previewMode = false }) => {
  const theme = THEMES.find(t => t.id === user.themeId) || THEMES[0];
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false); // État pour afficher le QR Code

  // 1. TRACKING RÉEL DES VUES
  useEffect(() => {
    if (previewMode || !user.id) return;

    const trackView = async () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      try {
        await supabase.from('analytics').insert({
          user_id: user.id,
          event_type: 'view',
          device: isMobile ? 'mobile' : 'desktop',
          country: 'RDC' 
        });
      } catch (err) {
        console.error("Erreur analytics vue:", err);
      }
    };
    trackView();
  }, [user.id, previewMode]);

  // 2. SEO & MÉTA-TAGS DYNAMIQUES
  useEffect(() => {
    if (previewMode) return;

    const title = `${user.displayName} (@${user.username}) | BioLink.cd`;
    const description = user.bio || `Découvrez les liens officiels de ${user.displayName}.`;
    
    document.title = title;

    const updateMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', user.avatarUrl || '', 'property');
    updateMeta('twitter:title', title);
    updateMeta('twitter:image', user.avatarUrl || '');
  }, [user, previewMode]);

  // 3. TRACKING DES CLICS
  const handleLinkClick = async (link: LinkItem) => {
    if (previewMode) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    supabase.from('analytics').insert({
      user_id: user.id,
      link_id: link.id,
      event_type: 'click',
      device: isMobile ? 'mobile' : 'desktop'
    }).then();
  };

  const handleShare = async () => {
    if (previewMode) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: user.displayName, url });
      } catch (err) {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappLink = user.links.find(l => l.icon === 'whatsapp' && l.active);

  return (
    <div className={`min-h-full w-full flex flex-col items-center ${theme.bgClass} ${theme.textClass} transition-colors duration-500 overflow-y-auto relative font-sans selection:bg-indigo-500/30`}>
      
      {/* Barre d'outils supérieure (QR + Partage) */}
      {!previewMode && (
        <div className="absolute top-6 right-6 z-30 flex gap-2">
          {/* Bouton QR Code */}
          <button
            onClick={() => setShowQR(true)}
            aria-label="Afficher le QR Code"
            className="p-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full hover:bg-white/20 transition-all shadow-xl active:scale-90 text-white"
          >
            <QrCode size={20} />
          </button>

          {/* Bouton Partage */}
          <button
            onClick={handleShare}
            aria-label="Partager le profil"
            className="p-3 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full hover:bg-white/20 transition-all shadow-xl active:scale-90 text-white"
          >
            {copied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} />}
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md px-6 py-16 flex flex-col items-center gap-10 relative z-10">
        
        {/* Avatar Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="relative group">
            <motion.div 
              animate={user.is_premium ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 4 }}
              className={`absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full blur ${user.is_premium ? 'opacity-40' : 'opacity-10'}`}
            />
            <img
              src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`}
              alt={user.displayName}
              className="relative w-28 h-28 rounded-full object-cover border-4 border-white/10 shadow-2xl"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter flex items-center justify-center gap-2 text-white">
              {user.displayName}
              {user.verified && (
                <div className="bg-blue-500 rounded-full p-1 shadow-lg" title="Profil Vérifié Officiel">
                  <Check size={12} className="text-white stroke-[4px]" />
                </div>
              )}
            </h1>
            <p className="text-[15px] opacity-70 font-medium leading-relaxed max-w-[300px]">
              {user.bio}
            </p>
          </div>
        </motion.div>

        {/* Links Stack */}
        <div className="w-full flex flex-col gap-4">
          {user.links
            .filter(l => l.active)
            .sort((a,b) => a.position - b.position)
            .map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative w-full p-4 rounded-2xl flex items-center justify-between
                          transition-all duration-300 border border-white/5 shadow-2xl
                          ${theme.buttonClass} 
                          ${link.is_priority ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20' : ''}`}
            >
              {link.is_priority && (
                <span className="absolute inset-0 rounded-2xl bg-indigo-500/10 animate-pulse pointer-events-none" />
              )}

              <div className="flex items-center gap-4 relative z-10">
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors text-white">
                  <Icon name={link.icon} className={`w-5 h-5 ${theme.accentClass}`} />
                </div>
                <span className="font-bold text-[15px] tracking-tight text-white">{link.title}</span>
              </div>
              <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-all mr-2 text-white" />
            </motion.a>
          ))}
        </div>

        {/* Footer Branding */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <div className="h-px w-12 bg-white/10" />
          <button 
            onClick={() => !previewMode && window.open('https://biolink.cd', '_blank')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-[10px] font-black">B</span>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black tracking-widest uppercase opacity-40 text-white">Créer mon</p>
              <p className="text-xs font-bold tracking-tighter opacity-80 group-hover:text-indigo-400 transition-colors text-white">BioLink RDC</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* WhatsApp Floating Button */}
      <AnimatePresence>
        {whatsappLink && !previewMode && (
          <motion.a
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            href={whatsappLink.url}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-8 p-4 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] z-50 group"
          >
            <MessageCircle size={28} fill="white" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* Modals */}
      <QRCodeModal 
        url={window.location.href} 
        isOpen={showQR} 
        onClose={() => setShowQR(false)} 
      />

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default PublicProfile;