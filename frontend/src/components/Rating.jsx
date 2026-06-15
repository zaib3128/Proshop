import React from 'react';
import PropTypes from 'prop-types';

const Rating = ({ value, text, color = 'text-yellow-500' }) => {
  return (
    <div className="flex items-center">
      {/* Create an array of 5 elements to map over for the stars */}
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          <i
            className={`${color} ${
              value >= star
                ? 'fas fa-star'           // Full star
                : value >= star - 0.5
                ? 'fas fa-star-half-alt'  // Half star
                : 'far fa-star'           // Empty star
            }`}
          ></i>
        </span>
      ))}
      {/* Display the review text if it exists */}
      <span className="ml-2 text-gray-600">{text && text}</span>
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
  color: PropTypes.string,
};

export default Rating;