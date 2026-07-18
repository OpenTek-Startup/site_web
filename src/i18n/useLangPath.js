import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./i18n";

/**
 * Retourne une fonction qui prefixe un chemin par la langue courante,
 * ex: langPath('/about') -> '/fr/about' ou '/en/about'.
 * A utiliser partout ou un <Link to="..."> pointe vers une page publique.
 */
export function useLangPath() {
  const { i18n } = useTranslation();
  const lang = SUPPORTED_LANGUAGES.includes(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;

  return (path = "") => {
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `/${lang}${clean ? `/${clean}` : ""}`;
  };
}
