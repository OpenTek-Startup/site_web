import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./locales/fr.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = ["fr", "en"];
export const DEFAULT_LANGUAGE = "fr"; // marche principal francophone (Cameroun)

// Note SSR : LanguageDetector accede a `navigator`, absent en Node. Le
// script de prerendu (entry-server.jsx) polyfill un `navigator` minimal
// avant d'importer ce fichier - voir src/lib/ssrPolyfills.js.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    detection: {
      // La langue est en realite pilotee par l'URL (/fr/... ou /en/...) via
      // LanguageLayout ; le detecteur ne sert qu'a choisir la langue par
      // defaut lors de la toute premiere visite sur "/".
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
