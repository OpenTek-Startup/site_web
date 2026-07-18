/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import './testimonial.css';
import TestimonialCard from './TestimonialCard';
import Skeleton from './skeleton/Skeleton';
import AOS from 'aos';
import { useTranslation } from 'react-i18next';
import { getDocuments, resolveImageUrl } from '../../../../../services/crudServices';
import { DATABASE_ID, TESTIMONIALS_COLLECTION_ID } from '../../../../../config/appwrite';
import { pickLocalized } from '../../../../../i18n/pickLocalized';

const dummyTestimonials = [
  {
    name: 'Michel Claude',
    title: 'CEO, Acme Inc.',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_1.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF8xLmpwZyIsImlhdCI6MTc0MDE4NTcxNCwiZXhwIjoxNzcxNzIxNzE0fQ.D2dtJalZNDfkpKeaQOtfbhXngz4SYIXYw_pZ-YJZxJg',
    message: 'Fantastic experience! The team was responsive and thorough.'
  },
  {
    name: 'Obam Stinson',
    title: 'Founder, Startup Co.',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_2.jfif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF8yLmpmaWYiLCJpYXQiOjE3NDAxODU4NjAsImV4cCI6MTc3MTcyMTg2MH0.mot1ijEsPui2M9OHSFFE_O_Bd55oF4fVy3svpwqiDco',
    message: 'I am very pleased with the outcome. The process was smooth and efficient.'
  },
  {
    name: 'Michael Trump',
    title: 'Project Manager, BigCorp',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF80LnBuZyIsImlhdCI6MTc0MDE4NTkwMiwiZXhwIjoxNzcxNzIxOTAyfQ.GorfRNFDs3UEczLVN44VV4Q0qeJa_77i8YJUFuhTdPc',
    message: 'Professional, innovative, and on time! Highly recommended.'
  },
  {
    name: 'Sarah Williams',
    title: 'Lead Developer, Tech Solutions',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF8zLnBuZyIsImlhdCI6MTc0MDE4NTkyNywiZXhwIjoxNzcxNzIxOTI3fQ.PK6YXFWiv2XqdXNvpChfkpjVW3pEAzfGZGc9FdDSw78',
    message: 'The attention to detail was remarkable. They exceeded every expectation.'
  },
  {
    name: 'David Brown',
    title: 'Product Owner, Innovation Labs',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_5.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF81LnBuZyIsImlhdCI6MTc0MDE4NTk5OCwiZXhwIjoxNzcxNzIxOTk4fQ.5KpaBye2V6qcOLjUgsxj1D5Lf40lJVCoToHjG5ZATKA',
    message: 'Their approach to problem-solving is refreshing. A pleasure to work with!'
  },
  {
    name: 'Emily Davis',
    title: 'Marketing Lead, MarketHub',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF82LnBuZyIsImlhdCI6MTc0MDE4NjAzMSwiZXhwIjoxNzcxNzIyMDMxfQ.eML4pxZtOp2qCgFi7p8eMe8gtS6VippJl2d9j0TvJcw',
    message: 'Communication was clear, and they turned our vision into reality flawlessly.'
  }
];

const HomeTestimonial = () => {
  const listRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1);
  const [isScrolling, setIsScrolling] = useState(true);
  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const loadTestimonials = async () => {
      try {
        const docs = await getDocuments(DATABASE_ID, TESTIMONIALS_COLLECTION_ID);
        if (docs.length > 0) {
          setTestimonial(
            docs.map((doc) => ({
              name: doc.author,
              title: doc.company,
              image: doc.photo ? resolveImageUrl(doc.photo) : '',
              message: pickLocalized(doc, 'content', i18n.language),
            }))
          );
          setLoading(false);
          return;
        }
      } catch {
        // Collection pas encore creee dans Appwrite : on garde le contenu par defaut
      }
      // Repli sur les temoignages par defaut
      setTimeout(() => {
        setTestimonial(dummyTestimonials);
        setLoading(false);
      }, 800);
    };

    loadTestimonials();
  }, [i18n.language]);

  useEffect(() => {
    const list = listRef.current;
    const scrollSpeed = 2;
    let scrollInterval;

    const startScrolling = () => {
      if (!isScrolling) return;
      scrollInterval = setInterval(() => {
        if (list) {
          list.scrollLeft += scrollSpeed * scrollDirection;
          // Update custom scroll progress
          const progress =
            (list.scrollLeft / (list.scrollWidth - list.clientWidth)) * 100;
          setScrollProgress(progress);

          if (list.scrollLeft + list.clientWidth >= list.scrollWidth) {
            setScrollDirection(-1);
          } else if (list.scrollLeft <= 0) {
            setScrollDirection(1);
          }
        }
      }, 16);
    };

    startScrolling();
    return () => clearInterval(scrollInterval);
  }, [scrollDirection, isScrolling]);

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsScrolling(false);
    }
  };

  const handleMouseUp = () => {
    setIsScrolling(true);
  };

  // Update progress if user manually scrolls
  const handleScroll = () => {
    const list = listRef.current;
    if (list) {
      const progress =
        (list.scrollLeft / (list.scrollWidth - list.clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  return (
    <div className="home-testimonial-section">
      {/* Section Heading */}
      <div
        className="home-testimonial-header"
        data-aos="fade-up"
        data-aos-once="true"
      >
        <h1>Our Happy Customers</h1>
        <p>Words of praise by our valuable customers</p>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          <div
            className="home-testimonial-items"
            ref={listRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={handleScroll}
          >
            {testimonial.map((item, index) => (
              <TestimonialCard testimonial={item} key={index} />
            ))}
          </div>
          <div className="custom-scrollbar-container">
            <div
              className="custom-scrollbar"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
        </>
      )}

      {/* Optional sponsors section */}
      <div className="home-sponsors-icons">
        <div className="home-sponsors-icon">
          {/* Add sponsor logos if available */}
        </div>
      </div>
    </div>
  );
};

export default HomeTestimonial;
