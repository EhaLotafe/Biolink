// components/Landing.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, 
  BarChart2, 
  Layout, 
  Smartphone, 
  ArrowRight, 
  Check, 
  Zap, 
  ShieldCheck, 
  Star,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import PublicProfile from './PublicProfile';
import { INITIAL_USER } from '../constants';
import { Icon } from './Icons';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans">
      
      {/* Background Decor Pro 2026 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Glassmorphism */}
      <nav className="fixed top-0 z-[100] w-full bg-[#030712]/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-black text-white text-lg">B</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tighter">BioLink<span className="text-indigo-500">.cd</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Tarifs</a>
            <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Connexion</Link>
            <Link to="/register" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              Démarrer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-40 pb-24 md:pt-56 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-[1.2] text-center lg:text-left space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-indigo-400">
              <Zap size={14} className="fill-indigo-400" />
              Le n°1 du Link-in-Bio en RDC
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] lg:leading-[0.85]">
              Un seul lien <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                pour tout dire.
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Centralisez votre univers numérique. Portfolio, réseaux sociaux et paiements Mobile Money sur une seule page.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-slate-100 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Créer ma page
                <ArrowRight size={22} />
              </Link>
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => <img key={i} className="w-8 h-8 rounded-full border-2 border-[#030712]" src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />)}
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold border-2 border-[#030712]">+2k</div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Déjà adopté par les influenceurs 🇨🇩</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Phone Mockup */}
          <div className="flex-1 w-full relative flex justify-center">
            <div className="absolute top-20 -left-10 z-20 p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl animate-float hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  <Share2 size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total Clics</p>
                  <p className="text-2xl font-black">+45.2k</p>
                </div>
              </div>
            </div>

            <div className="relative w-[300px] md:w-[350px] h-[620px] md:h-[700px] bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-800 shadow-[0_0_80px_rgba(79,70,229,0.3)] overflow-hidden transition-transform hover:scale-[1.02] duration-700">
              <div className="absolute top-0 inset-x-0 h-8 bg-slate-800 z-20 flex justify-center items-end pb-1">
                <div className="w-20 h-4 bg-black rounded-full" />
              </div>
              <div className="w-full h-full bg-black scale-95 origin-center rounded-[2.5rem] overflow-hidden pointer-events-none">
                <PublicProfile user={INITIAL_USER} previewMode={true} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-white/[0.02] border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Layout className="text-indigo-400" />}
              title="Design sur Mesure"
              desc="Adaptez votre page à votre image. Thèmes premium, badges certifiés et personnalisation sans limites."
            />
            <FeatureCard 
              icon={<Smartphone className="text-purple-400" />}
              title="Optimisé Mobile Money"
              desc="Vendez vos produits et recevez des paiements M-Pesa et Airtel Money directement via vos liens."
            />
            <FeatureCard 
              icon={<BarChart2 className="text-pink-400" />}
              title="Analytiques Réelles"
              desc="Sachez qui visite votre page, depuis quelle ville et sur quel bouton ils cliquent en temps réel."
            />
          </div>
        </div>
      </section>

      {/* PRICING SECTION - Nouveau pour la monétisation */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4">Un plan pour chaque besoin</h2>
            <p className="text-slate-400 font-medium">Commencez gratuitement, passez au Pro quand vous êtes prêt.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Gratuit */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] space-y-8 hover:bg-white/[0.07] transition-all">
              <div>
                <h3 className="text-xl font-bold">Gratuit</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black">0 FC</span>
                  <span className="text-slate-500 text-sm">/ mois</span>
                </div>
              </div>
              <ul className="space-y-4">
                <PricingItem text="Jusqu'à 3 liens actifs" active />
                <PricingItem text="Thèmes standards" active />
                <PricingItem text="Analytiques de base" active />
                <PricingItem text="Badge Vérifié" active={false} />
                <PricingItem text="Liens illimités" active={false} />
              </ul>
              <Link to="/register" className="block text-center py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">
                Commencer
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="relative bg-indigo-600 p-10 rounded-[40px] space-y-8 shadow-[0_20px_50px_rgba(79,70,229,0.4)] transform md:scale-105">
              <div className="absolute -top-4 right-10 bg-white text-indigo-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                Recommandé
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">BioLink Pro</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-white">5.000 FC</span>
                  <span className="text-indigo-200 text-sm">/ mois</span>
                </div>
              </div>
              <ul className="space-y-4">
                <PricingItem text="Liens illimités" active white />
                <PricingItem text="Badge Vérifié Officiel" active white />
                <PricingItem text="Thèmes Premium & VIP" active white />
                <PricingItem text="Stats détaillées (Villes/Appareils)" active white />
                <PricingItem text="Support Prioritaire WhatsApp" active white />
              </ul>
              <Link to="/register" className="block text-center py-4 bg-white text-indigo-600 hover:bg-slate-100 rounded-2xl font-bold transition-all shadow-xl">
                Devenir Pro
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 text-sm flex items-center justify-center gap-4">
              Paiements sécurisés via 
              <span className="font-bold text-slate-300">M-Pesa • Airtel Money • Orange Money</span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer Finalisé */}
      <footer className="py-20 border-t border-white/5 bg-[#020617] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-2 space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black">B</div>
              <span className="font-bold text-xl tracking-tighter">BioLink<span className="text-indigo-500">.cd</span></span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs mx-auto md:mx-0 leading-relaxed">
              La plateforme leader pour centraliser votre présence digitale en République Démocratique du Congo.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
               <SocialIcon name="instagram" />
               <SocialIcon name="facebook" />
               <SocialIcon name="whatsapp" />
               <SocialIcon name="x" />
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-widest">Plateforme</h4>
            <Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">À Propos</Link>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Tarifs</a>
            <Link to="/register" className="text-slate-400 hover:text-white text-sm transition-colors">S'inscrire</Link>
          </div>

          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-bold text-white uppercase text-[10px] tracking-widest">Légal</h4>
            <Link to="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Confidentialité</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Conditions</Link>
            <a 
              href="https://portfolio-overcome-solution-2026.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-xs font-black mt-4 underline underline-offset-8 transition-all"
            >
              Overcome Solution's
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
             © 2026 BioLink RDC • Fait à Kinshasa avec ❤️
           </p>
        </div>
      </footer>
    </div>
  );
};

// Composants Internes
const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="space-y-6 group">
    <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-indigo-600/10 group-hover:border-indigo-600/20 transition-all duration-500 shadow-xl">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div className="space-y-2">
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  </div>
);

const PricingItem = ({ text, active, white }: { text: string, active: boolean, white?: boolean }) => (
  <li className={`flex items-center gap-3 text-sm font-medium ${active ? (white ? 'text-white' : 'text-slate-300') : 'text-slate-600'}`}>
    {active ? <Check size={16} className={white ? 'text-indigo-200' : 'text-emerald-400'} /> : <Lock size={14} className="opacity-40" />}
    <span className={!active ? 'line-through opacity-40' : ''}>{text}</span>
  </li>
);

const SocialIcon = ({ name }: any) => (
  <button className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5 shadow-lg" aria-label={name}>
    <Icon name={name} size={18} />
  </button>
);

export default Landing;