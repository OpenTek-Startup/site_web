/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';

// Replace these with your local icons
import linkedinIcon from '../../../../../../assets/icons/linkedin.svg';
import githubIcon from '../../../../../../assets/icons/github.svg'; 
import twitterX from '../../../../../../assets/images/twitter-x.svg';
import defaultProfileImage from '../../../../../../assets/images/defaultProfileImage.svg';

// Import the CSS
import './pf_card.css';
import { getDocuments, resolveImageUrl } from '../../../../../../services/crudServices';
import { DATABASE_ID, TEAM_COLLECTION_ID } from '../../../../../../config/appwrite';
import { useTranslation } from 'react-i18next';
import { pickLocalized } from '../../../../../../i18n/pickLocalized';

// Remove any skeleton or error handling if you only want to display static data
// import TeamSkeleton from '../skeleton/TeamSkeleton';

const ProfileCard = () => {
  // Dummy data for demonstration
  const dummyTeamMembers = [
    {
      _id: 1,
      name: 'Djomo Brown',
      role: 'CEO & Founder',
      image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/brown_no_bg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL2Jyb3duX25vX2JnLnBuZyIsImlhdCI6MTc0MDI5NDg2MywiZXhwIjoxNzcxODMwODYzfQ.0QKYr-2YgNOHUCiIgCvatz-iXNRvMEhMjanqHQkG5lE',
      socialMediaLinks: [
        {
          _id: 's1',
          appName: 'LinkedIn',
          link: 'https://www.linkedin.com/in/janedoe'
        },
        {
          _id: 's2',
          appName: 'GitHub', 
          link: 'https://github.com/janedoe'
        }
      ]
    },
    {
      _id: 2,
      name: 'Talita',
      role: 'ML Expert',
      image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/talitha_no_bg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL3RhbGl0aGFfbm9fYmcucG5nIiwiaWF0IjoxNzQwMjk0OTE1LCJleHAiOjE3NzE4MzA5MTV9.bVmMWzUIlxoeoUCIfis6716318iop06G3St6hD_wTj0',
      socialMediaLinks: [
        {
          _id: 's4',
          appName: 'GitHub',
          link: 'https://github.com/johnsmith'
        }
      ]
    },
    {
      _id: 3,
      name: 'James Brown',
      role: 'Trainer',
      image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/james_no_bg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL2phbWVzX25vX2JnLnBuZyIsImlhdCI6MTc0MDI5NDk0NiwiZXhwIjoxNzcxODMwOTQ2fQ.TGrq2IAlmDuuM7oaKdWIfPYqP6DfdJlkRlqj6DG3tEE', // Will fallback to defaultProfileImage
      socialMediaLinks: [
        {
          _id: 's5',
          appName: 'LinkedIn',
          link: 'https://www.linkedin.com/in/alicejohnson'
        },
        {
          _id: 's6',
          appName: 'Twitter',
          link: 'https://twitter.com/alicejohnson'
        }
      ]
    },
    {
      _id: 4,
      name: 'Alice Taylor',
      role: 'Software Engineer',
      image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/alice_3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL2FsaWNlXzMucG5nIiwiaWF0IjoxNzQwMjk0ODI0LCJleHAiOjE3NzE4MzA4MjR9.v3XaSVxUzcS6B3EYjNJl7KmDOz9xrxgVGhGnP6wr7Uw', 
      socialMediaLinks: [
        {
          _id: 's7',
          appName: 'LinkedIn',
          link: 'https://www.linkedin.com/in/alicejohnson'
        },
        {
          _id: 's8',
          appName: 'Twitter',
          link: 'https://twitter.com/alicejohnson'
        }
      ]
    }
  ];

  const [teamMembers, setTeamMembers] = useState([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const loadTeam = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, TEAM_COLLECTION_ID);
        if (docs.length > 0) {
          const sorted = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
          setTeamMembers(
            sorted.map((doc) => ({
              _id: doc.$id,
              name: doc.name,
              role: pickLocalized(doc, 'role', i18n.language),
              image: doc.photo ? resolveImageUrl(doc.photo) : '',
              socialMediaLinks: doc.linkedin
                ? [{ _id: `${doc.$id}-linkedin`, appName: 'LinkedIn', link: doc.linkedin }]
                : [],
            }))
          );
          return;
        }
      } catch {
        // Collection pas encore creee dans Appwrite : on garde le contenu par defaut
      }
      // Repli sur les membres par defaut
      setTimeout(() => {
        setTeamMembers(dummyTeamMembers);
      }, 500);
    };

    loadTeam();
  }, [i18n.language]);

  return (
    <div className="team-members-grid">
      {teamMembers.map((member) => (
        <div
          key={member._id}
          className="pf_card"
          data-aos="zoom-in"
          data-aos-once="true"
        >
          <Link to='/about'>
            <img
              src={member.image || defaultProfileImage}
              className="pf_card_image"
              alt={member.name}
              onError={(e) => (e.target.src = defaultProfileImage)} // Fallback image if there's an error
            />
          </Link>
          <div className="pf_card_member_details">
            <div className="pf_card_info">
              <span className="pf_card_name">{member.name}</span>
              <p className="pf_card_role">{member.role}</p>
            </div>
            <div className="pf_card_socials">
              {member.socialMediaLinks?.map((social) => {
                let icon;
                if (social.appName === 'LinkedIn') {
                  icon = linkedinIcon;
                } else if (social.appName === 'GitHub') {
                  icon = githubIcon;
                } else {
                  // Catch-all for "Twitter" or other social
                  icon = twitterX;
                }
                return (
                  <a
                    key={social._id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={icon} alt={social.appName} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileCard;
