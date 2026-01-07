// components/Dashboard.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, LinkItem, Theme } from '../types';
import { THEMES } from '../constants';
import QRCodeModal from './QRCodeModal';
import PremiumModal from './PremiumModal';
import { useNotify } from './ToastContext';
import { motion, AnimatePresence } from 'framer-motion'; // ✅ Ajouté pour corriger erreur 2304 & 2552
import { 
  Layout, Link as LinkIcon, BarChart2, Settings, Plus, 
  Trash2, QrCode, ArrowUp, ArrowDown, Lock, Unlock, ExternalLink, Loader2, LogOut, Info,
  Star, CheckCircle2, Camera, Image as ImageIcon, Upload,
  MessageSquare, X, Zap, Calendar, MapPin, Globe, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../supabaseClient';

interface DashboardProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

type Tab = 'links' | 'appearance' | 'analytics' | 'settings';

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('links');
  const [showQR, setShowQR] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [geoStats, setGeoStats] = useState<any[]>([]);
  const [referrerStats, setReferrerStats] = useState<any[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [expandedLink, setExpandedLink] = useState<string | null>(null);
  
  const { showToast } = useNotify();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // 1. FONCTIONS D'UPLOAD
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, bucket: 'avatars' | 'backgrounds') => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("L'image est trop lourde (max 2Mo)", "error");
      return;
    }
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const dbField = bucket === 'avatars' ? 'avatar_url' : 'background_url';
      const { error: updateError } = await supabase.from('users').update({ [dbField]: publicUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      
      if (bucket === 'avatars') onUpdateUser({ ...user, avatarUrl: publicUrl });
      else onUpdateUser({ ...user, background_url: publicUrl } as any);
      
      showToast("Image mise à jour !", "success");
    } catch (err: any) { showToast("Erreur upload", "error"); } finally { setIsUploading(false); }
  };

  // 2. CHARGEMENT DES DONNÉES
  const fetchLinks = useCallback(async () => {
    setIsLoadingLinks(true);
    try {
      const { data, error } = await supabase.from('links').select('*').eq('user_id', user.id).order('position', { ascending: true });
      if (error) throw error;
      if (data) onUpdateUser({ ...user, links: data });
    } catch (err) { showToast("Erreur synchro", "error"); } finally { setIsLoadingLinks(false); }
  }, [user.id, onUpdateUser, showToast]);

  useEffect(() => {
    fetchLinks();
    const fetchMessages = async () => {
        const { data } = await supabase.from('admin_messages').select('*').eq('user_id', user.id).eq('is_read', false);
        if (data) setAdminMessages(data);
    };
    fetchMessages();
  }, [user.id, fetchLinks]);

  // 3. ANALYTICS AVANCÉS
  useEffect(() => {
    if (activeTab === 'analytics') {
      const fetchStats = async () => {
        setIsStatsLoading(true);
        try {
          const { data, error } = await supabase.from('analytics').select('*').eq('user_id', user.id);
          if (error) throw error;
          if (data) {
            const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
            const statsMap = data.reduce((acc: any, curr: any) => {
              const day = days[new Date(curr.created_at).getDay()];
              if (!acc[day]) acc[day] = { name: day, views: 0, clicks: 0 };
              curr.event_type === 'view' ? acc[day].views++ : acc[day].clicks++;
              return acc;
            }, {});
            setAnalyticsData(Object.values(statsMap));

            const geoMap = data.reduce((acc: any, curr: any) => {
                const city = curr.city || 'Inconnu';
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {});
            setGeoStats(Object.entries(geoMap).map(([name, value]) => ({ name, value: value as number })).slice(0, 5));

            const refMap = data.reduce((acc: any, curr: any) => {
                const ref = curr.referrer || 'Direct';
                acc[ref] = (acc[ref] || 0) + 1;
                return acc;
            }, {});
            setReferrerStats(Object.entries(refMap).map(([name, value]) => ({ name, value: value as number })).slice(0, 5));
          }
        } catch (err) { console.error(err); } finally { setIsStatsLoading(false); }
      };
      fetchStats();
    }
  }, [activeTab, user.id]);

  // 4. GESTION DES LIENS & THEMES
  const handleThemeChange = async (theme: Theme) => {
    if (theme.isPremium && !user.is_premium) { setShowPremium(true); return; }
    await supabase.from('users').update({ theme_id: theme.id }).eq('id', user.id);
    onUpdateUser({ ...user, themeId: theme.id as any });
  };

  const addLink = async () => {
    if (user.links.length >= 3 && !user.is_premium) { setShowPremium(true); return; }
    try {
      const position = user.links.length;
      const { data, error } = await supabase.from('links').insert([{ user_id: user.id, title: 'Nouveau lien', url: 'https://', position }]).select().single();
      if (!error) onUpdateUser({ ...user, links: [...user.links, data] });
    } catch (err) { showToast("Erreur", "error"); }
  };

  const updateLink = async (id: string, updates: any) => {
    await supabase.from('links').update(updates).eq('id', id);
    const newLinks = user.links.map(l => l.id === id ? { ...l, ...updates } : l);
    onUpdateUser({ ...user, links: newLinks });
  };

  const removeLink = async (id: string) => {
    await supabase.from('links').delete().eq('id', id);
    onUpdateUser({ ...user, links: user.links.filter(l => l.id !== id) });
  };

  const moveLink = async (index: number, dir: 'up' | 'down') => {
    const newLinks = [...user.links];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newLinks.length) return;
    [newLinks[index], newLinks[target]] = [newLinks[target], newLinks[index]];
    onUpdateUser({ ...user, links: newLinks });
    await Promise.all([
      supabase.from('links').update({ position: index }).eq('id', newLinks[index].id),
      supabase.from('links').update({ position: target }).eq('id', newLinks[target].id)
    ]);
  };

  const handlePaymentSuccess = async () => {
    await supabase.from('users').update({ is_premium: true, verified: true }).eq('id', user.id);
    onUpdateUser({ ...user, is_premium: true, verified: true });
    setShowPremium(false);
    showToast("Mode PRO activé ! ✨", "success");
  };

  const getInitials = (name: string) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "??";

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-20 md:w-24 bg-[#0B1D3A]/40 backdrop-blur-3xl border-r border-white/5 flex flex-col items-center py-8 space-y-8 z-20">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 transition-transform hover:scale-110">
          <span className="font-black text-white text-xl">B</span>
        </div>
        <NavBtn active={activeTab === 'links'} onClick={() => setActiveTab('links')} icon={<Layout size={22}/>} label="Liens" />
        <NavBtn active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon={<LinkIcon size={22}/>} label="Design" />
        <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart2 size={22}/>} label="Stats" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={22}/>} label="Profil" />
        <button onClick={onLogout} title="Déconnexion" aria-label="Déconnexion" className="mt-auto p-4 text-slate-600 hover:text-red-400 transition-colors">
          <LogOut size={22} />
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative z-10 text-white">
        {/* HEADER */}
        <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 animate-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" title="Changer d'avatar" aria-label="Changer l'avatar" onChange={(e) => handleFileUpload(e, 'avatars')} />
              <div className={`absolute -inset-1 bg-gradient-to-tr ${user.is_premium ? 'from-amber-400 to-yellow-600' : 'from-indigo-500 to-purple-600'} rounded-[24px] blur opacity-25 group-hover:opacity-60 transition duration-1000`} />
              {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="relative w-16 h-16 rounded-[20px] object-cover border border-white/10 shadow-2xl" /> : 
              <div className="relative w-16 h-16 rounded-[20px] bg-[#0B1D3A] border border-white/10 flex items-center justify-center font-black text-indigo-400 text-2xl">{getInitials(user.displayName || user.username)}</div>}
              <div className="absolute inset-0 bg-black/40 rounded-[20px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border border-white/20">
                {isUploading ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={20} className="text-white" />}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">Bonjour, {user.displayName?.split(' ')[0] || user.username} !</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">@{user.username}</span>
                {user.is_premium && <span className="bg-indigo-500/20 text-indigo-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-widest">PRO</span>}
              </div>
            </div>
          </div>
          <button onClick={() => window.open(`/#/u/${user.username}`, '_blank')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-2">Ma Page <ExternalLink size={14} /></button>
        </header>

        {/* MESSAGES HQ */}
        {adminMessages.map(msg => (
          <div key={msg.id} className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex justify-between items-center text-indigo-400">
            <div className="flex items-center gap-3 font-bold text-sm"><MessageSquare size={18} /> {msg.content}</div>
            <button title="Fermer" aria-label="Fermer" onClick={async () => { await supabase.from('admin_messages').update({ is_read: true }).eq('id', msg.id); setAdminMessages(prev => prev.filter(m => m.id !== msg.id)); }}><X size={16}/></button>
          </div>
        ))}

        <div className="max-w-4xl mx-auto pb-20">
          
          {/* TAB: LINKS (AVEC SMART OPTIONS) */}
          {activeTab === 'links' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={addLink} title="Ajouter un lien" aria-label="Ajouter un lien" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all">
                <Plus size={20}/> Nouveau lien
                {!user.is_premium && <span className="bg-black/20 px-2 py-1 rounded-full text-[10px]">{user.links.length}/3</span>}
              </button>

              <div className="space-y-4">
                {user.links.map((link, i) => (
                  <div key={link.id} className="bg-[#152C52]/20 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] transition-all hover:border-indigo-500/40 shadow-xl group">
                    <div className="flex items-center gap-5">
                        <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveLink(i, 'up')} title="Monter" aria-label="Monter" className="hover:text-indigo-400"><ArrowUp size={16}/></button>
                            <button onClick={() => moveLink(i, 'down')} title="Descendre" aria-label="Descendre" className="hover:text-indigo-400"><ArrowDown size={16}/></button>
                        </div>
                        <div className="flex-1 space-y-1">
                            <input className="bg-transparent border-none p-0 font-bold text-white w-full focus:ring-0 text-lg" value={link.title} onChange={(e) => updateLink(link.id, { title: e.target.value })} placeholder="Titre" title="Titre du lien" aria-label="Titre du lien" />
                            <input className="bg-transparent border-none p-0 text-slate-500 w-full focus:ring-0 text-xs font-mono" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} placeholder="https://..." title="URL du lien" aria-label="URL du lien" />
                        </div>
                        <button onClick={() => setExpandedLink(expandedLink === link.id ? null : link.id)} className={`p-3 rounded-xl transition-all ${expandedLink === link.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`} title="Options Avancées" aria-label="Options Avancées">
                            {expandedLink === link.id ? <ChevronUp size={20}/> : <Zap size={20}/>}
                        </button>
                        <button onClick={() => removeLink(link.id)} title="Supprimer" aria-label="Supprimer" className="p-3 text-slate-600 hover:text-red-400 transition-colors"><Trash2 size={20}/></button>
                    </div>

                    <AnimatePresence>
                        {expandedLink === link.id && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Zap size={12} className="text-amber-500" /> Mise en avant Pro
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={() => { if(!user.is_premium) return setShowPremium(true); updateLink(link.id, { is_priority: !link.is_priority })}}
                                        className={`w-full py-3 rounded-xl border-2 transition-all font-bold text-xs ${link.is_priority ? 'border-amber-500/50 bg-amber-500/10 text-amber-500' : 'border-white/5 bg-white/5 text-slate-500'}`}
                                    >
                                        {link.is_priority ? 'Animation Active ✅' : 'Activer l\'animation'}
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Lock size={12} className="text-emerald-500" /> Protection Password
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="text" value={link.password || ''} placeholder="Aucun mot de passe" title="Mot de passe du lien" aria-label="Mot de passe du lien"
                                            onChange={(e) => { if(!user.is_premium) return setShowPremium(true); updateLink(link.id, { password: e.target.value || null })}}
                                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} className="text-indigo-400" /> Planification (Option Pro)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="datetime-local" value={link.scheduled_start?.slice(0,16) || ''} title="Date de début" aria-label="Date de début"
                                            onChange={(e) => { if(!user.is_premium) return setShowPremium(true); updateLink(link.id, { scheduled_start: e.target.value })}}
                                            className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] text-white outline-none"
                                        />
                                        <input 
                                            type="datetime-local" value={link.scheduled_end?.slice(0,16) || ''} title="Date de fin" aria-label="Date de fin"
                                            onChange={(e) => { if(!user.is_premium) return setShowPremium(true); updateLink(link.id, { scheduled_end: e.target.value })}}
                                            className="bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] text-white outline-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-700">
                <div className="grid grid-cols-3 gap-6">
                    <StatCard label="Vues Profil" value={user.views || 0} color="text-indigo-400" />
                    <StatCard label="Clics Liens" value={user.links.reduce((a,b) => a + (b.clicks || 0), 0)} color="text-purple-400" />
                    <StatCard label="Taux" value={user.views > 0 ? `${((user.links.reduce((a,b) => a + (b.clicks || 0), 0) / user.views) * 100).toFixed(1)}%` : '0%'} color="text-emerald-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0B1D3A]/30 p-8 rounded-[40px] border border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2"><MapPin size={14}/> Top Villes (RDC)</h3>
                        {isStatsLoading ? <Loader2 className="animate-spin mx-auto opacity-20"/> : (
                            <div className="space-y-4">
                                {geoStats.length > 0 ? geoStats.map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300">{s.name}</span>
                                        <div className="flex-1 mx-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${(s.value / (geoStats[0]?.value || 1)) * 100}%` }} />
                                        </div>
                                        <span className="text-xs font-black text-white">{s.value}</span>
                                    </div>
                                )) : <p className="text-center text-[10px] text-slate-600">Aucune donnée géographique</p>}
                            </div>
                        )}
                    </div>
                    <div className="bg-[#0B1D3A]/30 p-8 rounded-[40px] border border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2"><Globe size={14}/> Sources</h3>
                        <div className="space-y-4">
                            {referrerStats.map((s, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">{s.name}</span>
                                    <span className="text-xs font-black text-indigo-400">{s.value} visites</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* TAB: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-10 animate-in zoom-in-95 duration-500">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {THEMES.map(theme => (
                        <button key={theme.id} onClick={() => handleThemeChange(theme)} title={`Thème ${theme.name}`} aria-label={`Thème ${theme.name}`} className={`relative group rounded-[32px] p-1.5 border-2 transition-all ${user.themeId === theme.id ? 'border-indigo-500 scale-105 shadow-2xl' : 'border-transparent hover:border-white/10'}`}>
                            <div className={`h-40 rounded-[24px] ${theme.bgClass} flex flex-col items-center justify-center p-6 overflow-hidden relative shadow-inner`}>
                                <div className="w-full h-3 rounded-full mb-3 opacity-50 bg-white/20" />
                                {theme.isPremium && !user.is_premium && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                        <div className="p-3 bg-black/60 rounded-2xl shadow-2xl text-amber-400"><Lock size={20} /></div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-center">{theme.name} {theme.isPremium && '⭐'}</p>
                        </button>
                    ))}
                </div>
                <div className={`p-8 rounded-[40px] border-2 border-dashed border-white/10 text-center space-y-4 transition-all ${!user.is_premium ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:border-indigo-500/50 cursor-pointer'}`} onClick={() => !user.is_premium ? setShowPremium(true) : bgInputRef.current?.click()}>
                    <input type="file" ref={bgInputRef} className="hidden" accept="image/*" title="Uploader un fond" aria-label="Uploader un fond" onChange={(e) => handleFileUpload(e, 'backgrounds')} />
                    <ImageIcon className="mx-auto text-slate-600" size={32} />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fond d'écran personnalisé (PRO)</p>
                </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-md mx-auto space-y-8 animate-in slide-in-from-left-4 duration-300">
               <div className="bg-white/5 p-8 rounded-[40px] border border-white/5 shadow-2xl text-center space-y-6 text-white">
                 <div className="w-16 h-16 bg-indigo-600/10 rounded-[24px] flex items-center justify-center mx-auto text-indigo-500"><QrCode size={32} /></div>
                 <h3 className="text-xl font-black text-white tracking-tight">QR Code Partage</h3>
                 <button onClick={() => setShowQR(true)} className="w-full py-4 bg-white text-black rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95">Générer</button>
               </div>
               <Link to="/about" className="block text-center text-xs font-black text-slate-600 uppercase tracking-widest hover:text-indigo-400 transition-colors">A propos de BioLink.cd</Link>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <QRCodeModal url={`${window.location.origin}/#/u/${user.username}`} isOpen={showQR} onClose={() => setShowQR(false)} />
      <PremiumModal user={user} isOpen={showPremium} onClose={() => setShowPremium(false)} onSuccess={handlePaymentSuccess} />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} title={label} aria-label={label} className={`flex flex-col items-center gap-2 transition-all group ${active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={`p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-500/15 shadow-inner' : 'group-hover:bg-white/5'}`}>
      {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>{label}</span>
  </button>
);

const StatCard = ({ label, value, color }: any) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] text-center shadow-xl">
    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-2">{label}</p>
    <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
  </div>
);

export default Dashboard;