import { useEffect, useState } from 'react';
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
    message: 'Fantastic experience! The team was responsive and thorough.',
    rating: 5
  },
  {
    name: 'Obam Stinson',
    title: 'Founder, Startup Co.',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_2.jfif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF8yLmpmaWYiLCJpYXQiOjE3NDAxODU4NjAsImV4cCI6MTc3MTcyMTg2MH0.mot1ijEsPui2M9OHSFFE_O_Bd55oF4fVy3svpwqiDco',
    message: 'I am very pleased with the outcome. The process was smooth and efficient.',
    rating: 5
  },
  {
    name: 'Michael Trump',
    title: 'Project Manager, BigCorp',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF80LnBuZyIsImlhdCI6MTc0MDE4NTkwMiwiZXhwIjoxNzcxNzIxOTAyfQ.GorfRNFDs3UEczLVN44VV4Q0qeJa_77i8YJUFuhTdPc',
    message: 'Professional, innovative, and on time! Highly recommended.',
    rating: 5
  },
  {
    name: 'Sarah Williams',
    title: 'Lead Developer, Tech Solutions',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF8zLnBuZyIsImlhdCI6MTc0MDE4NTkyNywiZXhwIjoxNzcxNzIxOTI3fQ.PK6YXFWiv2XqdXNvpChfkpjVW3pEAzfGZGc9FdDSw78',
    message: 'The attention to detail was remarkable. They exceeded every expectation.',
    rating: 5
  },
  {
    name: 'David Brown',
    title: 'Product Owner, Innovation Labs',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_5.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF81LnBuZyIsImlhdCI6MTc0MDE4NTk5OCwiZXhwIjoxNzcxNzIxOTk4fQ.5KpaBye2V6qcOLjUgsxj1D5Lf40lJVCoToHjG5ZATKA',
    message: 'Their approach to problem-solving is refreshing. A pleasure to work with!',
    rating: 5
  },
  {
    name: 'Emily Davis',
    title: 'Marketing Lead, MarketHub',
    image: 'https://pabknujhuvddpwgamuli.supabase.co/storage/v1/object/sign/OpentekWebsite/Testimonial/testimonial_6.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJPcGVudGVrV2Vic2l0ZS9UZXN0aW1vbmlhbC90ZXN0aW1vbmlhbF82LnBuZyIsImlhdCI6MTc0MDE4NjAzMSwiZXhwIjoxNzcxNzIyMDMxfQ.eML4pxZtOp2qCgFi7p8eMe8gtS6VippJl2d9j0TvJcw',
    message: 'Communication was clear, and they turned our vision into reality flawlessly.',
    rating: 5
  }
];

const HomeTestimonial = () => {
  const [loading, setLoading] = useState(true);
  const [testimonial, setTestimonial] = useState([]);
  const [selected, setSelected] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

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
              rating: doc.rating || 0,
            }))
          );
          setLoading(false);
          return;
        }
      } catch {
        // Collection pas encore creee dans Appwrite : on garde le contenu par defaut
      }
      setTestimonial(dummyTestimonials);
      setLoading(false);
    };

    loadTestimonials();
  }, [i18n.language]);

  return (
    <div className="home-testimonial-section">
      <div className="container">
        <div className="ot-section-header" data-aos="fade-up">
          <span className="ot-eyebrow">{t('testimonialsSection.eyebrow')}</span>
          <h2 className="ot-section-title">{t('testimonialsSection.title')}</h2>
          <p className="ot-section-subtitle">{t('testimonialsSection.subtitle')}</p>
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <div className="ot-grid">
            {testimonial.map((item, index) => (
              <TestimonialCard testimonial={item} key={index} onReadMore={() => setSelected(item)} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="ot-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ot-modal__close" onClick={() => setSelected(null)}>&times;</button>
            <p style={{ color: 'var(--text-body)', lineHeight: 1.8, fontSize: 16 }}>
              &ldquo;{selected.message}&rdquo;
            </p>
            <div className="home-testimonial-card__author" style={{ marginTop: 20 }}>
              <img src={selected.image} alt={selected.name} width={48} height={48} />
              <div>
                <h3 className="name">{selected.name}</h3>
                {selected.title && <p className="title">{selected.title}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTestimonial;
