// components/PublicProfile.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../types';
import { THEMES } from '../constants';
import { Icon } from './Icons';
import { Share2, Check } from 'lucide-react';

interface PublicProfileProps {
  user: UserProfile;
  previewMode?: boolean;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ user, previewMode = false }) => {
  const theme = THEMES.find(t => t.id === user.themeId) || THEMES[0];
  const [copied, setCopied] = useState(false);

  // Meta tags dynamiques
  useEffect(() => {
    if (previewMode) return;

    const title = `${user.displayName} | BioLink`;
    const description = user.bio || `Découvrez les liens de ${user.displayName} sur BioLink.`;
    const image = user.avatarUrl;
    const url = window.location.href;

    document.title = title;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:type', 'profile', 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  }, [user, previewMode]);

  const handleShare = async () => {
    if (previewMode) return;

    const url = window.location.href;
    const title = `BioLink de ${user.displayName}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: user.bio, url });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const avatarGradient = `bg-gradient-to-tr from-transparent via-${theme.accentClass.split('-')[1]}-500 to-transparent`;

  return (
    <div className={`min-h-full w-full flex flex-col items-center ${theme.bgClass} ${theme.textClass} transition-colors duration-500 overflow-y-auto relative`}>

      {/* Share Button */}
      {!previewMode && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleShare}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all flex items-center gap-2"
            title="Partager le profil"
          >
            {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} className="text-white" />}
          </button>
          {copied && (
            <div className="absolute top-12 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity">
              Lien copié !
            </div>
          )}
        </div>
      )}

      {/* Profile Section */}
      <div className="w-full max-w-md px-6 py-12 flex flex-col items-center gap-6 relative z-0">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <div className={`p-1 rounded-full ${avatarGradient}`}>
            <div className="rounded-full p-[2px] bg-white/10">
              <motion.img
                src={user.avatarUrl}
                alt={user.username}
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white/20 shadow-xl shadow-purple-900/20"
                whileHover={{ scale: 1.05 }}
              />
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1 flex items-center justify-center gap-2">
              {user.displayName}
              {user.verified && (
                <span className="text-blue-400" title="Vérifié">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </h1>
            <p className="text-sm opacity-80 font-light max-w-xs leading-relaxed">{user.bio}</p>
          </div>
        </motion.div>

        {/* Links Section */}
        <div className="w-full flex flex-col gap-4 mt-4">
          {user.links.filter(l => l.active).map(link => (
            <motion.a
              key={link.id}
              href={previewMode ? '#' : link.url}
              target={previewMode ? '_self' : '_blank'}
              rel="noopener noreferrer"
              aria-label={link.title}
              whileHover={{ scale: 1.02 }}
              className={`group relative w-full p-4 rounded-xl flex items-center justify-between
                          transition-all duration-300 shadow-lg hover:shadow-xl ${theme.buttonClass}`}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-3 z-10">
                <Icon name={link.icon} className={`w-5 h-5 ${theme.accentClass}`} />
                <span className="font-medium text-sm md:text-base">{link.title}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Branding Footer */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg animate-pulse-slow">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <p className="text-xs opacity-40 font-medium">Créé avec BioLink</p>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default PublicProfile;
