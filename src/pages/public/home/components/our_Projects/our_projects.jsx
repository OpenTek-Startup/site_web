import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTranslation } from 'react-i18next';
import { getDocuments, resolveImageUrl } from '../../../../../services/crudServices';
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../../../../config/appwrite';
import { pickLocalized } from '../../../../../i18n/pickLocalized';
import './our_projects.css';

import './our_projects.css';

// Dummy Projects Data (repli si la collection Appwrite est vide/absente)
const dummyProjects = [
  {
    _id: '1',
    title: 'Mobile Weather App',
    shortDescription:
      'A mobile application that delivers real-time weather updates and forecasts, complete with interactive maps and an intuitive interface.',
    heroImages: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Mobile-Application.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9Nb2JpbGUtQXBwbGljYXRpb24uanBnIiwiaWF0IjoxNzQwMDI3NjAxLCJleHAiOjE3NzE1NjM2MDF9.jKKPjnTnojOpTL0kia_l2-xYF4rcWPrs3132_dVKz9E']
  },
  {
    _id: '2',
    title: 'Bidding platform',
    shortDescription:
      'Secure sales Online platform that allows users to bid on products and services, with real-time updates and notifications.',
    heroImages: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/bidding.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9iaWRkaW5nLnBuZyIsImlhdCI6MTc0MDI5NjY4NSwiZXhwIjoxNzcxODMyNjg1fQ.AFoHbcK-nyMUlUrBxzU3nZx074RTS7Ja-AfR3w75qfA']
  },
  {
    _id: '3',
    title: 'Supplier Management System',
    shortDescription:
      'A robust platform that streamlines supplier management, improves procurement processes, and enhances supply chain collaboration.',
    heroImages: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/supplier_selection.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9zdXBwbGllcl9zZWxlY3Rpb24ucG5nIiwiaWF0IjoxNzQwMDUzNzEzLCJleHAiOjE3NzE1ODk3MTN9.wE-QJ0XepGRAwpvaTb7ILjdaKB2chM5_K_x09JUNXm4']
  },
  {
    _id: '4',
    title: 'Warehouse Management System',
    shortDescription:
      'An integrated solution to manage warehouse operations, track inventory levels, and optimize order fulfillment processes across multiple channels.',
    heroImages: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/warehouse_management.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS93YXJlaG91c2VfbWFuYWdlbWVudC5wbmciLCJpYXQiOjE3NDAwNTQ4NDYsImV4cCI6MTc3MTU5MDg0Nn0.AyWfkjdJrXxE5MDwPgU_lepe6GSJGiZaQhiL2ZWAvwQ']
  }
];

const HomeOurPortfolioSection = () => {
  const [projects, setProjects] = useState(dummyProjects);
  const [selected, setSelected] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const loadProjects = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, PROJECTS_COLLECTION_ID);
        if (docs.length > 0) {
          const sorted = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
          setProjects(
            sorted.map((doc) => ({
              _id: doc.$id,
              title: pickLocalized(doc, 'title', i18n.language),
              shortDescription: pickLocalized(doc, 'description', i18n.language),
              heroImages: [doc.coverImage ? resolveImageUrl(doc.coverImage) : ''],
              link: doc.link,
            }))
          );
        }
      } catch {
        // Collection pas encore creee dans Appwrite : on garde le contenu par defaut
      }
    };

    loadProjects();
  }, [i18n.language]);

  return (
    <section id="home-portfolio" className="our-portfolio-section">
      <div className="container">
        <div className="ot-section-header" data-aos="fade-up">
          <span className="ot-eyebrow">{t('portfolioSection.eyebrow')}</span>
          <h2 className="ot-section-title">{t('portfolioSection.title')}</h2>
          <p className="ot-section-subtitle">{t('portfolioSection.subtitle')}</p>
        </div>

        <div className="ot-grid">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="ot-card ot-card--hoverable"
              data-aos="fade-up"
              data-aos-delay={Math.min(index * 80, 320)}
            >
              <div className="ot-image-frame ot-image-frame--16-10">
                {project.heroImages[0] ? (
                  <img src={project.heroImages[0]} alt={project.title} loading="lazy" />
                ) : (
                  <div className="ot-image-frame--placeholder">OpenTek</div>
                )}
              </div>
              <div className="ot-card__body">
                <h3 className="portfolio-card__title">{project.title}</h3>
                <p className="ot-clamp-3 portfolio-card__description">{project.shortDescription}</p>
                <button className="ot-link-btn" onClick={() => setSelected(project)}>
                  {t('common.seeMore')} <span className="ot-link-btn__arrow">&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="ot-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setSelected(null)}>&times;</button>
            {selected.heroImages[0] && (
              <div className="ot-image-frame ot-image-frame--16-9" style={{ borderRadius: 10, marginBottom: 18 }}>
                <img src={selected.heroImages[0]} alt={selected.title} />
              </div>
            )}
            <h3 style={{ marginTop: 0, color: 'var(--text-heading)' }}>{selected.title}</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.7 }}>{selected.shortDescription}</p>
            {selected.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ot-link-btn"
                style={{ marginTop: 12 }}
              >
                {t('portfolioSection.visitProject')} <span className="ot-link-btn__arrow">&rarr;</span>
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeOurPortfolioSection;
