import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    cancelOrderWithRefund,
    getRefundStatus,
    getAllRefunds,
    processRTORefund,
    processReturnRefund,
    initiateAdminRefund,
    retryFailedRefund,
    getRefundById
} from "../../api/refund.api";

// Async Thunks
export const cancelWithRefund=createAsyncThunk(
    "refund/cancelWithRefund",
    async ({orderId, reason}, {rejectWithValue}) =>
    {
        try
        {
            const response=await cancelOrderWithRefund(orderId, reason);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchRefundStatus=createAsyncThunk(
    "refund/fetchRefundStatus",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getRefundStatus(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchAllRefunds=createAsyncThunk(
    "refund/fetchAllRefunds",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllRefunds(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const handleRTORefund=createAsyncThunk(
    "refund/handleRTORefund",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await processRTORefund(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const handleReturnRefund=createAsyncThunk(
    "refund/handleReturnRefund",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await processReturnRefund(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const initiateRefund=createAsyncThunk(
    "refund/initiateRefund",
    async ({orderId, amount, reason}, {rejectWithValue}) =>
    {
        try
        {
            const response=await initiateAdminRefund(orderId, amount, reason);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const retryRefund=createAsyncThunk(
    "refund/retryRefund",
    async (refundId, {rejectWithValue}) =>
    {
        try
        {
            const response=await retryFailedRefund(refundId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchRefundById=createAsyncThunk(
    "refund/fetchRefundById",
    async (refundId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getRefundById(refundId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const refundSlice=createSlice({
    name: "refund",
    initialState: {
        refunds: [],
        currentRefund: null,
        pagination: null,
        loading: false,
        error: null,
        refundSuccess: false,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearRefundSuccess: (state) =>
        {
            state.refundSuccess=false;
        },
        clearCurrentRefund: (state) =>
        {
            state.currentRefund=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Cancel With Refund
            .addCase(cancelWithRefund.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
                state.refundSuccess=false;
            })
            .addCase(cancelWithRefund.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentRefund=action.payload.refund||action.payload;
                state.refundSuccess=true;
            })
            .addCase(cancelWithRefund.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to process refund";
            })
            // Fetch Refund Status
            .addCase(fetchRefundStatus.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchRefundStatus.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentRefund=action.payload.refund||action.payload;
            })
            .addCase(fetchRefundStatus.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch refund status";
            })
            // Fetch All Refunds
            .addCase(fetchAllRefunds.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllRefunds.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.refunds=action.payload.refunds||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(fetchAllRefunds.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch refunds";
            })
            // Handle RTO Refund
            .addCase(handleRTORefund.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(handleRTORefund.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentRefund=action.payload.refund||action.payload;
                state.refundSuccess=true;
            })
            .addCase(handleRTORefund.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to process RTO refund";
            })
            // Handle Return Refund
            .addCase(handleReturnRefund.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(handleReturnRefund.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentRefund=action.payload.refund||action.payload;
                state.refundSuccess=true;
            })
            .addCase(handleReturnRefund.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to process return refund";
            })
            // Initiate Refund
            .addCase(initiateRefund.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(initiateRefund.fulfilled, (state, action) =>
            {
                state.loading=false;
                const newRefund=action.payload.refund||action.payload;
                state.refunds.unshift(newRefund);
                state.refundSuccess=true;
            })
            .addCase(initiateRefund.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to initiate refund";
            })
            // Retry Refund
            .addCase(retryRefund.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(retryRefund.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.refund||action.payload;
                const index=state.refunds.findIndex(r => r.id===updated.id);
                if (index!==-1)
                {
                    state.refunds[index]=updated;
                }
                state.refundSuccess=true;
            })
            .addCase(retryRefund.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to retry refund";
            })
            // Fetch Refund By ID
            .addCase(fetchRefundById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchRefundById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentRefund=action.payload.refund||action.payload;
            })
            .addCase(fetchRefundById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch refund";
            });
    },
});

export const {clearError, clearRefundSuccess, clearCurrentRefund}=refundSlice.actions;
export default refundSlice.reducer;
