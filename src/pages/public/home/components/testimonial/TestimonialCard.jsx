/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next';

const Star = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill={filled ? '#f5b400' : '#e2e5ea'}>
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
  </svg>
);

const TestimonialCard = ({ testimonial, onReadMore }) => {
  const { t } = useTranslation();
  const { title, image, name, message, rating } = testimonial;

  return (
    <div className="ot-card ot-card--hoverable home-testimonial-card">
      <div className="ot-card__body">
        {rating > 0 && (
          <div className="home-testimonial-card__stars">
            {[1, 2, 3, 4, 5].map((n) => <Star key={n} filled={n <= rating} />)}
          </div>
        )}
        <p className="ot-clamp-4 home-testimonial-card__message">&ldquo;{message}&rdquo;</p>
        <button className="ot-link-btn home-testimonial-card__more" onClick={onReadMore}>
          {t('common.seeMore')} <span className="ot-link-btn__arrow">&rarr;</span>
        </button>
        <div className="home-testimonial-card__author">
          <img src={image} alt={name} width={44} height={44} />
          <div>
            <h3 className="name">{name}</h3>
            {title && <p className="title">{title}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
