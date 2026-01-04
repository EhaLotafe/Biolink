// components/LegalPages.tsx
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Gavel, 
  Lock, 
  Eye, 
  Scale, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';

/**
 * COMPOSANT UNIQUE : LegalPages
 * Gère dynamiquement les CGU et la Confidentialité
 */
const LegalPages: React.FC = () => {
  const location = useLocation();
  const isTerms = location.pathname === '/terms';

  // SEO : Mise à jour du titre selon la page
  useEffect(() => {
    document.title = isTerms 
      ? "Conditions Générales | BioLink RDC" 
      : "Confidentialité | BioLink RDC";
    window.scrollTo(0, 0);
  }, [isTerms]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Navbar Minimaliste Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">
              B
            </div>
            <span className="font-black text-lg tracking-tighter text-white">
              BioLink<span className="text-indigo-500">.cd</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Contenu Principal avec Animation */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {isTerms ? <TermsContent /> : <PrivacyContent />}
          
          {/* Footer Légal Contextuel */}
          <footer className="pt-16 border-t border-white/5 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Dernière mise à jour : 04 Janvier 2026
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Édité par Overcome Solution's • Kinshasa, RDC.
                </p>
              </div>
              
              <Link 
                to={isTerms ? "/privacy" : "/terms"}
                className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  {isTerms ? "Voir la Confidentialité" : "Voir les Conditions"}
                </span>
                <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-1 transition-transform text-indigo-400" />
              </Link>
            </div>
          </footer>
        </motion.div>
      </main>

      {/* Décor de fond */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

// --- CONTENU DES CONDITIONS (TERMS) ---
const TermsContent = () => (
  <div className="space-y-10">
    <header className="space-y-4">
      <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
        <Gavel size={32} />
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Conditions Générales</h1>
      <p className="text-slate-400 text-lg font-medium max-w-2xl">
        Contrat encadrant l'utilisation de BioLink RDC par les créateurs et entrepreneurs.
      </p>
    </header>

    <div className="grid gap-8">
      <LegalSection title="1. Cadre Juridique" icon={<Scale size={20}/>}>
        L'utilisation de la plateforme BioLink RDC, éditée par <strong>Overcome Solution's</strong>, est régie par les lois de la République Démocratique du Congo, notamment la Loi n° 20/017 relative aux télécommunications et aux TIC.
      </LegalSection>

      <LegalSection title="2. Services & Abonnements" icon={<Smartphone size={20}/>}>
        BioLink propose une offre gratuite (limitée à 3 liens) et une offre Pro. Les paiements Pro sont effectués via <strong>M-Pesa, Airtel Money ou Orange Money</strong>. Conformément aux usages numériques, tout abonnement activé est ferme et non remboursable.
      </LegalSection>

      <LegalSection title="3. Responsabilité du Créateur" icon={<ShieldCheck size={20}/>}>
        Vous êtes seul responsable du contenu (liens, images, textes) publié sur votre page. BioLink interdit strictement la promotion de produits illégaux, les discours de haine ou toute activité violant le Code Pénal Congolais.
      </LegalSection>

      <LegalSection title="4. Propriété Intellectuelle" icon={<CheckCircle2 size={20}/>}>
        L'interface, le design "BioLink" et le logo sont la propriété exclusive d'Overcome Solution's. Toute reproduction sans autorisation est passible de poursuites devant les tribunaux compétents de Kinshasa.
      </LegalSection>
    </div>
  </div>
);

// --- CONTENU DE LA CONFIDENTIALITÉ (PRIVACY) ---
const PrivacyContent = () => (
  <div className="space-y-10">
    <header className="space-y-4">
      <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
        <Lock size={32} />
      </div>
      <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Confidentialité</h1>
      <p className="text-slate-400 text-lg font-medium max-w-2xl">
        Comment nous protégeons vos données personnelles en République Démocratique du Congo.
      </p>
    </header>

    <div className="grid gap-8">
      <LegalSection title="1. Données Collectées" icon={<Eye size={20}/>}>
        Nous collectons uniquement les données strictement nécessaires : adresse email (authentification), nom d'affichage, et statistiques de performance (clics anonymisés). Nous ne collectons aucune donnée bancaire, les transactions étant gérées par les opérateurs mobiles.
      </LegalSection>

      <LegalSection title="2. Sécurité des Données" icon={<ShieldCheck size={20}/>}>
        Vos données sont hébergées sur des serveurs hautement sécurisés via Supabase. Nous appliquons un chiffrement de bout en bout pour garantir que vos informations restent privées et protégées contre toute intrusion.
      </LegalSection>

      <LegalSection title="3. Cookies et Tracking" icon={<CheckCircle2 size={20}/>}>
        BioLink utilise des cookies essentiels pour maintenir votre session active. Notre système d'analytics interne ne suit pas votre navigation en dehors de votre page BioLink.
      </LegalSection>

      <LegalSection title="4. Vos Droits" icon={<Scale size={20}/>}>
        Conformément à la protection de la vie privée, vous disposez d'un droit de modification et de suppression totale. En supprimant votre compte depuis le Dashboard, toutes vos données sont effacées de nos serveurs sous 30 jours.
      </LegalSection>
    </div>
  </div>
);

// Composant utilitaire pour les sections
const LegalSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-4 hover:border-white/10 transition-colors">
    <div className="flex items-center gap-3 text-white font-bold text-xl tracking-tight">
      <div className="text-indigo-500">{icon}</div>
      {title}
    </div>
    <div className="text-slate-400 text-sm leading-relaxed font-medium">
      {children}
    </div>
  </div>
);

export default LegalPages;