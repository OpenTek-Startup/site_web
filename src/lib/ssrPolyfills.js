// Polyfills minimaux pour permettre au code ecrit pour le navigateur de
// s'executer dans le script de prerendu (Node). A importer en tout
// premier dans entry-server.jsx, avant tout module qui utiliserait ces
// globales (ex: i18next-browser-languagedetector utilise `navigator`).
if (typeof globalThis.navigator === "undefined") {
  globalThis.navigator = { language: "fr", languages: ["fr"], userAgent: "node-prerender" };
}
if (typeof globalThis.window === "undefined") {
  // Certains composants font des verifications defensives type
  // `typeof window !== 'undefined'` - on les laisse undefined volontairement,
  // ce fichier ne polyfill que ce qui est strictement necessaire.
}
