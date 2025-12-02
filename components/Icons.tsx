// components/Icons.tsx
import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube, 
  Globe, 
  Mail, 
  Smartphone 
} from 'lucide-react';
import { SiTiktok, SiWhatsapp } from 'react-icons/si';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

// Objet qui mappe les noms aux composants
const ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  tiktok: SiTiktok,
  whatsapp: SiWhatsapp,
  mail: Mail,
  phone: Smartphone,
  default: Globe,
};

/**
 * Composant Icon dynamique
 * Choisit automatiquement l'icône selon le nom fourni
 */
export const Icon: React.FC<IconProps> = ({ name, className = '', size }) => {
  const key = name.toLowerCase().trim();
  const IconComponent = ICONS[key] || ICONS.default;

  return <IconComponent className={className} size={size} />;
};
