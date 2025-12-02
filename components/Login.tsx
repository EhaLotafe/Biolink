// components/Login.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toast } from "./Toast";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const normalizeError = (msg: string) => {
    if (msg.includes("Invalid login credentials")) return "Email ou mot de passe incorrect.";
    if (msg.includes("Email not confirmed")) return "Veuillez confirmer votre adresse email avant de vous connecter.";
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToast({ message: "Veuillez remplir tous les champs.", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        setToast({ message: normalizeError(error.message), type: "error" });
        return;
      }

      setToast({ message: "Connexion réussie !", type: "success" });
      onLogin();
    } catch (err) {
      console.error("Erreur inattendue :", err);
      setToast({ message: "Une erreur inattendue est survenue.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050C19] to-[#0B1D3A] flex items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md md:max-w-lg bg-[#0B1D3A]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
        <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">Bienvenue</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              className="w-full px-4 py-3 rounded-xl bg-[#152C52] text-white border border-white/10 focus:ring-2 focus:ring-cosmic-500 outline-none disabled:opacity-50"
              disabled={loading}
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <label className="block text-sm text-gray-400 mb-1">Mot de passe</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#152C52] text-white border border-white/10 focus:ring-2 focus:ring-cosmic-500 outline-none disabled:opacity-50"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Bouton login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cosmic-600 to-nebula-600 text-white font-semibold py-3.5 rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Liens auxiliaires */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-cosmic-400 hover:text-cosmic-300 font-medium">
            Créer un compte
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-gray-400">
          <Link to="/reset-password" className="hover:text-cosmic-300 font-medium">
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
