/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import './homeService.css';

const ServiceCard = ({ title, description, image, delay }) => {
  return (
    <div
      className="service-card"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="service-card-img-wrapper">
        <img src={image} alt={title} />
      </div>
      <div className="service-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
