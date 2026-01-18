import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    createShipment,
    trackShipment,
    cancelShipment,
    getShipmentByOrder,
    getShipmentById,
    schedulePickup,
    generateLabel,
    generateManifest,
    getAllShipments
} from "../../api/shipment.api";
import axiosInstance from "../../config/axios.config";

// Async Thunks
export const createNewShipment=createAsyncThunk(
    "shipment/createNewShipment",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await createShipment(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchShipmentTracking=createAsyncThunk(
    "shipment/fetchShipmentTracking",
    async (shipmentId, {rejectWithValue}) =>
    {
        try
        {
            const response=await trackShipment(shipmentId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const cancelOrderShipment=createAsyncThunk(
    "shipment/cancelOrderShipment",
    async (shipmentId, {rejectWithValue}) =>
    {
        try
        {
            const response=await cancelShipment(shipmentId);
            return {...response, shipmentId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Alias for components that use cancelShipment
export {cancelOrderShipment as cancelShipmentAction};

export const fetchShipmentByOrder=createAsyncThunk(
    "shipment/fetchShipmentByOrder",
    async (orderId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getShipmentByOrder(orderId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchShipmentById=createAsyncThunk(
    "shipment/fetchShipmentById",
    async (shipmentId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getShipmentById(shipmentId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin: Fetch all shipments
export const fetchAllShipments=createAsyncThunk(
    "shipment/fetchAllShipments",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllShipments(params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Admin: Retry AWB assignment
export const retryAWBAssignment=createAsyncThunk(
    "shipment/retryAWBAssignment",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axiosInstance.post(`/admin/retry-awb/`, {});
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const scheduleShipmentPickup=createAsyncThunk(
    "shipment/scheduleShipmentPickup",
    async (shipmentId, {rejectWithValue}) =>
    {
        try
        {
            const response=await schedulePickup(shipmentId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const generateShipmentLabel=createAsyncThunk(
    "shipment/generateShipmentLabel",
    async (shipmentId, {rejectWithValue}) =>
    {
        try
        {
            const response=await generateLabel(shipmentId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const generateShipmentManifest=createAsyncThunk(
    "shipment/generateShipmentManifest",
    async (shipmentIds, {rejectWithValue}) =>
    {
        try
        {
            const response=await generateManifest(shipmentIds);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const shipmentSlice=createSlice({
    name: "shipment",
    initialState: {
        shipments: [],
        currentShipment: null,
        trackingInfo: null,
        labelUrl: null,
        manifestUrl: null,
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
        clearCurrentShipment: (state) =>
        {
            state.currentShipment=null;
            state.trackingInfo=null;
        },
        clearLabelUrl: (state) =>
        {
            state.labelUrl=null;
        },
        clearManifestUrl: (state) =>
        {
            state.manifestUrl=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Create New Shipment
            .addCase(createNewShipment.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(createNewShipment.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentShipment=action.payload.shipment||action.payload;
                state.actionSuccess=true;
            })
            .addCase(createNewShipment.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to create shipment";
            })
            // Fetch Shipment Tracking
            .addCase(fetchShipmentTracking.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchShipmentTracking.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.trackingInfo=action.payload.tracking||action.payload;
            })
            .addCase(fetchShipmentTracking.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch tracking info";
            })
            // Cancel Shipment
            .addCase(cancelOrderShipment.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(cancelOrderShipment.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                if (state.currentShipment?.id===action.payload.shipmentId)
                {
                    state.currentShipment.status="CANCELLED";
                }
            })
            .addCase(cancelOrderShipment.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to cancel shipment";
            })
            // Fetch Shipment By Order
            .addCase(fetchShipmentByOrder.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchShipmentByOrder.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentShipment=action.payload.shipment||action.payload;
            })
            .addCase(fetchShipmentByOrder.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch shipment";
            })
            // Fetch Shipment By ID
            .addCase(fetchShipmentById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchShipmentById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentShipment=action.payload.shipment||action.payload;
            })
            .addCase(fetchShipmentById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch shipment";
            })
            // Schedule Pickup
            .addCase(scheduleShipmentPickup.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(scheduleShipmentPickup.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                if (state.currentShipment)
                {
                    state.currentShipment={...state.currentShipment, ...action.payload};
                }
            })
            .addCase(scheduleShipmentPickup.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to schedule pickup";
            })
            // Generate Label
            .addCase(generateShipmentLabel.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(generateShipmentLabel.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.labelUrl=action.payload.labelUrl||action.payload.url;
            })
            .addCase(generateShipmentLabel.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to generate label";
            })
            // Generate Manifest
            .addCase(generateShipmentManifest.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(generateShipmentManifest.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.manifestUrl=action.payload.manifestUrl||action.payload.url;
            })
            .addCase(generateShipmentManifest.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to generate manifest";
            })
            // Fetch All Shipments (Admin)
            .addCase(fetchAllShipments.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllShipments.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.shipments=action.payload.shipments||action.payload;
            })
            .addCase(fetchAllShipments.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch shipments";
            })
            // Retry AWB Assignment (Admin)
            .addCase(retryAWBAssignment.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(retryAWBAssignment.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.actionSuccess=true;
                const updated=action.payload.shipment||action.payload;
                if (state.currentShipment?.id===updated.id)
                {
                    state.currentShipment=updated;
                }
                const index=state.shipments.findIndex(s => s.id===updated.id);
                if (index!==-1)
                {
                    state.shipments[index]=updated;
                }
            })
            .addCase(retryAWBAssignment.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to retry AWB assignment";
            });
    },
});

export const {
    clearError,
    clearActionSuccess,
    clearCurrentShipment,
    clearLabelUrl,
    clearManifestUrl
}=shipmentSlice.actions;
export default shipmentSlice.reducer;
