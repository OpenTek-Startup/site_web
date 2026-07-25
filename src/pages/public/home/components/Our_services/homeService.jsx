// WhatWeDoComponent.jsx
import './homeService.css';
import ServiceCard from './HomeServiceCard';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';
import { getDocuments, resolveImageUrl } from '../../../../../services/crudServices';
import { DATABASE_ID, SERVICES_COLLECTION_ID } from '../../../../../config/appwrite';
import { pickLocalized } from '../../../../../i18n/pickLocalized';

const dummyServices = [
  {
    title: 'Web Development',
    shortDescription: 'We build modern, responsive, and scalable web solutions tailored to your unique needs.',
    gallery: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/web-development.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS93ZWItZGV2ZWxvcG1lbnQuanBnIiwiaWF0IjoxNzQwMDE1OTAxLCJleHAiOjE3NzE1NTE5MDF9.hIK3tpz9f0lm4aglf91v41ddliSBq83QcWHvL1VmqFk']
  },
  {
    title: 'Enterprise Resource Planning',
    shortDescription: 'Integrate business processes and enhance efficiency with our comprehensive ERP solutions.',
    gallery: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/ERP_Dashboard.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9FUlBfRGFzaGJvYXJkLnBuZyIsImlhdCI6MTc0MDAxNjQ5NSwiZXhwIjoxNzcxNTUyNDk1fQ.sHMQdvldNBqOFL-DaVbpTodda7x1cGtMCv47aSdGAZg']
  },
  {
    title: 'Mobile Application Development',
    shortDescription: 'Create seamless mobile experiences on iOS and Android with a user-first approach.',
    gallery: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Mobile-Application.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9Nb2JpbGUtQXBwbGljYXRpb24uanBnIiwiaWF0IjoxNzQwMDE2NjMzLCJleHAiOjE3NzE1NTI2MzN9.YrNOJrp5u9SOC6qLX9nyAEtNIzBdtpWoqGPu_VS0F0Q']
  },
  {
    title: 'AI & Machine Learning',
    shortDescription: 'Harness the power of data-driven insights and intelligent automation to elevate your business.',
    gallery: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/hero-3.jfif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9oZXJvLTMuamZpZiIsImlhdCI6MTc0MDAxNDE3MSwiZXhwIjoxNzcxNTUwMTcxfQ.FKv9v8gYJ0xUjWgXOGUy4SvhNiGBa8ZTZB9omtSuhJA']
  },
  {
    title: 'UI/UX Design',
    shortDescription: 'Craft beautiful, intuitive interfaces that drive engagement and delight users at every turn.',
    gallery: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/ui-ux.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS91aS11eC5qcGciLCJpYXQiOjE3NDAwMTY5NDcsImV4cCI6MTc3MTU1Mjk0N30.1Thc5SELlytv9yublQyaC8Q4T6rWXVRwu265_I-pUhQ']
  },
  {
    title: 'Social Media Platform',
    shortDescription: 'Engage and grow your audience with our innovative and scalable social media platform solutions.',
    gallery: ['https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/social-media.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9zb2NpYWwtbWVkaWEucG5nIiwiaWF0IjoxNzQwMDE3MjgxLCJleHAiOjE3NzE1NTMyODF9.w29HAyGNCT2UzJYaw98Al_nt3DPaIfY8Q4vZ5K4o5AY']
  }
];

const WhatWeDoComponent = () => {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const loadServices = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, SERVICES_COLLECTION_ID);
        if (docs.length > 0) {
          const sorted = [...docs].sort((a, b) => (a.order || 0) - (b.order || 0));
          setServices(
            sorted.map((doc) => ({
              title: pickLocalized(doc, 'title', i18n.language),
              shortDescription: pickLocalized(doc, 'description', i18n.language),
              gallery: [doc.icon ? resolveImageUrl(doc.icon) : ''],
            }))
          );
          return;
        }
      } catch {
        // Collection pas encore creee dans Appwrite : on garde le contenu par defaut
      }
      setServices(dummyServices);
    };

    loadServices();
  }, [i18n.language]);

  return (
    <div id="our-services" className="home-what-we-do-section-container">
      <div className="home-what-we-do-section-wrapper-x container">
        <div className="ot-section-header" data-aos="fade-up">
          <span className="ot-eyebrow">{t('servicesSection.eyebrow')}</span>
          <h2 className="ot-section-title">{t('servicesSection.title')}</h2>
          <p className="ot-section-subtitle">{t('servicesSection.subtitle')}</p>
        </div>

        <div className="ot-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.shortDescription}
              image={service.gallery[0]}
              delay={Math.min(index * 80, 320)}
              onSeeMore={() => setSelected(service)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <div className="ot-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setSelected(null)}>&times;</button>
            {selected.gallery[0] && (
              <div className="ot-image-frame ot-image-frame--16-9" style={{ borderRadius: 10, marginBottom: 18 }}>
                <img src={selected.gallery[0]} alt={selected.title} />
              </div>
            )}
            <h3 style={{ marginTop: 0, color: 'var(--text-heading)' }}>{selected.title}</h3>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.7 }}>{selected.shortDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatWeDoComponent;
