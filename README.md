
# 🚀 BioLink RDC — Votre Univers Numérique en Un Seul Lien 🇨🇩

**BioLink RDC** est la plateforme SaaS "Link-in-Bio" de nouvelle génération, conçue spécifiquement pour les créateurs, entrepreneurs et entreprises en République Démocratique du Congo. Plus qu'un simple agrégateur de liens, c'est une vitrine professionnelle optimisée pour le marché local.

![BioLink Preview](https://via.placeholder.com/1200x600?text=BioLink+RDC+SaaS+Platform+2026)

---

## ✨ Fonctionnalités "Pro 2026"

### 🌍 Front-Office (Expérience Visuelle Premium)
- **Design Liquid Glass** : Interface moderne avec effets de flou (OLED Black) et animations fluides via Framer Motion.
- **Smart Links (Exclusif PRO)** :
  - **Lien Pulsant** : Animation de vibration pour attirer l'attention sur vos liens prioritaires.
  - **Protection par Password** : Sécurisez l'accès à vos fichiers ou documents privés.
  - **Planification** : Programmez l'apparition et la disparition automatique de vos liens.
- **Bouton WhatsApp Flottant** : Contact direct et instantané pour convertir vos visiteurs en clients.
- **QR Code Intégré** : Partage physique instantané via un QR Code haute résolution.

### ⚙️ Back-Office (Tableau de Bord SaaS)
- **Gestion Avancée des Liens** : Ajouter, modifier et réorganiser vos liens par simple glisser-déposer.
- **Upload Réel (Supabase Storage)** : Personnalisez votre avatar et votre fond d'écran professionnel.
- **Aperçu Live** : Visualisation en temps réel de votre page mobile pendant l'édition.
- **Système de Messages HQ** : Recevez des notifications directes de l'administration BioLink.

### 📊 Analytics de Précision (V3)
- **Données Réelles** : Suivi des vues et clics en temps réel (plus de mocks).
- **Géolocalisation** : Identifiez les villes de provenance de votre trafic (Kinshasa, Goma, Lubumbashi...).
- **Sources de Trafic (Referrer)** : Découvrez si vos clients viennent de TikTok, Instagram, Facebook ou WhatsApp.

### 🔐 Administration & Monétisation
- **HQ Command Center** : Interface admin privée pour la gestion des utilisateurs.
- **Flux "Preuve de Paiement"** : Système de validation manuelle des abonnements Pro via Mobile Money (M-Pesa, Airtel Money, Orange Money).
- **Badge Vérifié** : Certification officielle pour les comptes authentiques et Premium.

---

## 🛠️ Stack Technique (Modernité & Performance)

- **Frontend** : React 19 + TypeScript + Framer Motion (Animations)
- **Styling** : Tailwind CSS (Glassmorphism design)
- **Backend/Auth** : Supabase (PostgreSQL + Edge Functions)
- **Storage** : Supabase Storage (Buckets Avatars & Backgrounds)
- **Graphiques** : Recharts
- **Hébergement** : Netlify (Déploiement continu via GitHub)

---

## 📂 Structure du Projet

```text
biolink/
├── components/      # Composants UI (Dashboard, Admin, Modal, Toast...)
├── lib/             # Utilitaires et fonctions partagées
├── supabase/        # Configuration des Edge Functions (Webhooks)
├── App.tsx          # Système de routage et gestion de session
├── constants.ts     # Thèmes, Mocks et configurations initiales
├── supabaseClient.ts # Connexion à la base de données
├── types.ts         # Définitions TypeScript (SaaS Ready)
└── index.tsx        # Point d'entrée avec ToastProvider
```

---

## 🚀 Installation & Démarrage

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-username/biolink.git
   cd biolink
   ```

2. **Configurer les variables d'environnement**
   Créez un fichier `.env.local` à la racine :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

3. **Installer et Lancer**
   ```bash
   npm install
   npm run dev
   ```

---

## 🔮 Roadmap 2026

* [x] **V3 (Actuelle)** : Smart Links, Analytics par villes et Admin HQ.
* [x] **V3** : Upload de médias via Supabase Storage.
* [ ] **V4 (Prochainement)** : Automatisation complète des paiements via API FlexPay.
* [ ] **V4** : Boutique E-commerce intégrée (Mini-Shop).
* [ ] **V4** : Support multilingue (Français, Lingala, Swahili).

---

## 👤 Créateur & Vision
**Eha Lotafe** — Développeur Fullstack & IA Strategist.
Propulsé par **Overcome Solution's** : [Visiter le Portfolio](https://portfolio-overcome-solution-2026.vercel.app/)

---

## 📄 Licence
Propriété exclusive de Overcome Solution's. © 2026 BioLink RDC.
```

---
