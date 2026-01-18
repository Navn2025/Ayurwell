import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviews, rejectReview } from '../../store/slices/review.slice';
import RatingInput from './RatingInput';

const AdminReviewPanel = () => {
  const dispatch = useDispatch();
  const { allReviews, loading } = useSelector((state) => state.review);
  
  const [filter, setFilter] = useState('all'); // all, approved, pending, rejected
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  
  const reviewsPerPage = 10;

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const filteredReviews = allReviews?.filter(review => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'approved' && review.isApproved) ||
      (filter === 'pending' && !review.isApproved) ||
      (filter === 'rejected' && review.isRejected);
    
    const matchesSearch = 
      review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }) || [];

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  const handleApproveReview = async (reviewId) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();
      dispatch(getAllReviews()); // Refresh reviews
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleRejectReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to reject this review?')) {
      return;
    }
    
    try {
      await dispatch(rejectReview(reviewId)).unwrap();
      dispatch(getAllReviews()); // Refresh reviews
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (review) => {
    if (review.isRejected) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejected</span>;
    } else if (review.isApproved) {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approved</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <div className="text-sm text-gray-500">
          Total Reviews: {allReviews?.length || 0}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by product, user, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Filter */}
          <div className="flex gap-2">
            {['all', 'approved', 'pending', 'rejected'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : paginatedReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {review.product?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        SKU: {review.product?.sku || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {review.user?.firstName} {review.user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {review.user?.email}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RatingInput value={review.rating} readonly={true} size="sm" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">
                        {review.comment || 'No comment'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(review)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        {!review.isApproved && !review.isRejected && (
                          <>
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectReview(review.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + reviewsPerPage, filteredReviews.length)} of{' '}
            {filteredReviews.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Review Details</h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product</h3>
                  <p className="text-gray-900">{selectedReview.product?.name}</p>
                  <p className="text-sm text-gray-500">SKU: {selectedReview.product?.sku}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reviewer</h3>
                  <p className="text-gray-900">
                    {selectedReview.user?.firstName} {selectedReview.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedReview.user?.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                  <RatingInput value={selectedReview.rating} readonly={true} size="md" />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Comment</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.comment}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-gray-700">{formatDate(selectedReview.createdAt)}</p>
                  {selectedReview.updatedAt !== selectedReview.createdAt && (
                    <p className="text-sm text-gray-500">Last updated: {formatDate(selectedReview.updatedAt)}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  {getStatusBadge(selectedReview)}
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  {!selectedReview.isApproved && !selectedReview.isRejected && (
                    <>
                      <button
                        onClick={() => {
                          handleApproveReview(selectedReview.id);
                          setSelectedReview(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleRejectReview(selectedReview.id);
                          setSelectedReview(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewPanel;