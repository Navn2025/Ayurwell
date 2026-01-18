import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    retryAWBAssignment,
    settleCODOrder,
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getAdminOrders,
    updateOrder,
    getInventoryReport,
    getSalesReport
} from "../../api/admin.api";

// Async Thunks
export const retryAWB=createAsyncThunk(
    "admin/retryAWB",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await retryAWBAssignment(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const settleCOD=createAsyncThunk(
    "admin/settleCOD",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await settleCODOrder(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchDashboardStats=createAsyncThunk(
    "admin/fetchDashboardStats",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getDashboardStats();
            // Axios interceptor already returns response.data
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchAllUsers=createAsyncThunk(
    "admin/fetchAllUsers",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllUsers(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchUserById=createAsyncThunk(
    "admin/fetchUserById",
    async (userId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getUserById(userId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const changeUserRole=createAsyncThunk(
    "admin/changeUserRole",
    async ({userId, role}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateUserRole(userId, role);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeUser=createAsyncThunk(
    "admin/removeUser",
    async (userId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteUser(userId);
            return {...response, userId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchAdminOrders=createAsyncThunk(
    "admin/fetchAdminOrders",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAdminOrders(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editOrder=createAsyncThunk(
    "admin/editOrder",
    async ({orderId, orderData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateOrder(orderId, orderData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchInventoryReport=createAsyncThunk(
    "admin/fetchInventoryReport",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getInventoryReport();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchSalesReport=createAsyncThunk(
    "admin/fetchSalesReport",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getSalesReport(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const adminSlice=createSlice({
    name: "admin",
    initialState: {
        dashboardStats: null,
        stats: null,
        users: [],
        currentUser: null,
        orders: [],
        inventoryReport: null,
        salesReport: null,
        pagination: null,
        loading: false,
        error: null,
        actionSuccess: false,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearActionSuccess: (state) =>
        {
            state.actionSuccess=false;
        },
        clearCurrentUser: (state) =>
        {
            state.currentUser=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Retry AWB
            .addCase(retryAWB.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(retryAWB.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                const updated=action.payload.order||action.payload;
                const index=state.orders.findIndex(o => o.id===updated.id);
                if (index!==-1)
                {
                    state.orders[index]=updated;
                }
            })
            .addCase(retryAWB.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to retry AWB assignment";
            })
            // Settle COD
            .addCase(settleCOD.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(settleCOD.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                const updated=action.payload.order||action.payload;
                const index=state.orders.findIndex(o => o.id===updated.id);
                if (index!==-1)
                {
                    state.orders[index]=updated;
                }
            })
            .addCase(settleCOD.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to settle COD order";
            })
            // Fetch Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.dashboardStats=action.payload.stats||action.payload;
                state.stats=action.payload.stats||action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch dashboard stats";
            })
            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.users=action.payload.users||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch users";
            })
            // Fetch User By ID
            .addCase(fetchUserById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentUser=action.payload.user||action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch user";
            })
            // Change User Role
            .addCase(changeUserRole.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(changeUserRole.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                const updated=action.payload.user||action.payload;
                const index=state.users.findIndex(u => u.id===updated.id);
                if (index!==-1)
                {
                    state.users[index]=updated;
                }
            })
            .addCase(changeUserRole.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update user role";
            })
            // Remove User
            .addCase(removeUser.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(removeUser.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                state.users=state.users.filter(u => u.id!==action.payload.userId);
            })
            .addCase(removeUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete user";
            })
            // Fetch Admin Orders
            .addCase(fetchAdminOrders.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.orders=action.payload.orders||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch orders";
            })
            // Edit Order
            .addCase(editOrder.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(editOrder.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                const updated=action.payload.order||action.payload;
                const index=state.orders.findIndex(o => o.id===updated.id);
                if (index!==-1)
                {
                    state.orders[index]=updated;
                }
            })
            .addCase(editOrder.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update order";
            })
            // Fetch Inventory Report
            .addCase(fetchInventoryReport.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchInventoryReport.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.inventoryReport=action.payload;
            })
            .addCase(fetchInventoryReport.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch inventory report";
            })
            // Fetch Sales Report
            .addCase(fetchSalesReport.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchSalesReport.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.salesReport=action.payload;
            })
            .addCase(fetchSalesReport.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch sales report";
            });
    },
});

export const {clearError, clearActionSuccess, clearCurrentUser}=adminSlice.actions;
export default adminSlice.reducer;
