import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/images/opentek.png';
import facebook from '../../assets/icons/Facebook.svg';
import linkedIn from '../../assets/icons/linkedin.svg';
import github from '../../assets/icons/github.svg';
import twitter from '../../assets/icons/prime_twitter.svg';
import { Link, useLocation } from 'react-router-dom';
import { useLangPath } from '../../i18n/useLangPath';
import { useSiteSettings } from '../../i18n/useSiteSettings';
import './footer.css';

const FooterComponent = () => {
  const { t } = useTranslation();
  const currentLocation = useLocation();
  const langPath = useLangPath();
  const siteSettings = useSiteSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const isActive = (path) =>
    path === '/'
      ? currentLocation.pathname === langPath('/')
      : currentLocation.pathname.includes(path);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Pas encore de backend de newsletter branche - evite juste que le
    // formulaire recharge la page. A brancher sur un service d'emailing
    // (Mailchimp, Brevo...) ou une collection Appwrite si besoin plus tard.
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="footer-component">
      <div className="footer-container">
        {/* Top Row: Brand & Optional Contact Info */}
        <div className="footer-top-row">
          <div className="footer-brand">
            <img src={logo} alt="OpenTek Logo" />
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="footer-contact-info">
            <p>Mobile: {siteSettings.contactPhone}</p>
            <p>Email: {siteSettings.contactEmail}</p>
          </div>
        </div>

        {/* Middle Row: Columns (Programs, Service, Contact, Newsletter) */}
        <div className="footer-main-row">
          <div className="footer-column">
            <h4>{t('footer.programsTitle')}</h4>
            <ul>
              <li><Link to={langPath('/about')}>{t('footer.programCorporate')}</Link></li>
              <li><Link to={langPath('/about')}>{t('footer.programOneToOne')}</Link></li>
              <li><Link to={langPath('/events')}>{t('footer.programMeetups')}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>{t('footer.serviceTitle')}</h4>
            <ul>
              <li><Link to={langPath('/')}>{t('footer.serviceTraining')}</Link></li>
              <li><Link to={langPath('/')}>{t('footer.serviceCoaching')}</Link></li>
              <li><Link to={langPath('/contact')}>{t('footer.serviceConsulting')}</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>{t('footer.sectionsTitle')}</h4>
            <ul>
              <li>
                <Link to={langPath('/')} className={isActive('/') ? 'active-footer-link' : ''}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to={langPath('/about')} className={isActive('/about') ? 'active-footer-link' : ''}>
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to={langPath('/')} className={isActive('/portfolio') ? 'active-footer-link' : ''}>
                  {t('nav.projects')}
                </Link>
              </li>
              <li>
                <Link to={langPath('/')} className={isActive('/services') ? 'active-footer-link' : ''}>
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to={langPath('/contact')} className={isActive('/contact') ? 'active-footer-link' : ''}>
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column newsletter-column">
            <h4>{t('footer.newsletterTitle')}</h4>
            {subscribed ? (
              <p className="footer-newsletter-success">Merci pour votre inscription !</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder={t('footer.newsletterPlaceholder')}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit">{t('footer.newsletterSubmit')}</button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row: Social Icons & Copyright */}
        <div className="footer-bottom-row">
          <div className="footer-social">
            <ul>
              {siteSettings.linkedinUrl && (
                <li>
                  <a href={siteSettings.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <img src={linkedIn} alt="LinkedIn" />
                  </a>
                </li>
              )}
              {siteSettings.twitterUrl && (
                <li>
                  <a href={siteSettings.twitterUrl} target="_blank" rel="noopener noreferrer">
                    <img src={twitter} alt="Twitter" />
                  </a>
                </li>
              )}
              {siteSettings.facebookUrl && (
                <li>
                  <a href={siteSettings.facebookUrl} target="_blank" rel="noopener noreferrer">
                    <img src={facebook} alt="Facebook" />
                  </a>
                </li>
              )}
              {siteSettings.githubUrl && (
                <li>
                  <a href={siteSettings.githubUrl} target="_blank" rel="noopener noreferrer">
                    <img src={github} alt="Github" />
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="footer-copy">
            <p>
              {t('footer.rights')} <span>&copy;</span> {new Date().getFullYear()}, OpenTek
              {' · '}
              <Link to={langPath('/legal')}>{t('footer.legalLink')}</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
