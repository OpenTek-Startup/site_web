/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
// import fullStar from '../../../../assets/icons/full_star.png';
// import halfStar from '../../../../assets/icons/half_star.png';
// import emptyStar from '../../../../assets/icons/empty_star.png';

const TestimonialCard = ({ testimonial }) => {
  const { title, image, name, message } = testimonial;
  return (
    <div className="home-testimonial-card">
      <div className="home-testimonial-img-rating">
        {/* User image/avatar */}
        <img src={image} alt="" width={70} />
      </div>
      <h3 className="name">{name}</h3>
      <p className="title">{title}</p>
      <p>{`" ${message} "`}</p>
    </div>
  );
};

export default TestimonialCard;
