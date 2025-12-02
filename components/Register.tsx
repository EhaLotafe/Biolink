import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Toast } from "./Toast";
import { Eye, EyeOff } from "lucide-react";

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

  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState<"faible" | "moyen" | "fort">("faible");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ------------------------------------------------------------
  // 🔍 Vérification force du mot de passe (live)
  // ------------------------------------------------------------
  useEffect(() => {
    const pwd = formData.password;

    if (pwd.length >= 10 && /[A-Z]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) {
      setPasswordStrength("fort");
    } else if (pwd.length >= 8) {
      setPasswordStrength("moyen");
    } else {
      setPasswordStrength("faible");
    }
  }, [formData.password]);

  // ------------------------------------------------------------
  // 🔎 Vérification live du username (unique)
  // ------------------------------------------------------------
  useEffect(() => {
    const check = async () => {
      const u = formData.username.trim().toLowerCase();
      if (!u || u.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      setCheckingUsername(true);

      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("username", u)
        .maybeSingle();

      setUsernameAvailable(!data);
      setCheckingUsername(false);
    };

    const t = setTimeout(check, 400);
    return () => clearTimeout(t);
  }, [formData.username]);

  // ------------------------------------------------------------
  // 🧪 Validation locale
  // ------------------------------------------------------------
  const validate = () => {
    const temp = { name: "", username: "", email: "", password: "", confirmPassword: "" };
    let ok = true;

    if (!formData.name.trim()) { temp.name = "Nom requis"; ok = false; }

    if (!formData.username.trim()) { temp.username = "Identifiant requis"; ok = false; }
    else if (!/^[a-zA-Z0-9._-]{3,20}$/.test(formData.username)) {
      temp.username = "Format invalide (3-20 caractères, lettres/chiffres)";
      ok = false;
    } else if (usernameAvailable === false) {
      temp.username = "Identifiant déjà pris";
      ok = false;
    }

    if (!formData.email.trim()) { temp.email = "Email requis"; ok = false; }

    if (formData.password.length < 6) { temp.password = "6 caractères minimum"; ok = false; }

    if (formData.password !== formData.confirmPassword) {
      temp.confirmPassword = "Les mots de passe ne correspondent pas";
      ok = false;
    }

    setErrors(temp);
    return ok;
  };

  // ------------------------------------------------------------
  // 🚀 Submit
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            username: formData.username.trim().toLowerCase(),
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message.includes("48 seconds")) {
          throw new Error("Veuillez patienter avant une nouvelle tentative.");
        }
        throw error;
      }

      if (!data.user) throw new Error("Inscription impossible.");

      onLogin();
      setToast({
        message:
          "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
        type: "success",
      });

    } catch (err: any) {
      console.error(err);
      setToast({ message: err.message || "Erreur inattendue.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🌐 Social login
  // ------------------------------------------------------------
  const socialLogin = async (provider: "google" | "facebook") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setToast({ message: err.message || "Erreur OAuth.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050C19] to-[#0B1D3A] flex items-center justify-center p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-md bg-[#0B1D3A]/50 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Nom */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Nom complet</label>
            <input
              type="text"
              placeholder="Ex: Jean Dupont"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-3 rounded-2xl bg-[#152C52] text-white border border-white/20 focus:ring-2"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Identifiant public (biolink)</label>
            <input
              type="text"
              placeholder="ex: myrage_off"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-5 py-3 rounded-2xl bg-[#152C52] text-white border border-white/20 focus:ring-2"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}

            {checkingUsername && <p className="text-yellow-400 text-xs mt-1">Vérification...</p>}
            {usernameAvailable === true && <p className="text-green-400 text-xs mt-1">Disponible ✔</p>}
            {usernameAvailable === false && <p className="text-red-400 text-xs mt-1">Déjà pris ✖</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Email</label>
            <input
              type="email"
              placeholder="ex: exemple@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-3 rounded-2xl bg-[#152C52] text-white border"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-300 mb-2 block">Mot de passe</label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-5 py-3 rounded-2xl bg-[#152C52] text-white border"
            />

            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            <div className="mt-1 text-xs">
              Force :{" "}
              <span className={
                passwordStrength === "faible" ? "text-red-400" :
                passwordStrength === "moyen" ? "text-yellow-400" :
                "text-green-400"
              }>
                {passwordStrength}
              </span>
            </div>

            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="text-sm text-gray-300 mb-2 block">Confirmer</label>

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-5 py-3 rounded-2xl bg-[#152C52] text-white border"
            />

            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-300 hover:text-white">
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cosmic-600 to-nebula-600 text-white font-semibold py-3.5 rounded-2xl hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer un compte"}
          </button>
        </form>

        {/* Social logins */}
        <div className="mt-6 flex flex-col gap-3">
          <button onClick={() => socialLogin("google")} className="w-full py-3 rounded-2xl bg-white text-black font-semibold hover:bg-gray-100">
            Continuer avec Google
          </button>
          <button onClick={() => socialLogin("facebook")} className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Continuer avec Facebook
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-cosmic-400 hover:text-cosmic-300 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
