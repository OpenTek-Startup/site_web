/* eslint-disable react/prop-types */
import { useTranslation } from 'react-i18next';

const ServiceCard = ({ title, description, image, delay, onSeeMore }) => {
  const { t } = useTranslation();
  return (
    <div className="ot-card ot-card--hoverable service-card" data-aos="fade-up" data-aos-delay={delay}>
      <div className="ot-image-frame ot-image-frame--16-10">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className="ot-image-frame--placeholder">OpenTek</div>
        )}
      </div>
      <div className="ot-card__body">
        <h3 className="service-card__title">{title}</h3>
        <p className="ot-clamp-3 service-card__description">{description}</p>
        <button className="ot-link-btn" onClick={onSeeMore}>
          {t('common.seeMore')} <span className="ot-link-btn__arrow">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
