// Genere des fichiers HTML statiques pour les pages publiques (Accueil,
// A propos, Jobs, Events, Blog, Contact) en franc,ais et en anglais, en
// utilisant le rendu serveur React (pas de navigateur headless).
//
// Limite connue : le contenu pilote par le CMS (services, temoignages,
// equipe, portfolio) est charge cote client via useEffect et n'apparait
// donc pas dans le HTML prerendu - seul le contenu statique (textes fixes,
// structure, navigation) est capture. C'est deja un gain reel pour :
//  - les balises <title>/<meta>/Open Graph, cruciales pour le partage sur
//    les reseaux sociaux et WhatsApp (ces plateformes n'executent pas le
//    JavaScript, contrairement a Googlebot)
//  - le temps avant premier affichage utile (First Contentful Paint)
//  - les moteurs de recherche qui n'executent pas ou mal le JavaScript
//
// Le contenu dynamique continue de s'hydrater normalement cote client
// apres le chargement, exactement comme avant.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = `${__dirname}/../dist`;

if (!existsSync(`${distDir}/index.html`)) {
  console.warn("[prerender] dist/index.html introuvable - lancer `vite build` avant. Prerendu ignore.");
  process.exit(0);
}

if (!existsSync(`${__dirname}/../dist-server/entry-server.js`)) {
  console.warn("[prerender] dist-server/entry-server.js introuvable - le build SSR a-t-il echoue ? Prerendu ignore.");
  process.exit(0);
}

const { render } = await import(`${__dirname}/../dist-server/entry-server.js`);

const template = readFileSync(`${distDir}/index.html`, "utf-8");

const LANGS = ["fr", "en"];
const STATIC_ROUTES = ["", "/about", "/jobs", "/events", "/blog", "/contact", "/legal"];

function injectHelmet(html, helmet) {
  if (!helmet) return html;
  return html
    .replace(
      /<title>.*<\/title>/,
      `${helmet.title?.toString() || ""}${helmet.meta?.toString() || ""}${helmet.link?.toString() || ""}${helmet.script?.toString() || ""}`
    )
    .replace(/<html lang="fr">/, `<html ${helmet.htmlAttributes?.toString() || 'lang="fr"'}>`);
}

function writePage(urlPath, html) {
  const outPath = urlPath === "/" ? `${distDir}/index.html` : `${distDir}${urlPath}/index.html`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  console.log(`[prerender] ${urlPath || "/"} -> ${outPath.replace(distDir, "dist")}`);
}

let count = 0;

for (const lang of LANGS) {
  for (const route of STATIC_ROUTES) {
    const url = `/${lang}${route}`;
    try {
      const { html: appHtml, helmet } = render(url, lang);
      let pageHtml = template.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );
      pageHtml = injectHelmet(pageHtml, helmet);
      writePage(url, pageHtml);
      count += 1;
    } catch (error) {
      console.warn(`[prerender] Echec pour ${url} - page laissee en rendu 100% client.`, error.message);
    }
  }
}

console.log(`[prerender] ${count} page(s) prerendue(s).`);
