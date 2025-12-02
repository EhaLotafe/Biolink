// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { UserProfile, LinkItem } from '../types';
import { THEMES, MOCK_ANALYTICS, MOCK_DEVICE_DATA } from '../constants';
import QRCodeModal from './QRCodeModal';
import { Toast } from './Toast';
import { 
  Layout, 
  Link as LinkIcon, 
  BarChart2, 
  Settings, 
  Plus, 
  Trash2, 
  QrCode,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [usernameInput, setUsernameInput] = useState(user.username || '');
  const [usernameError, setUsernameError] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  useEffect(() => setUsernameInput(user.username || ''), [user.username]);

  useEffect(() => {
    // Charge les liens depuis Supabase
    const fetchLinks = async () => {
      setIsLoadingLinks(true);
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });
      if (error) {
        showToast('Erreur lors du chargement des liens', 'error');
      } else if (data) {
        onUpdateUser({ ...user, links: data });
      }
      setIsLoadingLinks(false);
    };
    fetchLinks();
  }, [user.id]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ message, type });

  // ================== LINKS ==================
  const updateLink = async (id: string, field: keyof LinkItem, value: any) => {
    const newLinks = user.links.map(l => l.id === id ? { ...l, [field]: value } : l);
    onUpdateUser({ ...user, links: newLinks });
    const { error } = await supabase.from('links').update({ [field]: value }).eq('id', id);
    if (error) showToast("Erreur lors de la mise à jour du lien", "error");
  };

  const addLink = async () => {
    const position = user.links.length; // nouveau lien en fin
    const { data, error } = await supabase
      .from('links')
      .insert([{ user_id: user.id, title: 'Nouveau lien', url: 'https://', icon: 'globe', active: true, position }])
      .select()
      .single();

    if (error) { showToast("Erreur lors de l'ajout du lien", "error"); return; }

    onUpdateUser({ ...user, links: [...user.links, data] });
    showToast("Lien ajouté !");
  };

  const removeLink = async (id: string) => {
    const updatedLinks = user.links.filter(l => l.id !== id);
    onUpdateUser({ ...user, links: updatedLinks });
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (error) showToast("Erreur lors de la suppression du lien", "error");
    else showToast("Lien supprimé");

    // Réordonner les positions après suppression
    updatedLinks.forEach((l, i) => updateLink(l.id, 'position', i));
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    const newLinks = [...user.links];
    if (direction === 'up' && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
    } else if (direction === 'down' && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    onUpdateUser({ ...user, links: newLinks });

    // Sauvegarde les nouvelles positions
    newLinks.forEach((l, i) => updateLink(l.id, 'position', i));
  };

  // ================== PROFILE ==================
  const updateProfile = async (field: keyof UserProfile, value: any) => {
    onUpdateUser({ ...user, [field]: value });
    const dbField = field === 'themeId' ? 'theme_id' : field;
    const { error } = await supabase.from('users').update({ [dbField]: value }).eq('id', user.id);
    if (error) showToast("Erreur lors de la mise à jour du profil", "error");
    else showToast("Profil mis à jour !");
  };

  const handleUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
    if (usernameError) setUsernameError('');
  };

  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return setUsernameError("Le nom d'utilisateur est requis");
    if (usernameInput.length < 3) return setUsernameError("Minimum 3 caractères");
    if (usernameInput === user.username) return;

    setIsSavingUsername(true);

    const { data, error } = await supabase.from('users').select('id').eq('username', usernameInput);
    if (error) { setIsSavingUsername(false); return showToast("Erreur serveur", "error"); }
    if (data && data.length > 0) { setUsernameError("Ce nom d'utilisateur est indisponible"); setIsSavingUsername(false); return; }

    const { error: updateError } = await supabase.from('users').update({ username: usernameInput }).eq('id', user.id);
    if (updateError) { showToast("Erreur lors de la mise à jour", "error"); setIsSavingUsername(false); return; }

    onUpdateUser({ ...user, username: usernameInput });
    showToast("Nom d'utilisateur mis à jour !");
    setIsSavingUsername(false);
    setUsernameError('');
  };

  // ================== RENDER ==================
  return (
    <div className="flex h-screen bg-[#050C19] text-gray-100 overflow-hidden relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <aside className="w-20 bg-[#0B1D3A] flex flex-col items-center py-6 space-y-4">
        <button onClick={() => setActiveTab('links')} title="Liens" aria-label="Liens"><LinkIcon size={24} /></button>
        <button onClick={() => setActiveTab('appearance')} title="Apparence" aria-label="Apparence"><Layout size={24} /></button>
        <button onClick={() => setActiveTab('analytics')} title="Analytics" aria-label="Analytics"><BarChart2 size={24} /></button>
        <button onClick={() => setActiveTab('settings')} title="Paramètres" aria-label="Paramètres"><Settings size={24} /></button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {/* ===== LIENS ===== */}
        {activeTab === 'links' && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Mes liens</h2>
              <button onClick={addLink} className="flex items-center gap-1 px-3 py-1 bg-cosmic-500 rounded text-white hover:bg-[#6366F1] transition-all duration-200">
                <Plus size={16}/> Ajouter
              </button>
            </div>
            {isLoadingLinks ? (
              <p>Chargement des liens...</p>
            ) : (
              <div className="space-y-2">
                {user.links.map((link, i) => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-[#152C52aa] rounded-xl transition-all duration-200 hover:bg-[#152C52]/60 hover:scale-[1.02]">
                    <input
                      value={link.title}
                      onChange={e => updateLink(link.id, 'title', e.target.value)}
                      className="bg-transparent outline-none text-white w-full"
                      placeholder="Titre du lien"
                      aria-label="Titre du lien"
                    />
                    <div className="flex gap-2 items-center ml-2">
                      <button onClick={() => moveLink(i, 'up')} title="Déplacer vers le haut" aria-label="Déplacer vers le haut"><ArrowUp size={16}/></button>
                      <button onClick={() => moveLink(i, 'down')} title="Déplacer vers le bas" aria-label="Déplacer vers le bas"><ArrowDown size={16}/></button>
                      <button onClick={() => removeLink(link.id)} title="Supprimer le lien" aria-label="Supprimer le lien"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== APPARENCE ===== */}
        {activeTab === 'appearance' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Apparence</h2>
            <div className="flex gap-4 flex-wrap">
              {THEMES.map(t => (
                <div
                  key={t.id}
                  className={`w-16 h-16 rounded-full cursor-pointer border-4 ${user.themeId === t.id ? 'border-cosmic-500' : 'border-transparent'} transition-all duration-200 hover:scale-[1.05]`}
                  style={{ backgroundColor: t.bgClass.replace('bg-', '') }}
                  onClick={() => updateProfile('themeId', t.id)}
                  title={t.name}
                  aria-label={`Sélectionner thème ${t.name}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===== ANALYTICS ===== */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#152C52aa] p-4 rounded-xl">
                <h3 className="font-bold mb-2">Clics par lien</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={MOCK_ANALYTICS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={{ background: '#0B1D3A', border: 'none', color: '#fff' }} />
                    <Area type="monotone" dataKey="clicks" stroke="#4F46E5" fill="#6366F1" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#152C52aa] p-4 rounded-xl">
                <h3 className="font-bold mb-2">Distribution des devices</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={MOCK_DEVICE_DATA} dataKey="value" nameKey="name" outerRadius={80}>
                      {MOCK_DEVICE_DATA.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ===== SETTINGS ===== */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Paramètres</h2>
            <div className="flex flex-col gap-4 max-w-md">
              <label className="flex flex-col gap-1">
                Nom d'utilisateur
                <input
                  type="text"
                  value={usernameInput}
                  onChange={handleUsernameInputChange}
                  className="bg-[#152C52aa] p-2 rounded text-white outline-none"
                  placeholder="Entrez votre nom d'utilisateur"
                  aria-label="Nom d'utilisateur"
                />
                {usernameError && <span className="text-red-500 text-sm">{usernameError}</span>}
              </label>
              <button onClick={handleSaveUsername} className="px-4 py-2 bg-cosmic-500 rounded text-white w-max hover:bg-[#6366F1] transition-all duration-200">
                {isSavingUsername ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button onClick={() => setShowQR(true)} className="px-4 py-2 bg-cosmic-500 rounded text-white w-max flex items-center gap-2 hover:bg-[#6366F1] transition-all duration-200" title="Voir QR Code" aria-label="Voir QR Code">
                <QrCode size={16}/> Voir QR
              </button>
            </div>
          </div>
        )}
      </main>

      {showQR && (
        <QRCodeModal
          url={`${window.location.origin}/#/u/${user.username}`}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
