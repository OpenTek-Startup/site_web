/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { SUPPORTED_LANGUAGES } from "../../i18n/i18n";

const LANGUAGE_OPTIONS = {
  fr: { label: "Francais", flag: "🇫🇷", short: "FR" },
  en: { label: "English", flag: "🇬🇧", short: "EN" },
};

/**
 * Selecteur de langue en dropdown avec drapeaux, comme sur les sites pro.
 * N'a aucun effet sur l'etat du menu mobile - le composant appelant
 * (Navbar) decide si le dropdown doit se fermer le menu via onSelect.
 */
export function LanguageDropdown({ onSelect, variant = "desktop" }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLang = SUPPORTED_LANGUAGES.includes(i18n.language) ? i18n.language : "fr";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang) => {
    setOpen(false);
    if (lang !== currentLang) {
      const rest = location.pathname.split("/").slice(2).join("/");
      navigate(`/${lang}${rest ? `/${rest}` : ""}`);
    }
    onSelect?.();
  };

  return (
    <div className={`lang-dropdown lang-dropdown--${variant}`} ref={containerRef}>
      <button
        type="button"
        className="lang-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="lang-dropdown__flag">{LANGUAGE_OPTIONS[currentLang].flag}</span>
        <span className="lang-dropdown__code">{LANGUAGE_OPTIONS[currentLang].short}</span>
        <FontAwesomeIcon icon={faChevronDown} className="lang-dropdown__chevron" />
      </button>

      {open && (
        <ul className="lang-dropdown__menu" role="listbox">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang}>
              <button
                type="button"
                className={`lang-dropdown__option ${lang === currentLang ? "lang-dropdown__option--active" : ""}`}
                onClick={() => handleSelect(lang)}
                role="option"
                aria-selected={lang === currentLang}
              >
                <span className="lang-dropdown__flag">{LANGUAGE_OPTIONS[lang].flag}</span>
                <span>{LANGUAGE_OPTIONS[lang].label}</span>
                {lang === currentLang && <FontAwesomeIcon icon={faCheck} className="lang-dropdown__check" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
