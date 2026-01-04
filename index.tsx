// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './components/ToastContext'; // Import crucial

// Nettoyage des logs en production pour la performance
if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("L'élément racine #root est introuvable.");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* On enveloppe l'App avec le provider de notifications */}
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);