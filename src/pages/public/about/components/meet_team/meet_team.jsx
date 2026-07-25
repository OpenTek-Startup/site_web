import { useEffect } from 'react';
import './meet_team.css';
import ProfileCard from './profile_card/pf_card';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';

const MeetTeamComponent = () => {
  const { t } = useTranslation();

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
          <h1>{t('aboutPage.teamHeading')}</h1>
        </div>
        <div className="about-meet-team-section-content-description">
          <p data-aos="fade-up" data-aos-once="true">
            {t('aboutPage.teamDescription')}
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
