/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './hero.css';
import { assetRepository } from '../../../../../assets/assetRepository';
import { usePageContent } from '../../../../../i18n/usePageContent';

const AboutHeroComponent = () => {
  const vision = usePageContent('about_vision');
  const mission = usePageContent('about_mission');
  const approach = usePageContent('about_approach');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const items = [
    {
      icon: assetRepository.vision,
      title: vision.field('title', 'Vision'),
      text: vision.field(
        'body',
        'Provide innovative IT solutions that address local challenges while considering real world conditions. We aim to be the leading IT solutions provider in Africa, offering services that are tailored to the unique needs of our clients and the communities.'
      ),
    },
    {
      icon: assetRepository.mission,
      title: mission.field('title', 'Mission'),
      text: mission.field(
        'body',
        'Our mission is not only to provide innovation solutions but also to promote youth participation in the technology sector by offering training and internship opportunities.'
      ),
    },
    {
      icon: assetRepository.goals,
      title: approach.field('title', 'Approach'),
      text: approach.field(
        'body',
        'Our approach is centered around a user-first philosophy. We engage with our clients to understand their unique challenges and opportunities, ensuring that our solutions are not only innovative but also practical and impactful.'
      ),
    },
  ];

  return (
    <section className="about-hero-section">
      <div className="about-hero-container">
        {/* Left Column: Heading & Bullet Points */}
        <div className="about-hero-left" data-aos="fade-up" data-aos-once="true">
          <h2>Our Mission</h2>
          {items.map((item, index) => (
            <div key={index} className="about-hero-item">
              <div className="about-hero-icon">
                <img src={item.icon} alt={`${item.title} icon`} />
              </div>
              <div className="about-hero-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Circular Image */}
        <div className="about-hero-right" data-aos="fade-up" data-aos-once="true">
          <div className="about-hero-image-circle">
            <img src={assetRepository.hero} alt="Team on a mountain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroComponent;
