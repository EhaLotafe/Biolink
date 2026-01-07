// components/PublicProfile.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LinkItem } from '../types';
import { THEMES } from '../constants';
import { Icon } from './Icons';
import { Share2, Check, ExternalLink, MessageCircle, QrCode, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import QRCodeModal from './QRCodeModal';

interface PublicProfileProps {
  user: UserProfile;
  previewMode?: boolean;
}

const getInitials = (name: string) => {
  if (!name) return "??";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const PublicProfile: React.FC<PublicProfileProps> = ({ user, previewMode = false }) => {
  const theme = THEMES.find(t => t.id === user.themeId) || THEMES[0];
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // 1. TRACKING AVANCÉ (PILIER D)
  useEffect(() => {
    if (previewMode || !user.id) return;

    const trackView = async () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Récupérer la provenance (ex: tiktok.com, facebook.com)
      const referrer = document.referrer ? new URL(document.referrer).hostname : 'Direct';
      
      // Récupérer la ville via une API IP (Utilisation de ipapi.co pour la RDC)
      let city = 'Inconnu';
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        city = geoData.city || 'RDC';
      } catch (e) {
        console.error("Geo error:", e);
      }

      try {
        await supabase.from('analytics').insert({
          user_id: user.id,
          event_type: 'view',
          device: isMobile ? 'mobile' : 'desktop',
          country: 'RDC',
          city: city,
          referrer: referrer
        });
      } catch (err) {
        console.error("Erreur analytics:", err);
      }
    };

    trackView();
    document.title = `${user.displayName || user.username} | BioLink.cd`;
  }, [user.id, user.displayName, user.username, previewMode]);

  // 2. GESTION DES CLICS & MOT DE PASSE (PILIER C)
  const handleLinkClick = async (link: LinkItem) => {
    if (previewMode) return;

    // Vérification du mot de passe pour les liens protégés
    if (link.password) {
      const inputPass = prompt("🔐 Ce lien est protégé par un mot de passe :");
      if (inputPass !== link.password) {
        alert("Mot de passe incorrect. Accès refusé.");
        return;
      }
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Tracking du clic
    supabase.from('analytics').insert({
      user_id: user.id,
      link_id: link.id,
      event_type: 'click',
      device: isMobile ? 'mobile' : 'desktop'
    }).then();

    // Redirection
    window.open(link.url, '_blank');
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

  // Filtrage intelligent : liens actifs + planification (Pilier C)
  const visibleLinks = user.links.filter(link => {
    if (!link.active) return false;

    const now = new Date();
    if (link.scheduled_start && new Date(link.scheduled_start) > now) return false;
    if (link.scheduled_end && new Date(link.scheduled_end) < now) return false;

    return true;
  }).sort((a,b) => a.position - b.position);

  const whatsappLink = user.links.find(l => l.icon === 'whatsapp' && l.active);

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center ${theme.bgClass} ${theme.textClass} transition-colors duration-500 overflow-y-auto relative font-sans selection:bg-indigo-500/30`}
      style={user.is_premium && (user as any).background_url ? {
        backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.75), rgba(3, 7, 18, 0.85)), url(${(user as any).background_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}
    >
      
      {/* Top Controls */}
      {!previewMode && (
        <div className="absolute top-6 right-6 z-30 flex gap-2">
          <button
            onClick={() => setShowQR(true)}
            aria-label="QR Code"
            className="p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full hover:bg-white/20 transition-all text-white shadow-xl active:scale-90"
          >
            <QrCode size={20} />
          </button>

          <button
            onClick={handleShare}
            aria-label="Partager"
            className="p-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full hover:bg-white/20 transition-all text-white shadow-xl active:scale-90"
          >
            {copied ? <Check size={20} className="text-emerald-400" /> : <Share2 size={20} />}
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="w-full max-w-md px-6 py-16 flex flex-col items-center gap-10 relative z-10">
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="relative group">
            <motion.div 
              animate={user.is_premium ? { scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] } : {}}
              transition={{ repeat: Infinity, duration: 4 }}
              className={`absolute -inset-4 bg-gradient-to-tr ${user.is_premium ? 'from-amber-400 to-yellow-600' : 'from-indigo-600 to-purple-600'} rounded-full blur-2xl opacity-20`}
            />
            
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="relative w-28 h-28 rounded-[32px] object-cover border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="relative w-28 h-28 rounded-[32px] bg-[#0B1D3A] border-4 border-white/10 flex items-center justify-center font-black text-indigo-400 text-3xl shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {getInitials(user.displayName || user.username)}
              </div>
            )}

            {user.verified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-4 border-[#030712] shadow-lg animate-in zoom-in duration-1000 delay-500">
                <Check size={12} className="text-white stroke-[4px]" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter text-white">
              {user.displayName || user.username}
            </h1>
            <p className="text-[15px] opacity-70 font-medium leading-relaxed max-w-[300px] mx-auto">
              {user.bio}
            </p>
          </div>
        </motion.div>

        {/* Links Grid */}
        <div className="w-full flex flex-col gap-4">
          {visibleLinks.map((link, index) => (
            <motion.button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative w-full p-4 rounded-2xl flex items-center justify-between
                          transition-all duration-300 border border-white/5 shadow-2xl
                          ${theme.buttonClass} 
                          ${link.is_priority ? 'ring-2 ring-indigo-500/50 shadow-indigo-500/20 animate-pulse' : ''}`}
            >
              {/* Animation pour liens prioritaires */}
              {link.is_priority && (
                <span className="absolute inset-0 rounded-2xl bg-indigo-500/5 animate-pulse pointer-events-none" />
              )}

              <div className="flex items-center gap-4 relative z-10 text-white">
                <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Icon name={link.icon} className={`w-5 h-5 ${theme.accentClass}`} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] tracking-tight">{link.title}</span>
                  {link.password && <Lock size={12} className="text-slate-500" />}
                </div>
              </div>
              <ExternalLink size={14} className="opacity-20 group-hover:opacity-100 transition-all mr-2 text-white" />
            </motion.button>
          ))}
        </div>

        {/* Branding Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 flex flex-col items-center gap-6"
        >
          <div className="h-px w-12 bg-white/10" />
          <button 
            onClick={() => !previewMode && window.open('https://biolinkweb.netlify.app/', '_blank')}
            className="flex items-center gap-3 group opacity-60 hover:opacity-100 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-[10px] font-black italic">B</span>
            </div>
            <div className="text-left font-sans">
              <p className="text-[9px] font-black tracking-widest uppercase text-slate-500 leading-none">Propulsé par</p>
              <p className="text-xs font-bold tracking-tighter text-white leading-none mt-1">BioLink RDC</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* WhatsApp Quick Button */}
      <AnimatePresence>
        {whatsappLink && !previewMode && (
          <motion.a
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            href={whatsappLink.url}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-8 right-8 p-4 bg-[#25D366] text-white rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] z-50 group active:scale-90 transition-transform"
          >
            <MessageCircle size={28} fill="white" />
          </motion.a>
        )}
      </AnimatePresence>

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