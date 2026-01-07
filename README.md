# 🚀 BioLink - Votre Identité Numérique Centralisée

**BioLink** est une plateforme moderne de type "Link-in-Bio" conçue pour permettre aux créateurs, entrepreneurs et professionnels de centraliser leur présence en ligne sur une seule page élégante, optimisée pour le mobile.

![BioLink Preview](https://via.placeholder.com/1200x600?text=BioLink+Space+Theme+Preview)

---

## ✨ Fonctionnalités Actuelles

### 🌍 Front-Office (Public)
- **Profil Utilisateur** : Page publique accessible via `/u/username`.
- **Thèmes Spatiaux** : Deep Space, Nebula, Midnight.
- **Responsive** : Optimisé pour mobile.
- **Partage Social** : Méta-tags OpenGraph et Twitter Cards (mockées pour l’instant).

### ⚙️ Back-Office (Dashboard)
- **Gestion des liens** : Ajouter, modifier, supprimer et réorganiser les liens (Drag & Drop simulé).
- **Personnalisation** : Modification de bio, nom d'affichage et thème visuel.
- **QR Code** : Générateur de QR Code pour le profil utilisateur.
- **Aperçu Live** : Visualisation du rendu mobile en temps réel.

### 🔐 Authentification
- Inscription et connexion (Email / Password) via Supabase.
- Gestion basique des rôles utilisateur.
- Social login prévu mais non encore intégré.

### 📊 Analytics (Mock)
- Graphiques de vues, clics et CTR simulés.
- Distribution par type d’appareil (mobile, desktop, tablet).
- Géolocalisation mockée.

---

## 🛠️ Stack Technique

- **Framework** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Routing** : React Router v6
- **Graphiques** : Recharts
- **Icônes** : Lucide React
- **Backend** : Supabase (Auth + Base de données)
- **Build Tool** : Vite

---

## 🚀 Installation & Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/biolink.git
cd biolink
````

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configurer Supabase (mock ou réel)

1. Crée un projet sur [Supabase](https://supabase.com/).
2. Dans `supabaseClient.ts` configure `SUPABASE_URL` et `SUPABASE_ANON_KEY`.

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);
```

> ⚠️ Pour tester rapidement, tu peux utiliser `INITIAL_USER` dans `constants.ts` pour mocker les données sans backend.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

---

## 📂 Structure du Projet

```
src/
├── components/      # Composants React
│   ├── Dashboard.tsx     # Dashboard Admin (CRUD des liens)
│   ├── PublicProfile.tsx # Page publique utilisateur
│   ├── QRCodeModal.tsx   # Modal pour QR Code
│   └── ...
├── constants.ts     # Thèmes, Analytics et mock data
├── types.ts         # Typage TypeScript
├── supabaseClient.ts # Connexion Supabase
├── App.tsx          # Routeur principal
└── index.tsx        # Point d'entrée
```

---

## 🔮 Roadmap / Fonctionnalités à compléter

* [ ] **Analytics réelles** : Connexion aux données Supabase pour vues et clics.
* [ ] **Upload images** : Avatar utilisateur et assets.
* [ ] **Social login** : Google / Facebook.
* [ ] **Paiement / Premium** : Stripe / Mobile Money.
* [ ] **Sous-domaines utilisateurs** : DNS et routage dynamique.
* [ ] **Sécurité avancée** : Gestion complète des rôles, tokens et permissions.
* [ ] **Notifications et toast améliorés**.
* [ ] **Optimisation et tests** : Réduire le bundle, lazy-loading des liens et dashboard.

---

## 📄 Licence

MIT License.
