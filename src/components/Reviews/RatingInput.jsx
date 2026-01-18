import React from 'react';

const RatingInput = ({ value, onChange, size = 'md', readonly = false }) => {
  const stars = [1, 2, 3, 4, 5];
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleStarClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating) => {
    if (!readonly) {
      const stars = document.querySelectorAll('.star-input');
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.add('text-yellow-400');
          star.classList.remove('text-gray-300');
        } else {
          star.classList.remove('text-yellow-400');
          star.classList.add('text-gray-300');
        }
      });
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      const stars = document.querySelectorAll('.star-input');
      stars.forEach((star, index) => {
        if (index < value) {
          star.classList.add('text-yellow-400');
          star.classList.remove('text-gray-300');
        } else {
          star.classList.remove('text-yellow-400');
          star.classList.add('text-gray-300');
        }
      });
    }
  };

  return (
    <div 
      className="flex gap-1"
      onMouseLeave={handleMouseLeave}
    >
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className={`star-input transition-colors ${
            star <= value ? 'text-yellow-400' : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'cursor-pointer hover:text-yellow-400'}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readonly}
        >
          <svg
            className={`${sizeClasses[size]} fill-current`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

export default RatingInput;