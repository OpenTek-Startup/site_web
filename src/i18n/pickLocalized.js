import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./i18n";

/**
 * Recupere la valeur localisee d'un champ CMS Appwrite qui suit la
 * convention `champ_fr` / `champ_en`, avec repli intelligent :
 * 1. La langue demandee (ex: title_fr)
 * 2. L'autre langue supportee (ex: title_en), pour ne jamais afficher vide
 * 3. Le champ brut sans suffixe (ex: title), pour compatibilite avec du
 *    contenu cree avant la mise en place du bilingue
 *
 * Usage : pickLocalized(doc, 'title', i18n.language) -> doc.title_fr | doc.title_en | doc.title
 */
export function pickLocalized(doc, field, lang) {
  if (!doc) return "";
  const primaryLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
  const otherLang = SUPPORTED_LANGUAGES.find((l) => l !== primaryLang);

  return (
    doc[`${field}_${primaryLang}`] ||
    doc[`${field}_${otherLang}`] ||
    doc[field] ||
    ""
  );
}
