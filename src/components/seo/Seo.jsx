/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "../../i18n/i18n";

const SITE_NAME = "OpenTek";
const DEFAULT_DESCRIPTION =
  "OpenTek - Technology open to everyone. Developpement web, mobile, ERP, IA et solutions digitales sur mesure.";
const DEFAULT_IMAGE = "/opentek-full-logo.png";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://www.opentek.com";

/**
 * Composant de balises meta reutilisable pour chaque page publique.
 * Usage : <Seo title="..." description="..." path="/about" />
 *
 * `path` doit etre le chemin SANS le prefixe de langue (ex: "/about", pas
 * "/fr/about") - le prefixe est ajoute automatiquement d'apres la langue
 * courante, et les balises hreflang pour les autres langues sont generees
 * a partir du meme chemin.
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  jsonLd = null,
}) {
  const { i18n } = useTranslation();
  const lang = SUPPORTED_LANGUAGES.includes(i18n.language) ? i18n.language : DEFAULT_LANGUAGE;

  const cleanPath = path === "/" ? "" : path;
  const localizedPath = `/${lang}${cleanPath}`;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Technology open to everyone`;
  const canonicalUrl = `${SITE_URL}${localizedPath}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Versions alternatives par langue - aide Google a comprendre que
          /fr/about et /en/about sont la meme page dans deux langues */}
      {SUPPORTED_LANGUAGES.map((altLang) => (
        <link
          key={altLang}
          rel="alternate"
          hrefLang={altLang}
          href={`${SITE_URL}/${altLang}${cleanPath}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/${DEFAULT_LANGUAGE}${cleanPath}`} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={lang === "fr" ? "fr_FR" : "en_US"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OpenTek",
  url: SITE_URL,
  logo: `${SITE_URL}/opentek-full-logo.png`,
  description: DEFAULT_DESCRIPTION,
  slogan: "Technology open to everyone",
};
