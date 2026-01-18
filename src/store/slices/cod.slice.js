import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {createCODShipment} from "../../api/cod.api";
import axiosInstance from "../../config/axios.config";

// NOTE: COD route exists in backend but is NOT MOUNTED in app.js yet
// Ask backend team to mount cod.route.js in app.js

// Async Thunks
export const createCODOrder=createAsyncThunk(
    "cod/createCODOrder",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await createCODShipment(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin: Fetch all COD orders
export const fetchCODOrders=createAsyncThunk(
    "cod/fetchCODOrders",
    async (status='all', {rejectWithValue}) =>
    {
        try
        {
            const response=await axiosInstance.get("/admin/cod-orders", {params: {status}});
            return response; // axios interceptor already returns response.data
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin: Settle COD payment
export const settleCODPayment=createAsyncThunk(
    "cod/settleCODPayment",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await axiosInstance.post(`/admin/settle-cod/${orderId}`, {});
            return response; // axios interceptor already returns response.data
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const codSlice=createSlice({
    name: "cod",
    initialState: {
        codOrder: null,
        codOrders: [],
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
        clearCODOrder: (state) =>
        {
            state.codOrder=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Create COD Order
            .addCase(createCODOrder.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
                state.success=false;
            })
            .addCase(createCODOrder.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.codOrder=action.payload.order||action.payload;
                state.success=true;
            })
            .addCase(createCODOrder.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to create COD order";
            })
            // Fetch COD Orders (Admin)
            .addCase(fetchCODOrders.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchCODOrders.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.codOrders=action.payload?.orders||action.payload||[];
            })
            .addCase(fetchCODOrders.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch COD orders";
            })
            // Settle COD Payment (Admin)
            .addCase(settleCODPayment.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(settleCODPayment.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.success=true;
                // Update the order in the list
                const updated=action.payload.order||action.payload;
                const index=state.codOrders.findIndex(o => o.id===updated.id);
                if (index!==-1)
                {
                    state.codOrders[index]=updated;
                }
            })
            .addCase(settleCODPayment.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to settle COD payment";
            });
    },
});

export const {clearError, clearSuccess, clearCODOrder}=codSlice.actions;
export default codSlice.reducer;
