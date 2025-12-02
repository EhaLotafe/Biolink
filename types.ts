// types.ts
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'github' | 'youtube' | 'tiktok' | 'whatsapp' | 'globe' | 'mail';
  active: boolean;
  clicks: number;
}

export type ThemeId = 'deep-space' | 'nebula' | 'midnight' | 'aurora';

export interface Theme {
  id: ThemeId;
  name: string;
  bgClass: string;
  buttonClass: string;
  textClass: string;
  accentClass: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  themeId: ThemeId;
  links: LinkItem[];
  views: number;
  verified?: boolean; // <-- ajouter ici

}

export interface AnalyticsData {
  date: string;
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