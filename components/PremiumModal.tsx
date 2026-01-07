// components/PremiumModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Star, X, Smartphone, Zap, Loader2, 
  ShieldCheck, ArrowLeft, ArrowRight, Lock, Copy
} from 'lucide-react';
import { useNotify } from './ToastContext';
import { supabase } from '../supabaseClient';

// Déclaration pour CinetPay (Optionnel si tu l'utilises plus tard)
declare global { interface Window { CinetPay: any; } }

interface PremiumModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ user, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'plan' | 'payment' | 'manual-confirm'>('plan');
  const [method, setMethod] = useState<'Mpesa' | 'Airtel' | 'Orange'>('Mpesa');
  const [selectedPlanId, setSelectedPlanId] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentRef, setPaymentRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useNotify();

  // TES NUMÉROS POUR RECEVOIR L'ARGENT
  const MERCHANT_NUMBERS = {
    Mpesa: "0817517378 (Manasse LOTAFE)",
    Airtel: "0993033321 (Jhon Mangobe == OVERCOME SOLUTIONS)",
    Orange: "0890000000 (Pas encore disponible)"
  };

  const plans = [
    { id: 'monthly', name: 'Pack Mensuel', price: '5.000', priceInt: 5000, period: 'FC / mois', desc: 'Boostez votre visibilité' },
    { id: 'yearly', name: 'Pack Annuel', price: '55.000', priceInt: 55000, period: 'FC / an', desc: '2 mois gratuits + Badge VIP 🎁', popular: true },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  // LOGIQUE DE VALIDATION MANUELLE (V3)
  const handleManualPaymentSubmit = async () => {
    if (paymentRef.length < 5) {
      showToast("Veuillez entrer une référence de transaction valide", "warning");
      return;
    }

    setIsLoading(true);
    try {
      // On met à jour l'utilisateur dans Supabase avec la référence
      const { error } = await supabase
        .from('users')
        .update({ 
          payment_status: 'pending', 
          payment_ref: paymentRef.trim() 
        })
        .eq('id', user.id);

      if (error) throw error;

      showToast("Preuve envoyée ! Validation par HQ Admin sous 2h.", "success");
      onSuccess(); // Ferme la modal et affiche la bannière d'attente sur le Dashboard
    } catch (err) {
      showToast("Erreur lors de l'envoi de la preuve", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    const phone = text.split(' ')[0];
    navigator.clipboard.writeText(phone);
    showToast(`Numéro ${method} copié !`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()} 
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 40, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#030712] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden z-10"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

            {!isLoading && (
              <div className="flex justify-between items-center p-8 pb-0">
                {step !== 'plan' ? (
                  <button onClick={() => setStep(step === 'manual-confirm' ? 'payment' : 'plan')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour
                  </button>
                ) : <div />}
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all" aria-label="Fermer" title="Fermer">
                  <X size={24} />
                </button>
              </div>
            )}

            <div className="p-8 md:p-12 md:pt-6">
              
              {/* ÉTAPE 1 : CHOIX DU PLAN */}
              {step === 'plan' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-2">
                      <Star fill="currentColor" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter text-center">Passez au BioLink Pro</h2>
                    <p className="text-slate-400 text-sm font-medium">Rejoignez l'élite des créateurs en RDC</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {plans.map((plan) => (
                      <button 
                        key={plan.id}
                        onClick={() => { setSelectedPlanId(plan.id as any); setStep('payment'); }}
                        className={`relative p-6 rounded-[28px] border-2 text-left transition-all duration-300 group ${selectedPlanId === plan.id ? 'border-indigo-600 bg-indigo-600/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                      >
                        {plan.popular && <div className="absolute -top-3 right-8 bg-indigo-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">MEILLEUR CHOIX</div>}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white text-lg">{plan.name}</p>
                            <p className="text-[11px] text-slate-400 mt-1 font-medium">{plan.desc}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-black text-white">{plan.price}</span>
                            <span className="text-[9px] font-black text-slate-500 block uppercase tracking-widest">{plan.period}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {['Liens illimités', 'Badge Vérifié', 'Mise en avant', 'Thèmes VIP', 'WhatsApp Pro', 'Analytics Villes'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <div className="bg-indigo-500/20 p-0.5 rounded-full"><Check size={12} className="text-indigo-400 stroke-[4px]" /></div> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : MODE DE PAIEMENT */}
              {step === 'payment' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">Mode de paiement</h3>
                    <p className="text-slate-400 text-sm">Sélectionnez votre opérateur Mobile Money</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {['Mpesa', 'Airtel', 'Orange'].map((m) => (
                      <button 
                        key={m}
                        onClick={() => setMethod(m as any)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${method === m ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' : 'border-white/5 hover:border-white/10'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${method === m ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                          <Smartphone size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest">{m}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-indigo-600/10 p-6 rounded-[32px] border border-indigo-500/20 space-y-4">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Instructions de transfert</p>
                    <div className="space-y-1">
                        <p className="text-slate-400 text-sm">Effectuez le transfert de <span className="text-white font-bold">{currentPlan.price} FC</span> au :</p>
                        <h4 className="text-xl font-black text-white">{MERCHANT_NUMBERS[method]}</h4>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(MERCHANT_NUMBERS[method])}
                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        <Copy size={14} /> Copier le numéro
                    </button>
                  </div>

                  <button 
                    onClick={() => setStep('manual-confirm')}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all"
                  >
                    J'ai effectué le transfert <ArrowRight size={18} className="inline ml-2" />
                  </button>
                </div>
              )}

              {/* ÉTAPE 3 : CONFIRMATION MANUELLE (Réf SMS) */}
              {step === 'manual-confirm' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">Confirmation</h3>
                    <p className="text-slate-400 text-sm">Entrez la référence du message reçu</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">ID de Transaction (Reçu par SMS)</label>
                      <input 
                        type="text" 
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="Ex: 1234567890"
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white text-xl font-black outline-none focus:border-indigo-500 transition-all placeholder:text-white/5"
                      />
                    </div>

                    <div className="p-5 bg-emerald-500/5 rounded-[24px] border border-emerald-500/10 flex items-start gap-4">
                      <ShieldCheck className="text-emerald-500 mt-1" size={20}/>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Dès validation de votre référence par nos services, votre compte passera en <span className="text-white font-bold text-xs">PRO</span> et vous recevrez un message de confirmation sur votre Dashboard.
                      </p>
                    </div>

                    <button 
                      onClick={handleManualPaymentSubmit}
                      disabled={isLoading}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : "Vérifier mon paiement"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;