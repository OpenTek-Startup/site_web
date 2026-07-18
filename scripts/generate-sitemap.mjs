// Genere dist/sitemap.xml apres le build : routes statiques + articles de
// blog publies (recuperes depuis Appwrite, lecture publique - pas besoin
// de cle API). En cas d'echec reseau, le sitemap se limite aux routes
// statiques plutot que de faire echouer le build.

import { Client, Databases } from "appwrite";
import { writeFileSync, existsSync } from "fs";
import { config } from "dotenv";

config();

const SITE_URL = (process.env.VITE_SITE_URL || "https://www.opentek.com").replace(/\/$/, "");
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const BLOG_COLLECTION_ID = process.env.VITE_APPWRITE_BLOG_COLLECTION_ID || "blog_posts";

const STATIC_ROUTES = ["", "/about", "/jobs", "/events", "/blog", "/contact", "/legal"];
const LANGS = ["fr", "en"];

async function getPublishedBlogSlugs() {
  if (!PROJECT_ID || !DATABASE_ID) return [];
  try {
    const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
    const databases = new Databases(client);
    const response = await databases.listDocuments(DATABASE_ID, BLOG_COLLECTION_ID);
    return response.documents
      .filter((doc) => doc.published)
      .map((doc) => doc.slug || doc.$id);
  } catch (error) {
    console.warn(
      "[sitemap] Impossible de recuperer les articles de blog (collection pas encore creee ?) - sitemap limite aux pages statiques.",
      error?.message
    );
    return [];
  }
}

async function generateSitemap() {
  const blogSlugs = await getPublishedBlogSlugs();
  const routes = [
    ...STATIC_ROUTES,
    ...blogSlugs.map((slug) => `/blog/${slug}`),
  ];

  // Pour chaque route, une entree par langue + les liens alternate vers
  // les autres langues (xhtml:link hreflang), pour que Google comprenne
  // que /fr/x et /en/x sont la meme page traduite.
  const urlEntries = routes.flatMap((route) =>
    LANGS.map((lang) => {
      const alternates = LANGS.map(
        (altLang) =>
          `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${SITE_URL}/${altLang}${route}" />`
      ).join("\n");
      return `  <url>
    <loc>${SITE_URL}/${lang}${route}</loc>
${alternates}
  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join("\n")}
</urlset>
`;

  const outDir = existsSync("dist") ? "dist" : "public";
  writeFileSync(`${outDir}/sitemap.xml`, xml);
  console.log(`[sitemap] ${urlEntries.length} URL(s) ecrites dans ${outDir}/sitemap.xml`);
}

generateSitemap();
