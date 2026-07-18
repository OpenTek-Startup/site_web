/* eslint-disable no-unused-vars */
import React from 'react';
import AboutHeroComponent from './components/hero_section/hero';
import MeetTeamComponent from './components/meet_team/meet_team';
import './about.css';
import { Seo } from '../../../components/seo/Seo';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Seo
        title="A propos"
        description="Decouvrez OpenTek, notre mission, notre vision et l'equipe qui developpe des solutions technologiques accessibles a tous."
        path="/about"
      />
      <AboutHeroComponent />
      <MeetTeamComponent />
    </div>
  );
};

export default AboutPage;
