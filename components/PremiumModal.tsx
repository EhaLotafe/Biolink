// components/PremiumModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Star, X, Smartphone, Zap, Loader2, 
  ShieldCheck, ArrowLeft, ArrowRight, Lock 
} from 'lucide-react';
import { useNotify } from './ToastContext';

// Déclaration pour TypeScript (CinetPay est injecté via index.html)
declare global {
  interface Window {
    CinetPay: any;
  }
}

interface PremiumModalProps {
  user: any; // On passe l'utilisateur pour les infos de paiement
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ user, isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'plan' | 'payment' | 'processing'>('plan');
  const [method, setMethod] = useState<'Mpesa' | 'Airtel' | 'Orange'>('Mpesa');
  const [selectedPlanId, setSelectedPlanId] = useState<'monthly' | 'yearly'>('monthly');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useNotify();

  const plans = [
    { id: 'monthly', name: 'Pack Mensuel', price: '5.000', priceInt: 5000, period: 'FC / mois', desc: 'Boostez votre visibilité digitale' },
    { id: 'yearly', name: 'Pack Annuel', price: '55.000', priceInt: 55000, period: 'FC / an', desc: '2 mois offerts + Badge Gold 🎁', popular: true },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const validateDRCPhone = (num: string) => {
    const drcRegex = /^(081|082|084|085|089|090|097|098|099)\d{7}$/;
    return drcRegex.test(num);
  };

  const handleProcessPayment = () => {
    if (!validateDRCPhone(phone)) {
      showToast("Numéro RDC invalide (ex: 0812345678)", "warning");
      return;
    }

    if (!window.CinetPay) {
      showToast("Erreur de chargement du service de paiement", "error");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Configurer CinetPay
      window.CinetPay.setConfig({
        apikey: import.meta.env.VITE_CINETPAY_API_KEY, // Assure-toi de l'avoir dans .env
        site_id: import.meta.env.VITE_CINETPAY_SITE_ID, // Assure-toi de l'avoir dans .env
        notify_url: 'https://wdhafioitebyswlyffdo.supabase.co/functions/v1/payment-webhook',
        mode: 'PRODUCTION'
      });

      // 2. Lancer le checkout
      window.CinetPay.getCheckout({
        transaction_id: `PRO-${user.id.slice(0, 8)}-${Date.now()}`,
        amount: currentPlan.priceInt,
        currency: 'CDF',
        channels: 'ALL',
        description: `BioLink Pro - ${user.username}`,
        customer_name: user.displayName || user.username,
        customer_surname: "User",
        customer_phone_number: phone,
        customer_email: user.email || 'contact@biolink.cd',
        customer_address: "Kinshasa",
        customer_city: "Kinshasa",
        customer_country: "CD",
        customer_state: "CD",
        customer_zip_code: "00243",
      });

      // 3. Réponse du guichet
      window.CinetPay.waitResponse((data: any) => {
        if (data.status === "ACCEPTED") {
          showToast("Paiement validé ! Votre profil passe en PRO.", "success");
          onSuccess();
        } else {
          showToast("Le paiement n'a pas pu être finalisé.", "error");
          setStep('payment');
        }
        setIsLoading(false);
      });

      window.CinetPay.onError((data: any) => {
        console.error(data);
        showToast("Erreur lors de l'ouverture du guichet", "error");
        setIsLoading(false);
      });

    } catch (err) {
      console.error(err);
      showToast("Erreur technique de paiement", "error");
      setIsLoading(false);
    }
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
                {step === 'payment' ? (
                  <button onClick={() => setStep('plan')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour
                  </button>
                ) : <div />}
                <button 
                      onClick={onClose} 
                      className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
                      aria-label="Fermer la fenêtre de paiement" // ✅ Correction Accessibilité
                      title="Fermer"                             // ✅ Correction Accessibilité
                    >
                      <X size={20} />
                    </button>
              </div>
            )}

            <div className="p-8 md:p-12 md:pt-6">
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
                    {['Liens illimités', 'Badge Vérifié', 'Stats Pro', 'Thèmes VIP', 'WhatsApp Direct', 'Zéro Pub'].map(f => (
                      <div key={f} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <div className="bg-indigo-500/20 p-0.5 rounded-full"><Check size={12} className="text-indigo-400 stroke-[4px]" /></div> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">Mode de paiement</h3>
                    <p className="text-slate-400 text-sm">Paiement 100% sécurisé (RDC)</p>
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
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Numéro de téléphone</label>
                        <span className="text-[10px] font-bold text-indigo-400">{currentPlan.price} FC</span>
                      </div>
                      <input 
                        type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="081 234 5678"
                        className="w-full bg-white/5 border border-white/10 p-5 rounded-[24px] text-white text-xl font-black outline-none focus:border-indigo-500 transition-all"
                        maxLength={10}
                      />
                    </div>

                    <button 
                      onClick={handleProcessPayment}
                      disabled={phone.length < 10 || isLoading}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : <>Confirmer le paiement <ArrowRight size={18} /></>}
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