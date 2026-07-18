/* eslint-disable no-unused-vars */
import React from 'react';
import HomeHeroComponent from './components/hero_section/hero';
import HomePageAboutComponent from './components/about_section/about';
import WhatWeDoComponent from './components/Our_services/homeService';
import HomeOurWroksSection from './components/our_Projects/our_projects';
import './home.css';
import HomeTestimonial from './components/testimonial';
import CoreValues from './components/CoreValues/coreValues';
import { Seo, organizationJsonLd } from '../../../components/seo/Seo';

const HomePage = () => {
  return (
    <div className="home-page">
      <Seo
        title="Accueil"
        description="OpenTek concoit des solutions web, mobiles, ERP et IA sur mesure. Technology open to everyone."
        path="/"
        jsonLd={organizationJsonLd}
      />
      <HomeHeroComponent />
      <HomePageAboutComponent />
      <WhatWeDoComponent />
      <CoreValues/>
      <HomeOurWroksSection />
      <HomeTestimonial />
    </div>
  );
};

export default HomePage;
