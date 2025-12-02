// constants.ts
import { Theme, UserProfile, GeoData, DeviceData } from './types';

export const THEMES: Theme[] = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    bgClass: 'bg-gradient-to-b from-[#0B1D3A] to-[#000000]',
    buttonClass: 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white',
    textClass: 'text-gray-100',
    accentClass: 'text-[#EC407A]',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    bgClass: 'bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#0B1D3A]',
    buttonClass: 'bg-[#6A1B9A]/40 hover:bg-[#6A1B9A]/60 backdrop-blur-md border border-purple-500/30 text-white',
    textClass: 'text-white',
    accentClass: 'text-[#F472B6]',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    bgClass: 'bg-black',
    buttonClass: 'bg-neutral-900 border border-neutral-800 hover:border-white/50 text-white',
    textClass: 'text-gray-200',
    accentClass: 'text-white',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'user_1',
  username: 'emmanuel_dev',
  displayName: 'Emmanuel K.',
  bio: 'Développeur Fullstack 🇨🇩 | Tech Entrepreneur. Je construis des solutions numériques pour l\'Afrique.',
  avatarUrl: 'https://picsum.photos/200/200',
  themeId: 'deep-space',
  views: 12450,
  links: [
    {
      id: '1',
      title: 'Mon Portfolio',
      url: 'https://portfolio.com',
      icon: 'globe',
      active: true,
      clicks: 432,
    },
    {
      id: '2',
      title: 'WhatsApp Pro',
      url: 'https://wa.me/243000000000',
      icon: 'whatsapp',
      active: true,
      clicks: 890,
    },
    {
      id: '3',
      title: 'Suivez-moi sur LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin',
      active: true,
      clicks: 210,
    },
    {
      id: '4',
      title: 'Instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      active: true,
      clicks: 150,
    }
  ]
};

export const MOCK_ANALYTICS = [
  { name: 'Lun', views: 120, clicks: 45 },
  { name: 'Mar', views: 150, clicks: 55 },
  { name: 'Mer', views: 200, clicks: 80 },
  { name: 'Jeu', views: 180, clicks: 60 },
  { name: 'Ven', views: 250, clicks: 100 },
  { name: 'Sam', views: 300, clicks: 140 },
  { name: 'Dim', views: 280, clicks: 120 },
];

export const MOCK_GEO_DATA: GeoData[] = [
  { country: 'Rép. Dém. du Congo', code: 'CD', visitors: 8500 },
  { country: 'France', code: 'FR', visitors: 2100 },
  { country: 'Belgique', code: 'BE', visitors: 800 },
  { country: 'États-Unis', code: 'US', visitors: 450 },
  { country: 'Canada', code: 'CA', visitors: 300 },
];

export const MOCK_DEVICE_DATA: DeviceData[] = [
  { device: 'Mobile', count: 9800, color: '#EC407A' }, // Cosmic Pink
  { device: 'Desktop', count: 2100, color: '#6A1B9A' }, // Nebula Purple
  { device: 'Tablet', count: 550, color: '#3B82F6' },   // Blue
];