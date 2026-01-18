import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    getAllConcerns,
    getConcernById,
    getConcernBySlug,
    createConcern,
    updateConcern,
    deleteConcern,
    uploadConcernImage,
    deleteConcernImage
} from "../../api/concern.api";

// Async Thunks
export const fetchAllConcerns=createAsyncThunk(
    "concern/fetchAllConcerns",
    async (includeInactive=true, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllConcerns(includeInactive);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchConcernById=createAsyncThunk(
    "concern/fetchConcernById",
    async (id, {rejectWithValue}) =>
    {
        try
        {
            const response=await getConcernById(id);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchConcernBySlug=createAsyncThunk(
    "concern/fetchConcernBySlug",
    async (slug, {rejectWithValue}) =>
    {
        try
        {
            const response=await getConcernBySlug(slug);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addConcern=createAsyncThunk(
    "concern/addConcern",
    async (concernData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createConcern(concernData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editConcern=createAsyncThunk(
    "concern/editConcern",
    async ({id, concernData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateConcern(id, concernData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeConcern=createAsyncThunk(
    "concern/removeConcern",
    async (id, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteConcern(id);
            return {...response, id};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Image Thunks (Single Image)
export const uploadImage=createAsyncThunk(
    "concern/uploadImage",
    async ({concernId, formData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await uploadConcernImage(concernId, formData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeImage=createAsyncThunk(
    "concern/removeImage",
    async (concernId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteConcernImage(concernId);
            return {...response, concernId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const concernSlice=createSlice({
    name: "concern",
    initialState: {
        concerns: [],
        currentConcern: null,
        loading: false,
        imageLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearCurrentConcern: (state) =>
        {
            state.currentConcern=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch All Concerns
            .addCase(fetchAllConcerns.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllConcerns.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.concerns=action.payload.concerns||action.payload;
            })
            .addCase(fetchAllConcerns.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch concerns";
            })
            // Fetch Concern By ID
            .addCase(fetchConcernById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchConcernById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentConcern=action.payload.concern||action.payload;
            })
            .addCase(fetchConcernById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch concern";
            })
            // Fetch Concern By Slug
            .addCase(fetchConcernBySlug.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchConcernBySlug.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentConcern=action.payload.concern||action.payload;
            })
            .addCase(fetchConcernBySlug.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch concern";
            })
            // Add Concern
            .addCase(addConcern.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(addConcern.fulfilled, (state, action) =>
            {
                state.loading=false;
                const newConcern=action.payload.concern||action.payload;
                state.concerns.unshift(newConcern);
            })
            .addCase(addConcern.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to add concern";
            })
            // Edit Concern
            .addCase(editConcern.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(editConcern.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.concern||action.payload;
                const index=state.concerns.findIndex(c => c.id===updated.id);
                if (index!==-1)
                {
                    state.concerns[index]=updated;
                }
                if (state.currentConcern?.id===updated.id)
                {
                    state.currentConcern=updated;
                }
            })
            .addCase(editConcern.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update concern";
            })
            // Remove Concern
            .addCase(removeConcern.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(removeConcern.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.concerns=state.concerns.filter(c => c.id!==action.payload.id);
                if (state.currentConcern?.id===action.payload.id)
                {
                    state.currentConcern=null;
                }
            })
            .addCase(removeConcern.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete concern";
            })
            // Upload Image
            .addCase(uploadImage.pending, (state) =>
            {
                state.imageLoading=true;
                state.error=null;
            })
            .addCase(uploadImage.fulfilled, (state, action) =>
            {
                state.imageLoading=false;
                const updated=action.payload.concern||action.payload;
                const index=state.concerns.findIndex(c => c.id===updated.id);
                if (index!==-1)
                {
                    state.concerns[index]=updated;
                }
                if (state.currentConcern?.id===updated.id)
                {
                    state.currentConcern=updated;
                }
            })
            .addCase(uploadImage.rejected, (state, action) =>
            {
                state.imageLoading=false;
                state.error=action.payload?.message||"Failed to upload image";
            })
            // Remove Image
            .addCase(removeImage.pending, (state) =>
            {
                state.imageLoading=true;
                state.error=null;
            })
            .addCase(removeImage.fulfilled, (state, action) =>
            {
                state.imageLoading=false;
                const updated=action.payload.concern||action.payload;
                const index=state.concerns.findIndex(c => c.id===updated?.id);
                if (index!==-1&&updated)
                {
                    state.concerns[index]=updated;
                }
                if (state.currentConcern?.id===updated?.id)
                {
                    state.currentConcern=updated;
                }
            })
            .addCase(removeImage.rejected, (state, action) =>
            {
                state.imageLoading=false;
                state.error=action.payload?.message||"Failed to delete image";
            });
    },
});

export const {clearError, clearCurrentConcern}=concernSlice.actions;
export default concernSlice.reducer;
