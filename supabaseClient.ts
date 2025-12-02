// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL (check .env)");
if (!supabaseAnonKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY (check .env)");

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,    // ✔️ nécessaire pour que l’utilisateur reste connecté
      autoRefreshToken: true,  // ✔️ rafraîchit automatiquement les tokens
      detectSessionInUrl: true // ✔️ obligatoire pour OAuth (Google/Facebook)
    }
  }
);
