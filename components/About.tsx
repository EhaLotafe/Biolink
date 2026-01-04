// components/About.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion'; // Ajout de Variants
import { 
  ArrowLeft, 
  Code2, 
  Rocket, 
  BrainCircuit, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const About: React.FC = () => {
  // SEO : Mise à jour du titre de la page
  useEffect(() => {
    document.title = "À Propos | Eha Lotafe & Overcome Solution's";
  }, []);

  // Variantes d'animation typées explicitement pour éviter les erreurs TS
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.6, 
        ease: "easeOut" // TS reconnait maintenant la valeur grâce au type Variants
      } 
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* Navbar Minimaliste */}
      <nav className="fixed top-0 z-[100] w-full bg-[#030712]/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center">
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-sm"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Retour
          </Link>
        </div>
      </nav>

      {/* Contenu Principal */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-24"
      >
        
        {/* Section 01 : Eha Lotafe */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles size={12} className="fill-indigo-400" />
            Le Créateur
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Eha <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Lotafe</span>
            </h1>
            <p className="text-slate-300 text-xl md:text-2xl leading-relaxed font-medium max-w-2xl">
              Développeur et créateur de solutions digitales orientées impact. Mon travail consiste à concevoir, structurer et déployer des produits numériques adaptés aux réalités locales.
            </p>
            <div className="h-1 w-20 bg-indigo-600 rounded-full" />
            <p className="text-slate-400 text-lg leading-relaxed max-w-3xl font-light italic">
              "J’interviens à l’intersection de la tech, du design et de l’intelligence artificielle avec une approche pragmatique : comprendre le besoin, construire une solution claire et livrer un résultat exploitable."
            </p>
          </div>
        </motion.section>

        {/* Section 02 : Overcome Solution's */}
        <motion.section variants={itemVariants} className="relative group">
          <div className="absolute -inset-4 bg-indigo-600/5 rounded-[48px] blur-3xl group-hover:bg-indigo-600/10 transition-colors duration-700" />
          
          <div className="relative bg-[#0B1D3A]/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-16 space-y-12 overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  Overcome Solution's
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                </h2>
                <p className="text-slate-400 font-medium">Structure indépendante • Solutions Digitales Modernes</p>
              </div>
              <a 
                href="https://portfolio-overcome-solution-2026.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
              >
                Visiter le Portfolio <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureSmall icon={<Code2 size={20}/>} text="Développement Web & Mobile" />
              <FeatureSmall icon={<Globe size={20}/>} text="Optimisation de présence digitale" />
              <FeatureSmall icon={<Rocket size={20}/>} text="Création de contenus publicitaires" />
              <FeatureSmall icon={<BrainCircuit size={20}/>} text="Intégration & Stratégie IA" />
            </div>

            <div className="pt-10 border-t border-white/5">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
                <p className="text-sm text-slate-400 leading-relaxed italic">
                  "Nous construisons avec méthode, testons avec rigueur et livrons avec exigence pour transformer vos idées en résultats mesurables."
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 03 : Call to Action discret */}
        <motion.section variants={itemVariants} className="text-center py-10 space-y-8">
          <h3 className="text-xl font-bold text-slate-500 uppercase tracking-[0.3em]">Vous aussi, commencez ici</h3>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl"
          >
            Créer mon BioLink gratuitement
            <ArrowRightIcon />
          </Link>
        </motion.section>

      </motion.main>

      {/* Footer minimaliste */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        <p>© 2026 BioLink RDC • Tous droits réservés</p>
        <p>Propulsé par Overcome Solution's</p>
      </footer>
    </div>
  );
};

// Sous-composants utilitaires
const FeatureSmall: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group">
    <div className="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-200 tracking-tight leading-tight">{text}</span>
  </div>
);

const ArrowRightIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);

export default About;