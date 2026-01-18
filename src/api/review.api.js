import axiosInstance from "../config/axios.config";

// Product Reviews
export const getProductReviews=(productId) =>
    axiosInstance.get(`/review/product/${productId}`);

export const getAverageRating=(productId) =>
    axiosInstance.get(`/review/product/${productId}/average-rating`);

export const getUserReviewForProduct=(productId) =>
    axiosInstance.get(`/review/product/${productId}/user-review`);

// Review CRUD
export const createReview=(reviewData) =>
    axiosInstance.post("/review", reviewData);

export const updateReview=(reviewId, reviewData) =>
    axiosInstance.put(`/review/${reviewId}`, reviewData);

export const deleteReview=(reviewId) =>
    axiosInstance.delete(`/review/${reviewId}`);

// Admin Review Management
export const getAllReviews=() =>
    axiosInstance.get("/review/admin/all");

export const approveReview=(reviewId) =>
    axiosInstance.post(`/review/admin/${reviewId}/approve`);

export const rejectReview=(reviewId) =>
    axiosInstance.post(`/review/${reviewId}/reject`);
