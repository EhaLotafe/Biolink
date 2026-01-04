// components/Login.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotify } from "./ToastContext"; 
import { supabase } from "../supabaseClient";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome } from "lucide-react";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useNotify(); 
  const navigate = useNavigate();

  // SEO & UX : Titre de l'onglet
  useEffect(() => {
    document.title = "Connexion | BioLink.cd";
  }, []);

  const normalizeError = (msg: string) => {
    if (msg.includes("Invalid login credentials")) return "Email ou mot de passe incorrect. Vérifiez vos accès.";
    if (msg.includes("Email not confirmed")) return "Veuillez confirmer votre email avant de continuer.";
    if (msg.includes("fetch")) return "Problème de connexion. Vérifiez vos mégas (data) ! 📶";
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      showToast("Veuillez remplir tous les champs.", "warning");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      
      if (error) {
        showToast(normalizeError(error.message), "error");
        return;
      }

      showToast("Heureux de vous revoir ! 👋", "success");
      onLogin(); 
    } catch (err) {
      showToast("Une erreur inattendue est survenue.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0B1D3A]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <Link to="/" className="group mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
              <span className="font-black text-white text-2xl">B</span>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            BioLink<span className="text-indigo-500">.cd</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium tracking-tight text-center">Accédez à votre console d'administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email professionnel</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Mot de passe</label>
              {/* CORRECTION : Suppression de name="forgot-password" qui causait l'erreur */}
              <Link 
                to="/reset-password" 
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest"
              >
                Oublié ?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Se connecter
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Ou</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        {/* Social */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-2xl hover:bg-slate-100 transition-all shadow-lg active:scale-[0.98]"
        >
          <Chrome size={20} />
          Continuer avec Google
        </button>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Pas encore de compte ?{" "}
            <Link 
                to="/register" 
                className="text-white hover:text-indigo-400 font-bold transition-colors underline underline-offset-8 decoration-indigo-500/30 hover:decoration-indigo-500"
            >
              Créer un profil gratuit
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;