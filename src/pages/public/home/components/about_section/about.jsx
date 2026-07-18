import './about.css';
import { useEffect } from 'react';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';
import './button.css';
import { usePageContent } from '../../../../../i18n/usePageContent';

const HomePageAboutComponent = () => {
  const { field } = usePageContent('home_about');
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Scroll to the element with id "home-portfolio"
  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('home-portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.error('Portfolio section not found!');
    }
  };

  return (
    <div
      className="container home-about-section-container"
      data-aos="fade-up"
      data-aos-once="true"
    >
      <p>
        {field('body', 'We harness innovation to transform bold ideas into impactful solutions. With a focus on speed and quality, we guide your success, building solutions that adapt to an ever-evolving digital world.')}
      </p>
      <button className='btn-primary' onClick={scrollToPortfolio}>{t('common.seeMore')}</button>
    </div>
  );
};

export default HomePageAboutComponent;
