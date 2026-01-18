import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteReview} from '../../store/slices/review.slice';
import ReviewForm from './ReviewForm';
import RatingInput from './RatingInput';

const ReviewList=({productId, reviews, currentUser, onReviewUpdated}) =>
{
  const dispatch=useDispatch();
  const {loading}=useSelector((state) => state.review);

  const [editingReview, setEditingReview]=useState(null);
  const [deletingReviewId, setDeletingReviewId]=useState(null);

  const handleEditReview=(review) =>
  {
    setEditingReview(review);
  };

  const handleCancelEdit=() =>
  {
    setEditingReview(null);
  };

  const handleDeleteReview=async (reviewId) =>
  {
    if (!window.confirm('Are you sure you want to delete this review?'))
    {
      return;
    }

    setDeletingReviewId(reviewId);

    try
    {
      await dispatch(deleteReview(reviewId)).unwrap();
      onReviewUpdated&&onReviewUpdated();
    } catch (error)
    {
      // Error is handled by Redux slice
    } finally
    {
      setDeletingReviewId(null);
    }
  };

  const handleReviewSuccess=() =>
  {
    setEditingReview(null);
    onReviewUpdated&&onReviewUpdated();
  };

  const formatDate=(dateString) =>
  {
    const date=new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserInitials=(firstName, lastName) =>
  {
    return `${firstName?.charAt(0)||''}${lastName?.charAt(0)||''}`.toUpperCase();
  };

  const getUserName=(firstName, lastName) =>
  {
    return `${firstName||''} ${lastName||''}`.trim()||'Anonymous';
  };

  if (editingReview)
  {
    return (
      <ReviewForm
        productId={productId}
        existingReview={editingReview}
        onCancel={handleCancelEdit}
        onSuccess={handleReviewSuccess}
      />
    );
  }

  if (!reviews||reviews.length===0)
  {
    return (
      <div className="text-center py-8">
        <div className="text-[#1a472a] mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-[#1a472a]">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.isArray(reviews) && reviews.map((review) =>
      {
        const isCurrentUserReview=currentUser&&review&&review.userId===currentUser.id;
        if (review && review.isApproved===false)
        {
          if (!isCurrentUserReview)
          {
            return null;
          }
        }

        return (
          <div
            key={review?.id || Math.random()}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  {getUserInitials(review?.user?.firstName, review?.user?.lastName)}
                </div>

                {/* User Info */}
                <div>
                  <div className="font-medium text-gray-900">
                    {getUserName(review?.user?.firstName, review?.user?.lastName)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(review?.createdAt)}
                    {review?.updatedAt!==review?.createdAt&&(
                      <span className="ml-1">(edited)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Actions */}
              {isCurrentUserReview&&(
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review?.id)}
                    disabled={deletingReviewId===review.id}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingReviewId===review?.id? 'Deleting...':'Delete'}
                  </button>
                </div>
              )}
            </div>


            {/* Rating */}
            <div className="mb-3">
              <RatingInput
                value={review?.rating || 0}
                readonly={true}
                size="sm"
              />
            </div>

            {/* Review Comment */}
            <div className="text-gray-700 leading-relaxed">
              {review?.comment || ''}
            </div>

            {/* Review Status (for admin reference) */}
            {!review?.isApproved&&(
              <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending Approval
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;