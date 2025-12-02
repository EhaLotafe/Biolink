// components/Landing.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, BarChart2, Layout, Smartphone, ArrowRight, Check } from 'lucide-react';
import PublicProfile from './PublicProfile';
import { INITIAL_USER } from '../constants';
import { Icon } from './Icons';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050C19] text-white overflow-x-hidden selection:bg-cosmic-500 selection:text-white">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[120px] will-change-transform" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-900/10 rounded-full blur-[120px] will-change-transform" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-500 to-nebula-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-bold text-white text-sm">B</span>
          </div>
          <span className="font-bold text-xl tracking-tight">BioLink</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            aria-label="Connexion"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full bg-white text-[#050C19] font-semibold text-sm hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            aria-label="Créer un compte"
          >
            Créer mon compte
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-12 pb-24 md:pt-20 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          {/* Texte Hero */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-nebula-300 mb-2 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Disponible en RDC & Afrique
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Un seul lien pour <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cosmic-400 via-nebula-400 to-blue-400">
                tout partager.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Centralisez vos réseaux sociaux, portfolio et contacts dans une page unique, élégante et optimisée pour mobile.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-cosmic-500 to-nebula-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 will-change-transform"></div>
                <Link
                  to="/register"
                  className="relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#050C19] rounded-full font-bold text-lg hover:bg-gray-50 transition-all"
                  aria-label="Commencer gratuitement"
                >
                  Commencer gratuitement
                  <ArrowRight size={20} />
                </Link>
              </div>
              <span className="text-sm text-gray-500">Pas de carte de crédit requise</span>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-1 w-full max-w-[500px] lg:max-w-none relative perspective-[2000px]">
            {/* Floating Elements */}
            <div className="absolute top-1/4 -left-12 z-20 p-4 bg-[#152C52]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                  <Share2 size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Partages</p>
                  <p className="text-lg font-bold">+1,240</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/4 -right-8 z-20 p-4 bg-[#152C52]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cosmic-500/20 rounded-lg text-cosmic-400">
                  <BarChart2 size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Taux de clic</p>
                  <p className="text-lg font-bold">12.5%</p>
                </div>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="relative mx-auto w-[280px] md:w-[320px] h-[580px] md:h-[650px] bg-[#050C19] rounded-[3rem] border-8 border-gray-800 shadow-2xl rotate-[-6deg] hover:rotate-0 transition-all duration-700 ease-out overflow-hidden ring-1 ring-white/10">
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 z-20 flex justify-center rounded-b-xl w-32 mx-auto"></div>
              <div className="w-full h-full overflow-y-auto no-scrollbar bg-black pointer-events-none select-none">
                <div className="transform scale-90 origin-top">
                  <PublicProfile user={INITIAL_USER} previewMode={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-[#0B1D3A]/30 relative z-10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-400">Une suite d'outils puissants pour gérer votre présence en ligne sans écrire une ligne de code.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#152C52]/40 border border-white/5 p-8 rounded-3xl hover:bg-[#152C52]/60 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Personnalisation complète</h3>
              <p className="text-gray-400 leading-relaxed">
                Choisissez parmi nos thèmes spatiaux, changez vos couleurs et créez une page qui vous ressemble vraiment.
              </p>
            </div>

            <div className="bg-[#152C52]/40 border border-white/5 p-8 rounded-3xl hover:bg-[#152C52]/60 transition-colors group">
              <div className="w-12 h-12 bg-nebula-500/10 rounded-2xl flex items-center justify-center text-nebula-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytiques détaillées</h3>
              <p className="text-gray-400 leading-relaxed">
                Comprenez votre audience. Suivez les clics, les vues et la provenance de vos visiteurs en temps réel.
              </p>
            </div>

            <div className="bg-[#152C52]/40 border border-white/5 p-8 rounded-3xl hover:bg-[#152C52]/60 transition-colors group">
              <div className="w-12 h-12 bg-cosmic-500/10 rounded-2xl flex items-center justify-center text-cosmic-400 mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Mobile First</h3>
              <p className="text-gray-400 leading-relaxed">
                Conçu pour s'afficher parfaitement sur tous les smartphones, tablettes et applications sociales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#152C52] to-[#0B1D3A] rounded-[3rem] p-8 md:p-16 text-center border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-cosmic-500/20 rounded-full blur-[100px] pointer-events-none"></div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Prêt à lancer votre BioLink ?</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-lg mx-auto relative z-10">
            Rejoignez des milliers de créateurs, entrepreneurs et professionnels en RDC et partout dans le monde.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-[#050C19] rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              aria-label="Créer mon compte gratuit"
            >
              Créer mon compte gratuit
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Check size={16} className="text-green-400" /> Gratuit à vie</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-green-400" /> Setup en 2 minutes</span>
            <span className="flex items-center gap-2"><Check size={16} className="text-green-400" /> Pas de pub</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#02060D]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cosmic-500 to-nebula-500 flex items-center justify-center">
              <span className="font-bold text-white text-[10px]">B</span>
            </div>
            <span className="font-bold text-lg">BioLink</span>
          </div>

          <div className="flex items-center gap-4">
            <Icon name="instagram" size={20} className="text-gray-400 hover:text-pink-500 transition-colors" />
            <Icon name="facebook" size={20} className="text-gray-400 hover:text-blue-600 transition-colors" />
            <Icon name="twitter" size={20} className="text-gray-400 hover:text-blue-400 transition-colors" />
            <Icon name="linkedin" size={20} className="text-gray-400 hover:text-blue-700 transition-colors" />
            <Icon name="github" size={20} className="text-gray-400 hover:text-white transition-colors" />
          </div>

          <p className="text-sm text-gray-500">© 2025 BioLink. Fait par Overcome Solution's avec ❤️ pour l'Afrique.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
