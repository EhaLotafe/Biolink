// types.ts

/**
 * Liste exhaustive des icônes supportées pour BioLink.cd 2026
 */
export type IconName = 
  | 'instagram' | 'facebook' | 'twitter' | 'x' | 'linkedin' | 'github' 
  | 'youtube' | 'tiktok' | 'whatsapp' | 'telegram' | 'snapchat' | 'threads' 
  | 'mail' | 'phone' | 'globe' | 'shop' | 'work' | 'music' | 'apple' 
  | 'money' | 'pay' | 'default';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: IconName;
  active: boolean;
  clicks: number;
  position: number;    // ✅ AJOUTÉ : Pour la gestion de l'ordre des liens
  is_priority?: boolean; // ✨ Pour l'animation spéciale Premium
}

/**
 * Identifiants de thèmes disponibles
 */
export type ThemeId = 'deep-space' | 'nebula' | 'midnight' | 'aurora' | 'sunset' | 'luxury-gold'; 

export interface Theme {
  id: string; // Utilisation de string pour plus de flexibilité avec ThemeId
  name: string;
  bgClass: string;
  buttonClass: string;
  textClass: string;
  accentClass: string;
  isPremium: boolean; // ✨ Pour bloquer les thèmes VIP
}

/**
 * Profil Utilisateur complet synchronisé avec Supabase
 */
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: ThemeId;
  links: LinkItem[];
  views: number;
  verified: boolean; 
  is_premium: boolean; // ✨ Crucial pour le pack Pro (5.000 FC)
  created_at?: string;
}

/**
 * Types pour les Statistiques (Analytics)
 */
export interface AnalyticsData {
  name: string; // Nom du jour (ex: Lun, Mar)
  views: number;
  clicks: number;
}

export interface GeoData {
  country: string;
  code: string;
  visitors: number;
}

export interface DeviceData {
  device: string;
  count: number;
  color: string;
  [key: string]: any;
}