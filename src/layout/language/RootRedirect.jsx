import { Navigate } from "react-router-dom";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../../i18n/i18n";

/**
 * Redirige "/" vers "/fr" ou "/en" selon la langue du navigateur,
 * avec le francais par defaut (marche principal).
 */
export function RootRedirect() {
  const browserLang = (navigator.language || DEFAULT_LANGUAGE).slice(0, 2);
  const target = SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;
  return <Navigate to={`/${target}`} replace />;
}
