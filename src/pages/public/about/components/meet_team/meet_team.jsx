/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import './meet_team.css';
import ProfileCard from './profile_card/pf_card';
import AOS from 'aos';

const MeetTeamComponent = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="about-meet-team-section">
      <div className="about-meet-team-section-content">
        <div
          className="about-meet-team-section-content-heading"
          data-aos="fade-up"
          data-aos-once="true"
        >
          <h1>Meet the Team</h1>
        </div>
        <div className="about-meet-team-section-content-description">
          <p data-aos="fade-up" data-aos-once="true">
            Our team is composed of talented professionals who are committed to
            driving innovation and excellence. We leverage our diverse skills
            and experiences to create solutions that make a difference in the
            world. Together, we strive to push the boundaries of what&apos;s possible.
          </p>
        </div>
        <div className="about-meet-team-section-content-membersInfo">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
};

export default MeetTeamComponent;
