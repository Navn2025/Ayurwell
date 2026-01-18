import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// ══════════════════════════════════════════════════════════════════
// 🔄 ASYNC THUNKS
// ══════════════════════════════════════════════════════════════════

// Create return request
export const createReturnRequest = createAsyncThunk(
    'return/createRequest',
    async ({ orderId, reason, isPartial = false, itemIds = [] }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/return/request/${orderId}`,
                { reason, isPartial, itemIds },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Get return by ID
export const fetchReturnById = createAsyncThunk(
    'return/fetchById',
    async (returnId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/return/${returnId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Get returns by order
export const fetchReturnsByOrder = createAsyncThunk(
    'return/fetchByOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/return/order/${orderId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Get all returns (admin)
export const fetchAllReturns = createAsyncThunk(
    'return/fetchAll',
    async ({ page = 1, limit = 20, status = null }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (status) params.append('status', status);
            
            const response = await axios.get(
                `${API_BASE_URL}/return/all?${params}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Update return status (admin)
export const updateReturnStatus = createAsyncThunk(
    'return/updateStatus',
    async ({ returnId, status, notes }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/return/${returnId}/status`,
                { status, notes },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Cancel return request
export const cancelReturnRequest = createAsyncThunk(
    'return/cancelRequest',
    async (returnId, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/return/${returnId}/cancel`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Get return statistics (admin)
export const fetchReturnStatistics = createAsyncThunk(
    'return/fetchStatistics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/return/statistics`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// Schedule return pickup (admin)
export const scheduleReturnPickup = createAsyncThunk(
    'return/schedulePickup',
    async ({ returnId, pickupDate, pickupAddress, notes }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/return/${returnId}/pickup`,
                { pickupDate, pickupAddress, notes },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: error.message });
        }
    }
);

// ══════════════════════════════════════════════════════════════════
// 🔄 REDUX SLICE
// ══════════════════════════════════════════════════════════════════

const returnSlice = createSlice({
    name: 'return',
    initialState: {
        // Customer returns
        customerReturns: [],
        currentReturn: null,
        
        // Admin returns
        allReturns: [],
        returnStatistics: null,
        
        // UI state
        loading: false,
        creating: false,
        updating: false,
        cancelling: false,
        
        // Pagination
        pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
        },
        
        // Filters
        filters: {
            status: null,
            orderId: null
        },
        
        // Error handling
        error: null,
        successMessage: null
    },
    
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        
        setCurrentReturn: (state, action) => {
            state.currentReturn = action.payload;
        },
        
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        
        resetFilters: (state) => {
            state.filters = {
                status: null,
                orderId: null
            };
        },
        
        clearCurrentReturn: (state) => {
            state.currentReturn = null;
        }
    },
    
    extraReducers: (builder) => {
        // Create return request
        builder
            .addCase(createReturnRequest.pending, (state) => {
                state.creating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createReturnRequest.fulfilled, (state, action) => {
                state.creating = false;
                state.successMessage = action.payload.message;
                state.currentReturn = action.payload.return;
                state.customerReturns.unshift(action.payload.return);
            })
            .addCase(createReturnRequest.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload?.message || 'Failed to create return request';
            });
        
        // Get return by ID
        builder
            .addCase(fetchReturnById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReturnById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReturn = action.payload.return;
            })
            .addCase(fetchReturnById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch return details';
            });
        
        // Get returns by order
        builder
            .addCase(fetchReturnsByOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReturnsByOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.customerReturns = action.payload.returns;
            })
            .addCase(fetchReturnsByOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch order returns';
            });
        
        // Get all returns (admin)
        builder
            .addCase(fetchAllReturns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReturns.fulfilled, (state, action) => {
                state.loading = false;
                state.allReturns = action.payload.returns;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchAllReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch all returns';
            });
        
        // Update return status
        builder
            .addCase(updateReturnStatus.pending, (state) => {
                state.updating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateReturnStatus.fulfilled, (state, action) => {
                state.updating = false;
                state.successMessage = action.payload.message;
                
                // Update return in allReturns list
                const index = state.allReturns.findIndex(r => r.id === action.payload.return.id);
                if (index !== -1) {
                    state.allReturns[index] = action.payload.return;
                }
                
                // Update current return if it matches
                if (state.currentReturn?.id === action.payload.return.id) {
                    state.currentReturn = action.payload.return;
                }
            })
            .addCase(updateReturnStatus.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload?.message || 'Failed to update return status';
            });
        
        // Cancel return request
        builder
            .addCase(cancelReturnRequest.pending, (state) => {
                state.cancelling = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(cancelReturnRequest.fulfilled, (state, action) => {
                state.cancelling = false;
                state.successMessage = action.payload.message;
                
                // Update return in customerReturns list
                const index = state.customerReturns.findIndex(r => r.id === action.payload.return.id);
                if (index !== -1) {
                    state.customerReturns[index] = action.payload.return;
                }
                
                // Update current return if it matches
                if (state.currentReturn?.id === action.payload.return.id) {
                    state.currentReturn = action.payload.return;
                }
            })
            .addCase(cancelReturnRequest.rejected, (state, action) => {
                state.cancelling = false;
                state.error = action.payload?.message || 'Failed to cancel return request';
            });
        
        // Get return statistics
        builder
            .addCase(fetchReturnStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReturnStatistics.fulfilled, (state, action) => {
                state.loading = false;
                state.returnStatistics = action.payload.statistics;
            })
            .addCase(fetchReturnStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch return statistics';
            });
        
        // Schedule return pickup
        builder
            .addCase(scheduleReturnPickup.pending, (state) => {
                state.updating = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(scheduleReturnPickup.fulfilled, (state, action) => {
                state.updating = false;
                state.successMessage = action.payload.message;
                
                // Update return in allReturns list
                const index = state.allReturns.findIndex(r => r.id === action.payload.return.id);
                if (index !== -1) {
                    state.allReturns[index] = action.payload.return;
                }
                
                // Update current return if it matches
                if (state.currentReturn?.id === action.payload.return.id) {
                    state.currentReturn = action.payload.return;
                }
            })
            .addCase(scheduleReturnPickup.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload?.message || 'Failed to schedule return pickup';
            });
    }
});

export const {
    clearError,
    clearSuccessMessage,
    setCurrentReturn,
    setFilters,
    resetFilters,
    clearCurrentReturn
} = returnSlice.actions;

export default returnSlice.reducer;