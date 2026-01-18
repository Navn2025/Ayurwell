import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    initiatePayment,
    verifyPayment
} from "../../api/payment.api";
import {getAllPayments, getPaymentDetails} from "../../api/admin.api";

// Async Thunks
export const startPayment=createAsyncThunk(
    "payment/startPayment",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await initiatePayment(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const confirmPayment=createAsyncThunk(
    "payment/confirmPayment",
    async (paymentData, {rejectWithValue}) =>
    {
        try
        {
            const response=await verifyPayment(paymentData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin: Fetch all payments
export const fetchAllPayments=createAsyncThunk(
    "payment/fetchAllPayments",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllPayments(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin: Fetch payment details
export const fetchPaymentDetails=createAsyncThunk(
    "payment/fetchPaymentDetails",
    async (paymentId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getPaymentDetails(paymentId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const paymentSlice=createSlice({
    name: "payment",
    initialState: {
        payments: [],
        currentPayment: null,
        paymentDetails: null,
        paymentStatus: null,
        razorpayOrderId: null,
        loading: false,
        error: null,
        paymentSuccess: false,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearPaymentState: (state) =>
        {
            state.paymentDetails=null;
            state.paymentStatus=null;
            state.razorpayOrderId=null;
            state.paymentSuccess=false;
            state.error=null;
        },
        clearCurrentPayment: (state) =>
        {
            state.currentPayment=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Start Payment
            .addCase(startPayment.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
                state.paymentSuccess=false;
            })
            .addCase(startPayment.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.paymentDetails=action.payload;
                state.razorpayOrderId=action.payload.razorpayOrderId||action.payload.orderId;
            })
            .addCase(startPayment.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to initiate payment";
            })
            // Confirm Payment
            .addCase(confirmPayment.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(confirmPayment.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.paymentStatus=action.payload.status||"SUCCESS";
                state.paymentSuccess=true;
            })
            .addCase(confirmPayment.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Payment verification failed";
                state.paymentStatus="FAILED";
            })
            // Fetch All Payments (Admin)
            .addCase(fetchAllPayments.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllPayments.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.payments=action.payload.payments||action.payload;
            })
            .addCase(fetchAllPayments.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch payments";
            })
            // Fetch Payment Details (Admin)
            .addCase(fetchPaymentDetails.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchPaymentDetails.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentPayment=action.payload.payment||action.payload;
            })
            .addCase(fetchPaymentDetails.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch payment details";
            });
    },
});

export const {clearError, clearPaymentState, clearCurrentPayment}=paymentSlice.actions;
export default paymentSlice.reducer;
