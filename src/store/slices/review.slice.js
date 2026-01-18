import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    getProductReviews as getProductReviewsApi,
    createReview as createReviewApi,
    updateReview as updateReviewApi,
    deleteReview as deleteReviewApi,
    rejectReview as rejectReviewApi,
    getAverageRating as getAverageRatingApi,
    getUserReviewForProduct as getUserReviewForProductApi,
    getAllReviews as getAllReviewsApi,
    approveReview as approveReviewApi,
} from "../../api/review.api";

// NOTE: Review routes do NOT exist in backend yet
// These are placeholder functions for future implementation

// Async Thunks
export const getProductReviews=createAsyncThunk(
    "review/getProductReviews",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductReviewsApi(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addReview=createAsyncThunk(
    "review/addReview",
    async (reviewData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createReviewApi(reviewData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const updateReview=createAsyncThunk(
    "review/updateReview",
    async ({reviewId, reviewData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateReviewApi(reviewId, reviewData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const deleteReview=createAsyncThunk(
    "review/deleteReview",
    async (reviewId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteReviewApi(reviewId);
            return {...response, id: reviewId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);
export const rejectReview=createAsyncThunk(
    "review/rejectReview",
    async (reviewId, {rejectWithValue}) =>
    {
        try
        {
            const response=await rejectReviewApi(reviewId);
            return {...response, id: reviewId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);
export const getAverageRating=createAsyncThunk(
    "review/getAverageRating",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAverageRatingApi(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);
export const getUserReviewForProduct=createAsyncThunk(
    "review/getUserReviewForProduct",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getUserReviewForProductApi(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin functions
export const getAllReviews=createAsyncThunk(
    "review/getAllReviews",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllReviewsApi();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const approveReview=createAsyncThunk(
    "review/approveReview",
    async (reviewId, {rejectWithValue}) =>
    {
        try
        {
            const response=await approveReviewApi(reviewId);
            return {...response, id: reviewId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);
const reviewSlice=createSlice({
    name: "review",
    initialState: {
        reviews: [],
        allReviews: [], // For admin panel
        userReview: null, // Current user's review for a product
        averageRating: 0,
        totalReviews: 0,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearSuccess: (state) =>
        {
            state.success=false;
        },
        clearReviews: (state) =>
        {
            state.reviews=[];
            state.averageRating=0;
            state.totalReviews=0;
        },
        clearReviewError: (state) =>
        {
            state.error=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Get Product Reviews
            .addCase(getProductReviews.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(getProductReviews.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.reviews=action.payload.reviews||action.payload;
                state.averageRating=action.payload.averageRating||0;
                state.totalReviews=action.payload.totalReviews||state.reviews.length;
            })
            .addCase(getProductReviews.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch reviews";
            })
            // Add Review
            .addCase(addReview.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
                state.success=false;
            })
            .addCase(addReview.fulfilled, (state, action) =>
            {
                state.loading=false;
                const newReview=action.payload.review||action.payload;
                state.reviews.unshift(newReview);
                state.totalReviews+=1;
                state.success=true;
            })
            .addCase(addReview.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to add review";
            })
            // Update Review
            .addCase(updateReview.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(updateReview.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.review||action.payload;
                const index=state.reviews.findIndex(r => r.id===updated.id);
                if (index!==-1)
                {
                    state.reviews[index]=updated;
                }
                state.success=true;
            })
            .addCase(updateReview.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update review";
            })
            // Delete Review
            .addCase(deleteReview.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(deleteReview.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.reviews=state.reviews.filter(r => r.id!==action.payload.id);
                state.totalReviews-=1;
                state.success=true;
            })
            .addCase(deleteReview.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete review";
            })
            // Reject Review
            .addCase(rejectReview.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(rejectReview.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.reviews=state.reviews.filter(r => r.id!==action.payload.id);
                state.totalReviews-=1;
                state.success=true;
            })
            .addCase(rejectReview.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to reject review";
            })
            // Get Average Rating
            .addCase(getAverageRating.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(getAverageRating.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.averageRating=action.payload.averageRating||0;
            })
            .addCase(getAverageRating.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to get average rating";
            })
            // Get User Review for Product
            .addCase(getUserReviewForProduct.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(getUserReviewForProduct.fulfilled, (state, action) =>
            {
                state.loading=false;
                // Backend returns { review: ... } or { review: null }
                state.userReview=action.payload.review||null;
            })
            .addCase(getUserReviewForProduct.rejected, (state, action) =>
            {
                state.loading=false;
                // Don't set error for 404 (user hasn't reviewed yet)
                if (action.payload?.status!==404)
                {
                    state.error=action.payload?.message||"Failed to get user review";
                }
                state.userReview=null;
            })
            // Get All Reviews (Admin)
            .addCase(getAllReviews.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(getAllReviews.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.allReviews=action.payload.reviews||action.payload;
            })
            .addCase(getAllReviews.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to get all reviews";
            })
            // Approve Review (Admin)
            .addCase(approveReview.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(approveReview.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.success=true;
            })
            .addCase(approveReview.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to approve review";
            });
    },
});

export const {clearError, clearSuccess, clearReviews, clearReviewError}=reviewSlice.actions;
export default reviewSlice.reducer;
