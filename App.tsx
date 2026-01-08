// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
import LegalPages from './components/LegalPages';
import { useNotify } from './components/ToastContext';
import AdminPanel from './components/AdminPanel';


function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotify();
  const ADMIN_ID = "9087064c-864c-41cf-b6ad-ec9aa08a1cb8";

  // Stabilisation de la fonction de récupération du profil
  const fetchUserProfile = useCallback(async (userId: string) => {
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
  }, []);

  useEffect(() => {
    // 1. Vérifier la session actuelle au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
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
  }, [fetchUserProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("À bientôt !", "info");
  };

  // Splash Screen initial (chargement de l'application)
  if (loading && !session) {
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

  // App.tsx

// ... reste du code identique

return (
  <Router>
    <Routes>      
      {/* Route Admin (Seulement pour toi) */}
      <Route 
        path="/admin-overcome" 
        element={
          session?.user.id === ADMIN_ID ? <AdminPanel /> : <Navigate to="/" />
        } 
      />

      {/* Routes Publiques */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<LegalPages />} />
      <Route path="/privacy" element={<LegalPages />} />
      <Route path="/u/:username" element={<PublicProfileLoader />} />

      {/* 
          MODIFICATION ICI : 
          Si session + user existent, on redirige selon l'ID 
      */}
      <Route
        path="/login"
        element={
          session && user ? (
            <Navigate to={session.user.id === ADMIN_ID ? "/admin-overcome" : "/dashboard"} replace />
          ) : (
            <Login onLogin={() => {}} />
          )
        }
      />

      <Route
        path="/register"
        element={
          session && user ? (
            <Navigate to={session.user.id === ADMIN_ID ? "/admin-overcome" : "/dashboard"} replace />
          ) : (
            <Register onLogin={() => {}} />
          )
        }
      />

      {/* Dashboard Protégé */}
      <Route
        path="/dashboard"
        element={
          session ? (
            user ? (
              <Dashboard
                user={user}
                onUpdateUser={(u) => setUser(u)}
                onLogout={handleLogout}
              />
            ) : (
              <div className="h-screen w-full bg-[#030712] flex items-center justify-center">
                 <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);
}

/**
 * Chargeur dynamique pour les profils publics (/u/username)
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