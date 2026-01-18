import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RatingInput from './RatingInput';
import { addReview, updateReview, clearReviewError } from '../../store/slices/review.slice';

const ReviewForm = ({ productId, existingReview = null, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.review);
  
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [touched, setTouched] = useState({ rating: false, comment: false });
  const [purchaseValidationError, setPurchaseValidationError] = useState('');

  useEffect(() => {
    if (error) {
      setTimeout(() => dispatch(clearReviewError()), 5000);
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newTouched = { rating: true, comment: true };
    setTouched(newTouched);
    
    if (rating === 0) {
      return false;
    }
    
    if (!comment.trim() || comment.trim().length < 10) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const reviewData = {
      productId,
      rating,
      comment: comment.trim()
    };

    try {
      let result;
      if (existingReview) {
        result = await dispatch(updateReview({ 
          reviewId: existingReview.id, 
          reviewData 
        })).unwrap();
      } else {
        result = await dispatch(addReview(reviewData)).unwrap();
      }

      if (result.success || result.review) {
        onSuccess && onSuccess();
        // Reset form for new reviews
        if (!existingReview) {
          setRating(0);
          setComment('');
          setTouched({ rating: false, comment: false });
        }
      }
    } catch (err) {
      // Handle specific backend errors
      if (err?.message?.includes('purchased and received')) {
        setPurchaseValidationError(err.message);
      }
    }
  };

  const getErrorMessage = () => {
    if (purchaseValidationError) return purchaseValidationError;
    if (error) return error;
    
    if (touched.rating && rating === 0) {
      return 'Please select a rating';
    }
    
    if (touched.comment && (!comment.trim() || comment.trim().length < 10)) {
      return 'Comment must be at least 10 characters long';
    }
    
    return '';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      {!existingReview && (
        <p className="text-sm text-gray-600 mb-4">
          You can only review products you have purchased and received.
        </p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <RatingInput
            value={rating}
            onChange={setRating}
            size="lg"
          />
          {touched.rating && rating === 0 && (
            <p className="mt-1 text-sm text-red-600">Please select a rating</p>
          )}
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onBlur={() => setTouched({ ...touched, comment: true })}
            placeholder="Share your experience with this product..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              touched.comment && (!comment.trim() || comment.trim().length < 10)
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            disabled={loading}
          />
          {touched.comment && (!comment.trim() || comment.trim().length < 10) && (
            <p className="mt-1 text-sm text-red-600">
              Review must be at least 10 characters long
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {comment.trim().length}/10 minimum characters
          </p>
        </div>

        {/* Error Message */}
        {getErrorMessage() && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {getErrorMessage()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || rating === 0 || !comment.trim() || comment.trim().length < 10}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {existingReview ? 'Updating...' : 'Submitting...'}
              </span>
            ) : (
              existingReview ? 'Update Review' : 'Submit Review'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;