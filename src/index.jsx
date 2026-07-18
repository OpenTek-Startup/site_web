import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { initAnalytics } from './lib/analytics.js'
import './i18n/i18n.js'

initAnalytics();

const rootElement = document.getElementById('root');
const appTree = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

// Les pages prerendues (voir scripts/prerender.mjs) arrivent avec du HTML
// deja present dans #root : on utilise hydrateRoot pour que React reprenne
// ce HTML tel quel plutot que de le jeter et tout redessiner (evite un
// flash visuel). Les routes non prerendues (ex: /admin/*) demarrent avec
// un #root vide -> createRoot classique.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appTree);
} else {
  createRoot(rootElement).render(appTree);
}
