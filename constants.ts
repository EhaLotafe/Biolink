// constants.ts
import { Theme, UserProfile } from './types';

export const THEMES: Theme[] = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    isPremium: false, // Gratuit
    bgClass: 'bg-gradient-to-b from-[#0B1D3A] to-[#000000]',
    buttonClass: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white',
    textClass: 'text-gray-100',
    accentClass: 'text-indigo-400',
  },
  {
    id: 'midnight',
    name: 'Midnight Noir',
    isPremium: false, // Gratuit
    bgClass: 'bg-black',
    buttonClass: 'bg-neutral-900 border border-neutral-800 hover:border-white/30 text-white',
    textClass: 'text-gray-200',
    accentClass: 'text-white',
  },
  {
    id: 'nebula',
    name: 'Nebula Pro',
    isPremium: true, // PRO
    bgClass: 'bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#0B1D3A]',
    buttonClass: 'bg-[#6A1B9A]/40 hover:bg-[#6A1B9A]/60 backdrop-blur-md border border-purple-500/30 text-white',
    textClass: 'text-white',
    accentClass: 'text-[#F472B6]',
  },
  {
    id: 'aurora',
    name: 'Aurora VIP',
    isPremium: true, // PRO
    bgClass: 'bg-gradient-to-tr from-[#003973] to-[#E5E5BE]',
    buttonClass: 'bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/20 text-white shadow-lg',
    textClass: 'text-white',
    accentClass: 'text-cyan-300',
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    isPremium: true, // PRO
    bgClass: 'bg-gradient-to-tr from-[#1a1a1a] via-[#2a2a2a] to-[#000000]',
    buttonClass: 'bg-gradient-to-r from-[#D4AF37]/20 to-[#996515]/20 border border-[#D4AF37]/50 text-[#D4AF37] hover:from-[#D4AF37]/30',
    textClass: 'text-white',
    accentClass: 'text-[#D4AF37]',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'user_init',
  username: 'eha_lotafe',
  displayName: 'Eha Lotafe',
  bio: 'Développeur & Créateur de solutions digitales. Propulsé par Overcome Solution\'s 🇨🇩',
  avatarUrl: 'https://ui-avatars.com/api/?name=Eha+Lotafe&background=6366f1&color=fff',
  themeId: 'deep-space',
  views: 0,
  verified: true,
  is_premium: false, // On commence en gratuit pour tester les limites
  links: [
    {
      id: '1',
      title: 'Mon Portfolio',
      url: 'https://portfolio-overcome-solution-2026.vercel.app/',
      icon: 'work',
      active: true,
      clicks: 0,
      position: 0
    },
    {
      id: '2',
      title: 'Me contacter sur WhatsApp',
      url: 'https://wa.me/243000000000',
      icon: 'whatsapp',
      active: true,
      clicks: 0,
      position: 1
    }
  ]
};

// On garde les mocks pour les graphiques si Supabase est vide
export const MOCK_ANALYTICS = [
  { name: 'Lun', views: 0, clicks: 0 },
  { name: 'Mar', views: 0, clicks: 0 },
  { name: 'Mer', views: 0, clicks: 0 },
  { name: 'Jeu', views: 0, clicks: 0 },
  { name: 'Ven', views: 0, clicks: 0 },
  { name: 'Sam', views: 0, clicks: 0 },
  { name: 'Dim', views: 0, clicks: 0 },
];