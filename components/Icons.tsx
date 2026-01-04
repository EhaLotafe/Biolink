// components/Icons.tsx
import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Github, 
  Youtube, 
  Globe, 
  Mail, 
  Smartphone,
  Send,        
  ShoppingBag, 
  Briefcase,   
  ExternalLink,
  MessageCircle,
  Twitter,
  Music2,
  Ghost,
  Banknote,    // Pour les paiements Mobile Money
  CreditCard,  // Pour les cartes
  HandCoins,   // Pour les dons/tips
  Twitch,
  MessageSquare,
  FileText,
  Play
} from 'lucide-react';

// Importation ciblée des logos de marques exacts
import { 
  SiTiktok, 
  SiWhatsapp, 
  SiTelegram, 
  SiSnapchat, 
  SiX, 
  SiThreads,
  SiApplemusic,
  SiSpotify,
  SiPinterest,
  SiTwitch,
  SiPaypal
} from 'react-icons/si';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

/**
 * Mappage exhaustif et intelligent pour 2026
 * Prêt pour la monétisation et le marché RDC
 */
const ICONS: Record<string, React.ComponentType<any>> = {
  // Réseaux Sociaux & Chat
  instagram: Instagram,
  facebook: Facebook,
  twitter: SiX,
  x: SiX,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  tiktok: SiTiktok,
  whatsapp: SiWhatsapp,
  telegram: SiTelegram,
  snapchat: SiSnapchat,
  threads: SiThreads,
  pinterest: SiPinterest,
  twitch: SiTwitch,
  
  // Communication & Tech
  mail: Mail,
  email: Mail,
  phone: Smartphone,
  contact: MessageSquare,
  globe: Globe,
  website: Globe,
  browser: Globe,
  
  // Business & Monétisation (Premium)
  shop: ShoppingBag,
  store: ShoppingBag,
  boutique: ShoppingBag,
  cart: ShoppingBag,
  work: Briefcase,
  portfolio: Briefcase,
  cv: FileText,
  pay: Banknote,
  money: Banknote,
  mpesa: Banknote,      // Alias pour Mobile Money
  airtel: Banknote,     // Alias pour Mobile Money
  payment: CreditCard,
  donate: HandCoins,
  tips: HandCoins,
  paypal: SiPaypal,

  // Media
  music: SiSpotify,
  spotify: SiSpotify,
  apple: SiApplemusic,
  itunes: SiApplemusic,
  podcast: Play,
  video: Play,

  // Fallback
  default: ExternalLink,
};

/**
 * Composant Icon Dynamique Optimisé
 * Gère les alias et la casse pour une flexibilité maximale utilisateur.
 */
export const Icon: React.FC<IconProps> = ({ name, className = '', size = 20 }) => {
  const key = name.toLowerCase().trim();
  
  // Logique de recherche avancée par mot-clé
  let lookupKey = 'default';
  
  if (ICONS[key]) {
    lookupKey = key;
  } else {
    // Système de détection par intention
    if (key.includes('port') || key.includes('cv') || key.includes('pro')) lookupKey = 'work';
    else if (key.includes('vendre') || key.includes('achat') || key.includes('prix')) lookupKey = 'shop';
    else if (key.includes('argent') || key.includes('payer') || key.includes('money')) lookupKey = 'pay';
    else if (key.includes('site') || key.includes('web') || key.includes('page')) lookupKey = 'globe';
    else if (key.includes('chat') || key.includes('discuter')) lookupKey = 'contact';
  }

  const IconComponent = ICONS[lookupKey] || ICONS.default;

  return (
    <IconComponent 
      className={className} 
      size={size} 
      aria-hidden="true" 
      strokeWidth={2.5} // Un peu plus épais pour le look premium 2026
    />
  );
};

export default Icon;