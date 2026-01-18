import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    createOrderFromCart,
    createOrderFromProduct,
    getAllOrders,
    getOrderById,
    getOrdersByCategory,
    getOrdersByStatus,
    updateOrderStatus,
    cancelOrder
} from "../../api/order.api";

// Async Thunks
export const placeOrderFromCart=createAsyncThunk(
    "order/placeOrderFromCart",
    async (orderData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createOrderFromCart(orderData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const placeOrderFromProduct=createAsyncThunk(
    "order/placeOrderFromProduct",
    async (orderData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createOrderFromProduct(orderData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchAllOrders=createAsyncThunk(
    "order/fetchAllOrders",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllOrders(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchOrderById=createAsyncThunk(
    "order/fetchOrderById",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getOrderById(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchOrdersByCategory=createAsyncThunk(
    "order/fetchOrdersByCategory",
    async (category, {rejectWithValue}) =>
    {
        try
        {
            const response=await getOrdersByCategory(category);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchOrdersByStatus=createAsyncThunk(
    "order/fetchOrdersByStatus",
    async (status, {rejectWithValue}) =>
    {
        try
        {
            const response=await getOrdersByStatus(status);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const changeOrderStatus=createAsyncThunk(
    "order/changeOrderStatus",
    async ({orderId, status}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateOrderStatus(orderId, status);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const cancelUserOrder=createAsyncThunk(
    "order/cancelUserOrder",
    async ({orderId, reason}, {rejectWithValue}) =>
    {
        try
        {
            const response=await cancelOrder(orderId, reason);
            return {...response, orderId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const orderSlice=createSlice({
    name: "order",
    initialState: {
        orders: [],
        currentOrder: null,
        pagination: null,
        loading: false,
        error: null,
        orderSuccess: false,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearCurrentOrder: (state) =>
        {
            state.currentOrder=null;
        },
        clearOrderSuccess: (state) =>
        {
            state.orderSuccess=false;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Place Order From Cart
            .addCase(placeOrderFromCart.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
                state.orderSuccess=false;
            })
            .addCase(placeOrderFromCart.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentOrder=action.payload.order||action.payload;
                state.orderSuccess=true;
            })
            .addCase(placeOrderFromCart.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to place order";
                state.orderSuccess=false;
            })
            // Place Order From Product
            .addCase(placeOrderFromProduct.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
                state.orderSuccess=false;
            })
            .addCase(placeOrderFromProduct.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentOrder=action.payload.order||action.payload;
                state.orderSuccess=true;
            })
            .addCase(placeOrderFromProduct.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to place order";
                state.orderSuccess=false;
            })
            // Fetch All Orders
            .addCase(fetchAllOrders.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.orders=action.payload.orders||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(fetchAllOrders.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch orders";
            })
            // Fetch Order By ID
            .addCase(fetchOrderById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentOrder=action.payload.order||action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch order";
            })
            // Fetch Orders By Category
            .addCase(fetchOrdersByCategory.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchOrdersByCategory.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.orders=action.payload.orders||action.payload;
            })
            .addCase(fetchOrdersByCategory.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch orders";
            })
            // Fetch Orders By Status
            .addCase(fetchOrdersByStatus.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchOrdersByStatus.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.orders=action.payload.orders||action.payload;
            })
            .addCase(fetchOrdersByStatus.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch orders";
            })
            // Change Order Status
            .addCase(changeOrderStatus.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(changeOrderStatus.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.order||action.payload;
                const index=state.orders.findIndex(o => o.id===updated.id);
                if (index!==-1)
                {
                    state.orders[index]=updated;
                }
                if (state.currentOrder?.id===updated.id)
                {
                    state.currentOrder=updated;
                }
            })
            .addCase(changeOrderStatus.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update order status";
            })
            // Cancel Order
            .addCase(cancelUserOrder.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(cancelUserOrder.fulfilled, (state, action) =>
            {
                state.loading=false;
                const index=state.orders.findIndex(o => o.id===action.payload.orderId);
                if (index!==-1)
                {
                    state.orders[index].status="CANCELLED";
                }
                if (state.currentOrder?.id===action.payload.orderId)
                {
                    state.currentOrder.status="CANCELLED";
                }
            })
            .addCase(cancelUserOrder.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to cancel order";
            });
    },
});

export const {clearError, clearCurrentOrder, clearOrderSuccess}=orderSlice.actions;
export default orderSlice.reducer;
