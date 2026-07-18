/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import './hero.css';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import { ButtonPrimary } from '../../../../../commons/Button';
import { usePageContent } from '../../../../../i18n/usePageContent';
import { useLangPath } from '../../../../../i18n/useLangPath';

const HomeHeroComponent = () => {
  const { field } = usePageContent('home_hero');
  const langPath = useLangPath();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="home-hero-section">
      {/* Optional overlay for darker background, so text is clearly visible */}
      <div className="home-hero-overlay" />

      <div className="home-hero-content">
        <h1 className="display-lg" data-aos="fade-up" data-aos-once="true">
          {field('title', 'Reinventing the Future with Technology')}
        </h1>
        <p className="body-lg" data-aos="fade-up" data-aos-once="true">
          {field('body', 'Our team merges cutting-edge tools with strategic insight to transform your vision into tangible success—delivering scalable, future-ready solutions that spark innovation, drive growth, and open entirely new avenues for your business.')}
        </p>
        <div
          className="home-hero-section-container-btn-grp"
          data-aos="fade-up"
          data-aos-once="true"
        >
          <Link to={langPath('/contact')}>
            <ButtonPrimary title="Get In Touch" />
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default HomeHeroComponent;
