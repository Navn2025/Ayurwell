import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearReviewError, clearSuccess } from '../../store/slices/review.slice';

const ReviewNotification = () => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.review);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error || success) {
      setIsVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          dispatch(clearReviewError());
          dispatch(clearSuccess());
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(clearReviewError());
      dispatch(clearSuccess());
    }, 300);
  };

  if (!error && !success) return null;

  const notificationType = error ? 'error' : 'success';
  const notificationMessage = error || (success ? 'Review operation completed successfully!' : '');

  const getNotificationStyles = () => {
    const baseStyles = 'fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 z-50';
    
    if (notificationType === 'error') {
      return `${baseStyles} bg-red-50 border border-red-200 text-red-800`;
    } else {
      return `${baseStyles} bg-green-50 border border-green-200 text-green-800`;
    }
  };

  const getIcon = () => {
    if (notificationType === 'error') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div
      className={`${getNotificationStyles()} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">
            {notificationType === 'error' ? 'Error' : 'Success'}
          </p>
          <p className="text-sm mt-1">
            {notificationMessage}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReviewNotification;