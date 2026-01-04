// components/PremiumModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Star, 
  X, 
  Smartphone, 
  Zap, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, // ✅ Import ajouté ici pour corriger l'erreur
  Lock 
} from 'lucide-react';
import { useNotify } from './ToastContext';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'plan' | 'payment' | 'processing'>('plan');
  const [method, setMethod] = useState<'Mpesa' | 'Airtel' | 'Orange'>('Mpesa');
  const [selectedPlanId, setSelectedPlanId] = useState<'monthly' | 'yearly'>('monthly');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useNotify();

  const plans = [
    { id: 'monthly', name: 'Pack Mensuel', price: '5.000', period: 'FC / mois', desc: 'Boostez votre visibilité digitale' },
    { id: 'yearly', name: 'Pack Annuel', price: '55.000', period: 'FC / an', desc: '2 mois offerts + Badge Gold 🎁', popular: true },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const validateDRCPhone = (num: string) => {
    const drcRegex = /^(081|082|084|085|089|090|097|098|099)\d{7}$/;
    return drcRegex.test(num);
  };

  const handleProcessPayment = async () => {
    if (!validateDRCPhone(phone)) {
      showToast("Numéro RDC invalide (ex: 0812345678)", "warning");
      return;
    }
    
    setStep('processing');
    setIsLoading(true);

    try {
      // Simulation attente réseau (Ici tu connecteras FlexPay plus tard)
      await new Promise(resolve => setTimeout(resolve, 5000)); 
      
      showToast("Paiement confirmé ! Bienvenue Pro.", "success");
      onSuccess();
    } catch (err) {
      showToast("Le paiement a échoué. Réessayez.", "error");
      setStep('payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={step !== 'processing' ? onClose : undefined} 
            className="absolute inset-0 bg-black/90 backdrop-blur-md" 
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, y: 40, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#030712] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden z-10"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

            {/* Header / Navigation */}
            {step !== 'processing' && (
              <div className="flex justify-between items-center p-8 pb-0">
                {step === 'payment' ? (
                  <button onClick={() => setStep('plan')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour
                  </button>
                ) : <div />}
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all" aria-label="Fermer">
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
                    <h2 className="text-3xl font-black text-white tracking-tighter">BioLink Pro</h2>
                    <p className="text-slate-400 text-sm font-medium">Débloquez la puissance illimitée</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {plans.map((plan) => (
                      <button 
                        key={plan.id}
                        onClick={() => {
                          setSelectedPlanId(plan.id as any);
                          setStep('payment');
                        }}
                        className={`relative p-6 rounded-[28px] border-2 text-left transition-all duration-300 group ${selectedPlanId === plan.id ? 'border-indigo-600 bg-indigo-600/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 right-8 bg-indigo-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg">
                            MEILLEUR CHOIX
                          </div>
                        )}
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
                    {['Liens illimités', 'Badge Vérifié', 'Stats Pro', 'Thèmes VIP', 'WhatsApp Direct', 'Zéro Publicité'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <div className="bg-indigo-500/20 p-0.5 rounded-full"><Check size={12} className="text-indigo-400 stroke-[4px]" /></div> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : PAIEMENT MOBILE MONEY */}
              {step === 'payment' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">Mode de paiement</h3>
                    <p className="text-slate-400 text-sm">Paiement 100% sécurisé via Mobile Money</p>
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

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Numéro de téléphone (RDC)</label>
                        <span className="text-[10px] font-bold text-indigo-400">Total : {currentPlan.price} FC</span>
                      </div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="081 234 5678"
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white text-xl font-black outline-none focus:border-indigo-500 transition-all placeholder:text-white/5"
                        maxLength={10}
                      />
                    </div>

                    <div className="p-5 bg-white/[0.02] rounded-3xl border border-white/5 flex items-start gap-4">
                      <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400"><Lock size={18}/></div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        Une demande de confirmation (PIN) sera envoyée sur votre téléphone <span className="text-white font-bold">{method}</span> pour valider le montant de <span className="text-white font-bold">{currentPlan.price} FC</span>.
                      </p>
                    </div>

                    <button 
                      onClick={handleProcessPayment}
                      disabled={phone.length < 10}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:grayscale text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      Confirmer le paiement <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : ATTENTE DU PIN (USSD) */}
              {step === 'processing' && (
                <div className="py-12 flex flex-col items-center text-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-[60px] opacity-20 animate-pulse" />
                    <Loader2 size={80} className="text-indigo-500 animate-spin relative" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white tracking-tight">Validation en cours...</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed font-medium">
                      Regardez votre téléphone <span className="text-white font-bold">{method}</span>. <br/> Tapez votre code PIN pour finaliser l'achat de <span className="text-indigo-400 font-bold">{currentPlan.price} FC</span>.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 rounded-full border border-white/5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction cryptée SSL</p>
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