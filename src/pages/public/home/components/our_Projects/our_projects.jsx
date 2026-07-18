/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import { ButtonOutlinedBlack, ButtonOutlinedWhite } from '../../../../../commons/Button';
import { useTranslation } from 'react-i18next';
import { getDocuments, resolveImageUrl } from '../../../../../services/crudServices';
import { DATABASE_ID, PROJECTS_COLLECTION_ID } from '../../../../../config/appwrite';
import { pickLocalized } from '../../../../../i18n/pickLocalized';
import { useLangPath } from '../../../../../i18n/useLangPath';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState(dummyProjects);
  const { i18n } = useTranslation();
  const langPath = useLangPath();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

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

  // Auto-slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % projects.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + projects.length) % projects.length);
  };

  const goToSlide = index => {
    setCurrentIndex(index);
  };

  return (
    <section id="home-portfolio" className="our-portfolio-section">
      <div className="portfolio-header" data-aos="fade-down">
        <h1>Our Portfolio</h1>
      </div>
      <div className="slider-section">
        <button className="slider-arrow left-arrow" onClick={prevSlide}>
          &#10094;
        </button>
        <div className="slider-wrapper">
          <div
            className="slider-container"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projects.map(project => (
              <div
                key={project._id}
                className="slider-slide"
                style={{
                  backgroundImage: `url(${project.heroImages[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="slide-overlay" data-aos="fade-up">
                  <div className="slide-content">
                    <h2>{project.title}</h2>
                    <p>{project.shortDescription}</p>
                    <div className="customer-rating">
                      ★★★★★ <span>4.9/5</span>
                    </div>
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <ButtonOutlinedWhite title="See More" />
                      </a>
                    ) : (
                      <Link to={langPath('/')}>
                        <ButtonOutlinedWhite title="See More" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="slider-dots">
            {projects.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
        <button className="slider-arrow right-arrow" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default HomeOurPortfolioSection;