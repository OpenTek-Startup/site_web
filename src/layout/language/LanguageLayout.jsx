import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../../i18n/i18n";

/**
 * Valide le segment de langue present dans l'URL (/fr/... ou /en/...).
 * Si la langue n'est pas supportee, redirige vers la langue par defaut.
 * Sinon, synchronise i18next sur cette langue et affiche la suite des
 * routes via <Outlet/>.
 */
export function LanguageLayout() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  const isValid = SUPPORTED_LANGUAGES.includes(lang);

  useEffect(() => {
    if (isValid && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, isValid, i18n]);

  if (!isValid) {
    return <Navigate to={`/${DEFAULT_LANGUAGE}`} replace />;
  }

  return <Outlet />;
}
