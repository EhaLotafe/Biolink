// components/Register.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useNotify } from "./ToastContext"; // On utilise le context global
import { Eye, EyeOff, User, AtSign, Mail, Lock, Check, X, Loader2, ArrowRight, Chrome, Facebook } from "lucide-react";
import { motion } from "framer-motion";

export interface RegisterProps {
  onLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useNotify();
  const navigate = useNavigate();

  // SEO : Titre de l'onglet
  useEffect(() => {
    document.title = "Créer un compte | BioLink.cd";
  }, []);

  // 1. Calcul de la force du mot de passe (Visuel)
  useEffect(() => {
    const pwd = formData.password;
    let strength = 0;
    if (pwd.length >= 6) strength += 20;
    if (pwd.length >= 10) strength += 20;
    if (/[A-Z]/.test(pwd)) strength += 20;
    if (/[0-9]/.test(pwd)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 20;
    setPasswordStrength(strength);
  }, [formData.password]);

  // 2. Vérification en temps réel de la disponibilité du pseudo
  useEffect(() => {
    const check = async () => {
      const u = formData.username.trim().toLowerCase();
      if (u.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      setCheckingUsername(true);
      // On vérifie dans la table 'users' que nous avons créée ensemble
      const { data } = await supabase.from("users").select("id").eq("username", u).maybeSingle();
      setUsernameAvailable(!data);
      setCheckingUsername(false);
    };
    const t = setTimeout(check, 600);
    return () => clearTimeout(t);
  }, [formData.username]);

  const validateForm = () => {
    const temp: Record<string, string> = {};
    if (!formData.name.trim()) temp.name = "Le nom est requis.";
    if (!/^[a-z0-9_-]{3,20}$/.test(formData.username.toLowerCase())) temp.username = "Pseudo invalide (lettres, chiffres, _ ou -).";
    if (usernameAvailable === false) temp.username = "Ce pseudo est déjà pris.";
    if (!formData.email.includes("@")) temp.email = "Email non valide.";
    if (formData.password.length < 6) temp.password = "Minimum 6 caractères.";
    if (formData.password !== formData.confirmPassword) temp.confirmPassword = "Les mots de passe ne correspondent pas.";
    
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Veuillez corriger les erreurs dans le formulaire.", "warning");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            display_name: formData.name, // Sera utilisé par le trigger SQL
            username: formData.username.trim().toLowerCase(), // Sera utilisé par le trigger SQL
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Cas 1: Confirmation email requise
        if (data.session === null) {
          showToast("Inscription réussie ! Vérifiez vos emails pour activer votre compte.", "success");
          navigate("/login");
        } else {
          // Cas 2: Connexion automatique
          showToast("Bienvenue sur BioLink.cd ! ✨", "success");
          onLogin();
        }
      }
    } catch (err: any) {
      showToast(err.message || "Impossible de créer le compte.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` }
      });
      if (error) throw error;
    } catch (err: any) {
      showToast(`Erreur ${provider}: ${err.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-[#0B1D3A]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative z-10 my-10"
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group hover:scale-110 transition-transform">
              <span className="font-black text-white text-2xl font-sans">B</span>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tighter">BioLink<span className="text-indigo-500">.cd</span></h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Rejoignez le n°1 du Link-in-Bio en RDC</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nom Complet */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Votre Nom</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Ex: Patient Bashombe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} text-white outline-none focus:border-indigo-500/50 transition-all`}
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Lien personnalisé</label>
            <div className="relative group">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="pseudo"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                className={`w-full pl-12 pr-10 py-4 rounded-2xl bg-white/5 border ${errors.username ? 'border-red-500/50' : 'border-white/10'} text-white outline-none focus:border-indigo-500/50 transition-all font-bold`}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {checkingUsername ? <Loader2 size={16} className="text-indigo-400 animate-spin" /> : 
                 usernameAvailable === true ? <Check size={16} className="text-emerald-400" /> :
                 usernameAvailable === false ? <X size={16} className="text-red-400" /> : null}
              </div>
            </div>
            {errors.username && <p className="text-[10px] text-red-400 ml-1 font-medium">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="contact@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} text-white outline-none focus:border-indigo-500/50 transition-all`}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-12 pr-10 py-4 rounded-2xl bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} text-white outline-none focus:border-indigo-500/50 transition-all`}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Barre de force animée */}
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${passwordStrength}%` }}
                className={`h-full ${passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Confirmer</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-12 pr-10 py-4 rounded-2xl bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} text-white outline-none focus:border-indigo-500/50 transition-all`}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Créer mon compte <ArrowRight size={20} /></>}
          </button>
        </form>

        <div className="flex items-center gap-4 my-10">
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Ou</span>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleSocialLogin("google")} className="flex items-center justify-center gap-3 bg-white text-black font-black p-4 rounded-2xl text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95">
            <Chrome size={18} /> Google
          </button>
          <button onClick={() => handleSocialLogin("facebook")} className="flex items-center justify-center gap-3 bg-[#1877F2] text-white font-black p-4 rounded-2xl text-sm hover:bg-[#1877F2]/90 transition-all shadow-lg active:scale-95">
            <Facebook size={18} /> Facebook
          </button>
        </div>

        <p className="mt-12 text-center text-sm text-slate-500 font-medium tracking-tight">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-white hover:text-indigo-400 font-bold transition-colors underline underline-offset-8 decoration-indigo-500/30">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;