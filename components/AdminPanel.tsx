// components/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNotify } from './ToastContext';
import { 
  Users, CheckCircle, XCircle, ShieldCheck, 
  Trash2, Search, Star, Clock, Eye, MessageSquare, 
  Send, X, BarChart3, Filter, Copy, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type AdminFilter = 'all' | 'pending' | 'pro';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdminFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [msgContent, setMsgContent] = useState('');
  const { showToast } = useNotify();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // On récupère les utilisateurs et on compte leurs liens
    const { data, error } = await supabase
      .from('users')
      .select('*, links(count)')
      .order('created_at', { ascending: false });
      
    if (!error) setUsers(data);
    setLoading(false);
  };

  const togglePro = async (user: any) => {
    const newStatus = !user.is_premium;
    const { error } = await supabase
      .from('users')
      .update({ 
        is_premium: newStatus, 
        verified: newStatus,
        payment_status: newStatus ? 'active' : 'none' 
      })
      .eq('id', user.id);

    if (!error) {
      // Notification automatique à l'utilisateur
      await supabase.from('admin_messages').insert([{ 
        user_id: user.id, 
        content: newStatus ? "Votre compte PRO a été activé ! Profitez de vos avantages. ✨" : "Votre abonnement PRO a expiré.",
        type: newStatus ? 'success' : 'info'
      }]);
      
      showToast(`Statut de @${user.username} mis à jour`);
      fetchUsers();
    }
  };

  const sendAdminMessage = async () => {
    if (!msgContent.trim()) return;
    const { error } = await supabase.from('admin_messages').insert([{ 
        user_id: selectedUser.id, 
        content: msgContent, 
        type: 'info' 
    }]);
    
    if (!error) {
        showToast("Message envoyé avec succès");
        setMsgContent('');
        setSelectedUser(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (window.confirm("🚨 ATTENTION : Supprimer définitivement cet utilisateur et tous ses liens ?")) {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (!error) {
        showToast("Compte supprimé");
        fetchUsers();
      }
    }
  };

  // Logique de filtrage
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.payment_ref?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = filter === 'all' ? true : 
                       filter === 'pending' ? u.payment_status === 'pending' :
                       u.is_premium === true;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-10 pb-32">
      
      {/* HEADER STRATÉGIQUE */}
      <header className="max-w-7xl mx-auto mb-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                    <ShieldCheck className="text-indigo-500" size={40} /> HQ OVERCOME
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] mt-2">Console d'administration BioLink RDC</p>
            </div>
            
            <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                <FilterTab active={filter === 'all'} label="Tous" count={users.length} onClick={() => setFilter('all')} />
                <FilterTab active={filter === 'pending'} label="En attente" count={users.filter(u => u.payment_status === 'pending').length} onClick={() => setFilter('pending')} color="text-amber-400" />
                <FilterTab active={filter === 'pro'} label="Pro" count={users.filter(u => u.is_premium).length} onClick={() => setFilter('pro')} color="text-indigo-400" />
            </div>
        </div>

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AdminStatCard label="Inscrits" value={users.length} icon={<Users />} color="text-blue-400" />
          <AdminStatCard label="Revenu Est." value={`${users.filter(u => u.is_premium).length * 5000} FC`} icon={<TrendingUp />} color="text-emerald-400" />
          <AdminStatCard label="Conversion" value={`${((users.filter(u => u.is_premium).length / (users.length || 1)) * 100).toFixed(1)}%`} icon={<Star />} color="text-indigo-400" />
          <AdminStatCard label="Alertes" value={users.filter(u => u.payment_status === 'pending').length} icon={<Clock />} color="text-amber-400" />
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un pseudo ou une référence SMS..." 
            className="w-full bg-white/5 border border-white/10 p-6 pl-16 rounded-[32px] outline-none focus:border-indigo-500/50 transition-all text-lg font-medium shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* TABLEAU DES UTILISATEURS */}
      <main className="max-w-7xl mx-auto">
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                  <th className="p-8">Utilisateur</th>
                  <th className="p-8">Statut & Paiement</th>
                  <th className="p-8 text-right">Actions de Commande</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                    <tr><td colSpan={3} className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest">Aucun résultat trouvé</td></tr>
                ) : (
                    filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group">
                        <td className="p-8">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.username}&background=random`} className="w-14 h-14 rounded-[20px] object-cover border-2 border-white/5" alt="" />
                                {u.is_premium && <div className="absolute -top-2 -right-2 bg-indigo-500 rounded-full p-1 border-2 border-[#020617]"><Star size={10} fill="white" /></div>}
                            </div>
                            <div>
                                <p className="font-black text-white text-lg tracking-tighter uppercase">@{u.username}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Inscrit le {new Date(u.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        </td>
                        <td className="p-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                {u.is_premium ? 
                                <span className="text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 tracking-tighter">ABONNÉ PRO</span> :
                                <span className="text-[10px] font-black bg-slate-500/10 text-slate-500 px-3 py-1 rounded-full border border-slate-500/20 tracking-tighter">GRATUIT</span>
                                }
                                <span className="text-[10px] font-bold text-slate-600 uppercase italic">{u.views || 0} vues</span>
                            </div>
                            {u.payment_ref && (
                            <div className="flex items-center gap-3">
                                <code className="bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg text-xs font-mono border border-amber-500/20">
                                    REF: {u.payment_ref}
                                </code>
                                <button 
                                    onClick={() => { navigator.clipboard.writeText(u.payment_ref); showToast("Référence copiée !"); }}
                                    className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                                    title="Copier la référence"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                            )}
                        </div>
                        </td>
                        <td className="p-8">
                        <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            <ActionBtn onClick={() => togglePro(u)} icon={u.is_premium ? <XCircle size={20}/> : <ShieldCheck size={20}/>} color={u.is_premium ? "text-red-400" : "text-emerald-400"} label={u.is_premium ? "Rétrograder" : "Valider Paiement"} />
                            <ActionBtn onClick={() => setSelectedUser(u)} icon={<MessageSquare size={20}/>} color="text-blue-400" label="Envoyer Message" />
                            <ActionBtn onClick={() => window.open(`/#/u/${u.username}`, '_blank')} icon={<Eye size={20}/>} color="text-white" label="Voir Profil" />
                            <ActionBtn onClick={() => deleteUser(u.id)} icon={<Trash2 size={20}/>} color="text-red-600" label="Supprimer" />
                        </div>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL DE MESSAGERIE HQ */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-[#0B1D3A] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-indigo-500" />
              <button onClick={() => setSelectedUser(null)} aria-label="Fermer" title="Fermer" className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
              
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white tracking-tighter">Message à @{selectedUser.username}</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Le message apparaîtra sur son Dashboard.</p>
              </div>

              <textarea 
                className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white outline-none focus:border-indigo-500 h-40 mb-8 resize-none transition-all placeholder:text-slate-700"
                placeholder="Ex: Votre référence M-Pesa est incorrecte. Veuillez nous recontacter..."
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
              />
              
              <button 
                onClick={sendAdminMessage}
                disabled={!msgContent.trim()}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-black rounded-[24px] flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                <Send size={20}/> Envoyer au client
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const FilterTab = ({ active, label, count, onClick, color = "text-white" }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${active ? 'bg-white/10 shadow-lg ' + color : 'text-slate-500 hover:text-slate-300'}`}
  >
    {label} <span className="opacity-40 text-[10px]">{count}</span>
  </button>
);

const AdminStatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] flex items-center justify-between shadow-xl group hover:border-white/10 transition-colors">
    <div>
      <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] mb-2">{label}</p>
      <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
    <div className={`p-4 bg-white/5 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

const ActionBtn = ({ onClick, icon, color, label }: any) => (
  <button 
    onClick={onClick} 
    title={label} 
    className={`p-3 rounded-2xl bg-white/5 ${color} hover:bg-white/10 transition-all active:scale-90 border border-transparent hover:border-white/5`}
  >
    {icon}
  </button>
);

export default AdminPanel;