/* eslint-disable react/prop-types */
// NavbarComponent.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import openTeklogo from '../../assets/images/opentek.png';
import closeMenuIcon from '../../assets/icons/close_menu_icon.png';
import { useLangPath } from '../../i18n/useLangPath';
import { LanguageDropdown } from './LanguageDropdown';
import './navbar.css';

const NavbarComponent = ({ whiteNavbar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const langPath = useLangPath();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // Active link: exact match for home, startsWith for other routes.
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === langPath('/');
    }
    return location.pathname.startsWith(langPath(path));
  };

  const smoothScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = (e) => {
    e.preventDefault();
    if (location.pathname !== langPath('/')) {
      navigate(langPath('/'));
      setTimeout(() => smoothScrollTo("our-services"), 150);
    } else {
      smoothScrollTo("our-services");
    }
  };

  const scrollToPortfolio = (e) => {
    e.preventDefault();
    if (location.pathname !== langPath('/')) {
      navigate(langPath('/'));
      setTimeout(() => smoothScrollTo("home-portfolio"), 150);
    } else {
      smoothScrollTo("home-portfolio");
    }
  };

  return (
    <nav className={`navbar ${whiteNavbar ? 'navbar--white' : ''}`}>
      <div className="navbar__container">
        {/* Logo */}
        <div className="navbar__logo">
          <Link to={langPath('/')}>
            <img src={openTeklogo} alt="OpenTek Logo" />
          </Link>
        </div>

        {/* Navigation Links in the Center */}
        <ul className="navbar__links">
          <li>
            <Link to={langPath('/')} className={isActiveLink('/') ? 'active' : ''}>
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <a
              href="#home-portfolio"
              onClick={scrollToPortfolio}
              className={isActiveLink('/portfolio') ? 'active' : ''}
            >
              {t('nav.projects')}
            </a>
          </li>
          <li>
            <Link to={langPath('/about')} className={isActiveLink('/about') ? 'active' : ''}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <a
              href="#our-services"
              onClick={scrollToServices}
              className={isActiveLink('/services') ? 'active' : ''}
            >
              {t('nav.services')}
            </a>
          </li>
          <li>
            <Link to={langPath('/jobs')} className={isActiveLink('/jobs') ? 'active' : ''}>
                {t('nav.jobs')}
              </Link>
          </li>
          <li>
            <Link to={langPath('/events')} className={isActiveLink('/events') ? 'active' : ''}>
                {t('nav.events')}
              </Link>
          </li>
          <li>
            <Link to={langPath('/blog')} className={isActiveLink('/blog') ? 'active' : ''}>
                {t('nav.blog')}
              </Link>
          </li>
        </ul>

        {/* Right side: language + contact, grouped so the grid layout stays stable */}
        <div className="navbar__actions">
          <LanguageDropdown variant="desktop" />
          <div className="navbar__contact">
            <Link to={langPath('/contact')} className="contact-btn">
              {t('nav.contact')}
            </Link>
          </div>
          <div className="navbar__hamburger" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'mobile-menu--active' : ''}`}>
        <div className="mobile-menu__header">
          <Link to={langPath('/')}>
            <img src={openTeklogo} alt="OpenTek Logo" />
          </Link>
          <button className="mobile-menu__close" onClick={toggleMobileMenu}>
            <img src={closeMenuIcon} alt="Close Menu" />
          </button>
        </div>
        <ul className="mobile-menu__links">
          <li>
            <Link to={langPath('/')} className={isActiveLink('/') ? 'active' : ''} onClick={toggleMobileMenu}>
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <a
              href="#home-portfolio"
              onClick={(e) => {
                toggleMobileMenu();
                scrollToPortfolio(e);
              }}
              className={isActiveLink('/portfolio') ? 'active' : ''}
            >
              {t('nav.projects')}
            </a>
          </li>
          <li>
            <Link to={langPath('/about')} className={isActiveLink('/about') ? 'active' : ''} onClick={toggleMobileMenu}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <a
              href="#our-services"
              onClick={(e) => {
                toggleMobileMenu();
                scrollToServices(e);
              }}
              className={isActiveLink('/services') ? 'active' : ''}
            >
              {t('nav.services')}
            </a>
          </li>
          <li>
            <Link to={langPath('/jobs')} className={isActiveLink('/jobs') ? 'active' : ''} onClick={toggleMobileMenu}>
              {t('nav.jobs')}
            </Link>
          </li>
          <li>
            <Link to={langPath('/events')} className={isActiveLink('/events') ? 'active' : ''} onClick={toggleMobileMenu}>
              {t('nav.events')}
            </Link>
          </li>
          <li>
            <Link to={langPath('/blog')} className={isActiveLink('/blog') ? 'active' : ''} onClick={toggleMobileMenu}>
              {t('nav.blog')}
            </Link>
          </li>
          <li className="mobile-menu__lang">
            {/* Selectionner une langue ici ferme aussi le menu mobile (via onSelect),
                contrairement au dropdown desktop qui reste independant. */}
            <LanguageDropdown variant="mobile" onSelect={() => setMobileMenuOpen(false)} />
          </li>
          <li>
            <Link to={langPath('/contact')} onClick={toggleMobileMenu} className="contact-btn">
              {t('nav.contact')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarComponent;
