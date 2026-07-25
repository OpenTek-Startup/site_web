import { useEffect, useState } from 'react';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';

import linkedinIcon from '../../../../../../assets/icons/linkedin.svg';
import githubIcon from '../../../../../../assets/icons/github.svg';
import twitterX from '../../../../../../assets/images/twitter-x.svg';
import defaultProfileImage from '../../../../../../assets/images/defaultProfileImage.svg';

import './pf_card.css';
import { getDocuments, resolveImageUrl } from '../../../../../../services/crudServices';
import { DATABASE_ID, TEAM_COLLECTION_ID } from '../../../../../../config/appwrite';
import { pickLocalized } from '../../../../../../i18n/pickLocalized';

const dummyTeamMembers = [
  {
    _id: 1,
    name: 'Djomo Brown',
    role: 'CEO & Founder',
    bio: '',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/brown_no_bg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL2Jyb3duX25vX2JnLnBuZyIsImlhdCI6MTc0MDI5NDg2MywiZXhwIjoxNzcxODMwODYzfQ.0QKYr-2YgNOHUCiIgCvatz-iXNRvMEhMjanqHQkG5lE',
    socialMediaLinks: [
      { _id: 's1', appName: 'LinkedIn', link: 'https://www.linkedin.com/in/janedoe' },
      { _id: 's2', appName: 'GitHub', link: 'https://github.com/janedoe' }
    ]
  },
  {
    _id: 2,
    name: 'Talita',
    role: 'ML Expert',
    bio: '',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/talitha_no_bg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL3RhbGl0aGFfbm9fYmcucG5nIiwiaWF0IjoxNzQwMjk0OTE1LCJleHAiOjE3NzE4MzA5MTV9.bVmMWzUIlxoeoUCIfis6716318iop06G3St6hD_wTj0',
    socialMediaLinks: [{ _id: 's4', appName: 'GitHub', link: 'https://github.com/johnsmith' }]
  },
  {
    _id: 3,
    name: 'James Brown',
    role: 'Trainer',
    bio: '',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/james_no_bg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL2phbWVzX25vX2JnLnBuZyIsImlhdCI6MTc0MDI5NDk0NiwiZXhwIjoxNzcxODMwOTQ2fQ.TGrq2IAlmDuuM7oaKdWIfPYqP6DfdJlkRlqj6DG3tEE',
    socialMediaLinks: [
      { _id: 's5', appName: 'LinkedIn', link: 'https://www.linkedin.com/in/alicejohnson' },
      { _id: 's6', appName: 'Twitter', link: 'https://twitter.com/alicejohnson' }
    ]
  },
  {
    _id: 4,
    name: 'Alice Taylor',
    role: 'Software Engineer',
    bio: '',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/team/alice_3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS90ZWFtL2FsaWNlXzMucG5nIiwiaWF0IjoxNzQwMjk0ODI0LCJleHAiOjE3NzE4MzA4MjR9.v3XaSVxUzcS6B3EYjNJl7KmDOz9xrxgVGhGnP6wr7Uw',
    socialMediaLinks: [
      { _id: 's7', appName: 'LinkedIn', link: 'https://www.linkedin.com/in/alicejohnson' },
      { _id: 's8', appName: 'Twitter', link: 'https://twitter.com/alicejohnson' }
    ]
  }
];

const ProfileCard = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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
              bio: pickLocalized(doc, 'bio', i18n.language),
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
      setTeamMembers(dummyTeamMembers);
    };

    loadTeam();
  }, [i18n.language]);

  const iconFor = (appName) => {
    if (appName === 'LinkedIn') return linkedinIcon;
    if (appName === 'GitHub') return githubIcon;
    return twitterX;
  };

  return (
    <>
      <div className="ot-grid team-members-grid">
        {teamMembers.map((member, index) => (
          <div
            key={member._id}
            className="ot-card ot-card--hoverable pf_card"
            data-aos="fade-up"
            data-aos-delay={Math.min(index * 80, 320)}
          >
            <div className="ot-image-frame ot-image-frame--1-1">
              <img
                src={member.image || defaultProfileImage}
                alt={member.name}
                loading="lazy"
                onError={(e) => (e.target.src = defaultProfileImage)}
              />
            </div>
            <div className="ot-card__body">
              <span className="pf_card_name">{member.name}</span>
              <p className="pf_card_role">{member.role}</p>

              {member.bio && (
                <>
                  <p className="ot-clamp-3 pf_card_bio">{member.bio}</p>
                  <button className="ot-link-btn pf_card_more" onClick={() => setSelected(member)}>
                    {t('common.seeMore')} <span className="ot-link-btn__arrow">&rarr;</span>
                  </button>
                </>
              )}

              {member.socialMediaLinks?.length > 0 && (
                <div className="pf_card_socials">
                  {member.socialMediaLinks.map((social) => (
                    <a key={social._id} href={social.link} target="_blank" rel="noopener noreferrer">
                      <img src={iconFor(social.appName)} alt={social.appName} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="ot-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setSelected(null)}>&times;</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <img
                src={selected.image || defaultProfileImage}
                alt={selected.name}
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-heading)' }}>{selected.name}</h3>
                <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>{selected.role}</p>
              </div>
            </div>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.7 }}>{selected.bio}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
