// lib/error-handler.ts
export const handleSupabaseError = (error: any): string => {
  console.error("Technical Error:", error);

  const messages: Record<string, string> = {
    "23505": "Ce nom d'utilisateur est déjà pris. Soyez original ! 😊",
    "42501": "Vous n'avez pas la permission de faire ça.",
    "network_error": "Problème de connexion. Vérifiez vos mégas (data) ! 📶",
    "invalid_credentials": "Email ou mot de passe incorrect.",
    "User already registered": "Cet email est déjà utilisé.",
  };

  if (error.message?.includes("fetch")) return messages["network_error"];
  
  return messages[error.code] || messages[error.message] || "Oups ! Quelque chose s'est mal passé. Réessayez.";
};