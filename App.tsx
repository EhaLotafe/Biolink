// App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { UserProfile } from './types';

// Pages & Composants
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import PublicProfile from './components/PublicProfile';
import About from './components/About';
import LegalPages from './components/LegalPages'; // ✅ Import unique corrigé
import { useNotify } from './components/ToastContext';

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotify();

  useEffect(() => {
    // 1. Vérifier la session actuelle au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setLoading(false);
    });

    // 2. Écouter les changements d'auth (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*, links(*)')
        .eq('id', userId)
        .maybeSingle(); 

      if (error) throw error;

      if (!data) {
        console.warn("Profil absent de la table 'users'.");
        await supabase.auth.signOut();
        return;
      }

      setUser(data);
    } catch (err: any) {
      console.error("Erreur profil:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("À bientôt !", "info");
  };

  // Splash Screen 2026
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#030712] flex flex-col items-center justify-center">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin relative" />
        </div>
        <p className="mt-6 text-indigo-400 font-black tracking-[0.3em] text-[10px] uppercase animate-pulse">BioLink RDC</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        
        {/* ✅ Les deux routes pointent vers le composant unifié LegalPages */}
        <Route path="/terms" element={<LegalPages />} />
        <Route path="/privacy" element={<LegalPages />} />

        {/* Profil Public Dynamique */}
        <Route path="/u/:username" element={<PublicProfileLoader />} />

        {/* Routes Auth */}
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" /> : <Login onLogin={() => {}} />}
        />

        <Route
          path="/register"
          element={session ? <Navigate to="/dashboard" /> : <Register onLogin={() => {}} />}
        />

        {/* Dashboard Protégé */}
        <Route
          path="/dashboard"
          element={
            session && user ? (
              <Dashboard
                user={user}
                onUpdateUser={(u) => setUser(u)}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        {/* Redirection 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

/**
 * Loader pour les profils publics (/u/username)
 */
const PublicProfileLoader = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'notFound' | 'ready'>('loading');

  useEffect(() => {
    const loadProfile = async () => {
      setStatus('loading');
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*, links(*)')
          .eq('username', username)
          .maybeSingle();

        if (error || !data) {
          setStatus('notFound');
        } else {
          setProfile(data);
          setStatus('ready');
        }
      } catch (err) {
        setStatus('notFound');
      }
    };
    loadProfile();
  }, [username]);

  if (status === 'notFound') {
    return (
      <div className="h-screen bg-[#030712] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Profil introuvable</h2>
        <p className="text-slate-400 mb-8 max-w-xs">Ce BioLink n'existe pas ou l'identifiant est incorrect.</p>
        <Link to="/" className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95">
          Retour au site
        </Link>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return profile ? <PublicProfile user={profile} /> : null;
};

export default App;