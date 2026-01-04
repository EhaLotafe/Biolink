// components/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, LinkItem, Theme } from '../types';
import { THEMES } from '../constants';
import QRCodeModal from './QRCodeModal';
import PremiumModal from './PremiumModal';
import { useNotify } from './ToastContext';
import { 
  Layout, Link as LinkIcon, BarChart2, Settings, Plus, 
  Trash2, QrCode, ArrowUp, ArrowDown, Lock, ExternalLink, Loader2, LogOut, Info,
  Star, CheckCircle2
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
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  
  const { showToast } = useNotify();

  // 1. CHARGEMENT DES LIENS
  const fetchLinks = useCallback(async () => {
    setIsLoadingLinks(true);
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });
      
      if (error) throw error;
      if (data) onUpdateUser({ ...user, links: data });
    } catch (err) {
      showToast("Erreur de synchronisation des liens", "error");
    } finally {
      setIsLoadingLinks(false);
    }
  }, [user.id]); // Supprimé onUpdateUser/showToast des dépendances pour éviter les boucles

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // 2. CHARGEMENT DES ANALYTICS RÉELLES
  useEffect(() => {
    if (activeTab === 'analytics') {
      const fetchRealStats = async () => {
        setIsStatsLoading(true);
        try {
          const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

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
          }
        } catch (err) {
          showToast("Calcul des stats impossible", "error");
        } finally {
          setIsStatsLoading(false);
        }
      };
      fetchRealStats();
    }
  }, [activeTab, user.id, showToast]);

  // 3. LOGIQUE PREMIUM
  const handlePaymentSuccess = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_premium: true, verified: true })
        .eq('id', user.id);

      if (error) throw error;

      onUpdateUser({ ...user, is_premium: true, verified: true });
      setShowPremium(false);
      showToast("Compte Pro activé ! Bienvenue dans l'élite. 🚀", "success");
    } catch (err) {
      showToast("Erreur d'activation", "error");
    }
  };

  // 4. CRUD LIENS
  const addLink = async () => {
    if (user.links.length >= 3 && !user.is_premium) {
      setShowPremium(true);
      return;
    }

    try {
      const position = user.links.length;
      const { data, error } = await supabase
        .from('links')
        .insert([{ user_id: user.id, title: 'Nouveau lien', url: 'https://', icon: 'globe', active: true, position }])
        .select().single();

      if (error) throw error;
      onUpdateUser({ ...user, links: [...user.links, data] });
      showToast("Lien créé", "success");
    } catch (err) {
      showToast("Erreur création", "error");
    }
  };

  const updateLink = async (id: string, updates: Partial<LinkItem>) => {
    try {
      const { error } = await supabase.from('links').update(updates).eq('id', id);
      if (error) throw error;
      const updatedLinks = user.links.map(l => l.id === id ? { ...l, ...updates } : l);
      onUpdateUser({ ...user, links: updatedLinks });
    } catch (err) {
      showToast("Echec de sauvegarde", "error");
    }
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    const newLinks = [...user.links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const currentItem = newLinks[index];
    const targetItem = newLinks[targetIndex];

    // Mise à jour locale immédiate (Optimistic UI)
    newLinks[index] = { ...targetItem, position: index };
    newLinks[targetIndex] = { ...currentItem, position: targetIndex };
    onUpdateUser({ ...user, links: newLinks });

    // Sync DB
    await Promise.all([
      supabase.from('links').update({ position: index }).eq('id', targetItem.id),
      supabase.from('links').update({ position: targetIndex }).eq('id', currentItem.id)
    ]);
  };

  const removeLink = async (id: string) => {
    try {
      const { error } = await supabase.from('links').delete().eq('id', id);
      if (error) throw error;
      onUpdateUser({ ...user, links: user.links.filter(l => l.id !== id) });
      showToast("Lien supprimé", "info");
    } catch (err) {
      showToast("Action impossible", "error");
    }
  };

  const handleThemeChange = async (theme: Theme) => {
    if (theme.isPremium && !user.is_premium) {
      setShowPremium(true);
      return;
    }
    try {
      const { error } = await supabase.from('users').update({ theme_id: theme.id }).eq('id', user.id);
      if (error) throw error;
      onUpdateUser({ ...user, themeId: theme.id as any });
      showToast(`Style ${theme.name} appliqué`, "success");
    } catch (err) {
      showToast("Erreur thème", "error");
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-20 md:w-24 bg-[#0B1D3A]/50 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-8 space-y-8 z-20">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 transition-transform hover:scale-110">
          <span className="font-black text-white text-xl">B</span>
        </div>
        
        <NavBtn active={activeTab === 'links'} onClick={() => setActiveTab('links')} icon={<LinkIcon size={22}/>} label="Liens" />
        <NavBtn active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} icon={<Layout size={22}/>} label="Design" />
        <NavBtn active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart2 size={22}/>} label="Stats" />
        <NavBtn active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={22}/>} label="Profil" />

        <div className="mt-auto pb-4">
           <button 
             onClick={onLogout} 
             className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all" 
             title="Se déconnecter"
             aria-label="Se déconnecter"
           >
             <LogOut size={22} />
           </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-10 relative z-10">
        <header className="max-w-4xl mx-auto flex justify-between items-center mb-12 animate-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter capitalize flex items-center gap-3">
              {activeTab}
              {user.is_premium && (
                <div className="flex items-center gap-1 bg-indigo-500/20 text-indigo-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                  <Star size={8} fill="currentColor" /> Pro
                </div>
              )}
            </h1>
            <p className="text-slate-400 text-sm font-medium">BioLink.cd • Dashboard</p>
          </div>
          
          <button 
            onClick={() => window.open(`/#/u/${user.username}`, '_blank')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-xs font-black uppercase tracking-widest shadow-xl"
            title="Aperçu public"
          >
            Ma Page <ExternalLink size={14} className="text-indigo-400" />
          </button>
        </header>

        <div className="max-w-4xl mx-auto pb-20">
          
          {/* TAB: LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button 
                onClick={addLink}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-[0.98]"
              >
                <Plus size={20}/> Ajouter un nouveau lien
                {!user.is_premium && (
                    <div className="px-3 py-1 bg-black/20 rounded-full text-[10px]">
                        {user.links.length}/3 liens gratuits
                    </div>
                )}
              </button>

              <div className="space-y-3">
                {isLoadingLinks ? (
                  [1,2].map(i => <div key={i} className="h-24 bg-white/5 rounded-[24px] animate-pulse border border-white/5" />)
                ) : (
                  user.links.length === 0 ? (
                    <div className="py-20 text-center space-y-4 bg-white/[0.02] rounded-[32px] border border-dashed border-white/5">
                        <p className="text-slate-500 font-medium tracking-tight">Votre page est vide. Ajoutez votre premier lien !</p>
                    </div>
                  ) : (
                    user.links.map((link, i) => (
                        <div key={link.id} className="group bg-[#152C52]/30 backdrop-blur-md border border-white/5 p-5 md:p-6 rounded-[24px] flex items-center gap-5 transition-all hover:border-indigo-500/40 shadow-xl">
                          <div className="flex flex-col gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => moveLink(i, 'up')} className="hover:text-indigo-400 p-1" title="Monter"><ArrowUp size={16}/></button>
                             <button onClick={() => moveLink(i, 'down')} className="hover:text-indigo-400 p-1" title="Descendre"><ArrowDown size={16}/></button>
                          </div>
                          <div className="flex-1 space-y-2">
                            <input className="bg-transparent border-none p-0 font-bold text-white w-full focus:ring-0 text-lg placeholder:text-white/10" value={link.title} onChange={(e) => updateLink(link.id, { title: e.target.value })} aria-label="Titre" placeholder="Titre du lien" />
                            <input className="bg-transparent border-none p-0 text-slate-400 w-full focus:ring-0 text-xs font-mono placeholder:text-white/5" value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} aria-label="URL" placeholder="https://..." />
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => removeLink(link.id)} className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all" aria-label="Supprimer" title="Supprimer"><Trash2 size={20}/></button>
                          </div>
                        </div>
                      ))
                  )
                )}
              </div>
            </div>
          )}

          {/* TAB: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
              {THEMES.map(theme => (
                <button 
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  aria-label={`Thème ${theme.name}`}
                  title={theme.name}
                  className={`relative group rounded-[32px] p-1.5 border-2 transition-all ${user.themeId === theme.id ? 'border-indigo-500 scale-105 shadow-2xl' : 'border-transparent hover:border-white/10 hover:scale-102'}`}
                >
                  <div className={`h-48 rounded-[24px] ${theme.bgClass} flex flex-col items-center justify-center p-6 overflow-hidden relative shadow-inner`}>
                     <div className={`w-full h-3 rounded-full mb-3 opacity-50 ${theme.buttonClass}`} />
                     <div className={`w-3/4 h-3 rounded-full mb-3 opacity-30 ${theme.buttonClass}`} />
                     {theme.isPremium && !user.is_premium && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                         <div className="p-3 bg-black/60 rounded-2xl shadow-2xl text-amber-400">
                           <Lock size={20} />
                         </div>
                       </div>
                     )}
                  </div>
                  <div className="mt-4 px-2 flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{theme.name}</p>
                    {theme.isPremium && <Star size={10} className="text-amber-500 fill-amber-500" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="grid grid-cols-3 gap-4 md:gap-6">
                 <StatCard label="Vues" value={user.views || 0} color="text-indigo-400" />
                 <StatCard label="Clics" value={user.links.reduce((a,b) => a + (b.clicks || 0), 0)} color="text-purple-400" />
                 <StatCard label="Taux" value={user.views > 0 ? `${((user.links.reduce((a,b) => a + (b.clicks || 0), 0) / user.views) * 100).toFixed(1)}%` : '0%'} color="text-emerald-400" />
              </div>
              <div className="bg-[#0B1D3A]/30 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] shadow-2xl">
                {isStatsLoading ? (
                    <div className="h-64 flex items-center justify-center text-indigo-500"><Loader2 className="animate-spin" /></div>
                ) : (
                    analyticsData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-widest">Aucune donnée cette semaine</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={analyticsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                                <Area type="monotone" dataKey="views" stroke="#6366F1" fill="rgba(99, 102, 241, 0.1)" strokeWidth={3} />
                                <Area type="monotone" dataKey="clicks" stroke="#A855F7" fill="none" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )
                )}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-md space-y-8 animate-in slide-in-from-left-4 duration-300">
               <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 shadow-2xl text-center group">
                 <h3 className="text-xl font-black text-white mb-4 flex items-center justify-center gap-3">
                    <QrCode size={22} className="text-indigo-400" /> Partager mon profil
                 </h3>
                 <p className="text-sm text-slate-500 mb-8 font-medium">Votre QR Code unique pour vos supports physiques.</p>
                 <button onClick={() => setShowQR(true)} className="w-full py-4 bg-white text-black rounded-[20px] font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95">
                   Générer le QR Code
                 </button>
               </div>
               <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 text-center flex flex-col items-center gap-4">
                   <CheckCircle2 size={24} className="text-indigo-500" />
                   <Link to="/about" className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:underline decoration-2 underline-offset-8">A propos de BioLink.cd</Link>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <QRCodeModal url={`${window.location.origin}/#/u/${user.username}`} isOpen={showQR} onClose={() => setShowQR(false)} />
      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} onSuccess={handlePaymentSuccess} />

      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---
const NavBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} title={label} aria-label={label} className={`flex flex-col items-center gap-2 transition-all group ${active ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={`p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-indigo-500/15 shadow-inner' : 'group-hover:bg-white/5'}`}>
      {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);

const StatCard = ({ label, value, color }: any) => (
  <div className="bg-[#0B1D3A]/30 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] text-center shadow-xl hover:border-white/10 transition-colors">
    <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black mb-2">{label}</p>
    <p className={`text-2xl font-black ${color} tracking-tighter`}>{value}</p>
  </div>
);

export default Dashboard;