// Point d'entree utilise UNIQUEMENT par le build SSR (voir
// scripts/prerender.mjs et le script npm "build:ssr"). N'est jamais
// charge par le navigateur - separe de src/index.jsx (point d'entree
// client normal).

import "./lib/ssrPolyfills.js";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { PublicRoutes } from "./routesConfig.jsx";
import i18n from "./i18n/i18n.js";

export function render(url, lang) {
  const helmetContext = {};

  // Les ressources fr/en sont chargees en memoire des l'init (voir
  // i18n.js), donc changeLanguage s'applique de maniere synchrone ici -
  // pas besoin d'attendre la promesse avant de rendre.
  i18n.changeLanguage(lang);

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <PublicRoutes />
      </StaticRouter>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;

  return { html, helmet };
}
