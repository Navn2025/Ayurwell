import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    getAllCategories,
    getCategoryBySlug,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    deleteCategoryImage
} from "../../api/category.api";

// Async Thunks
export const fetchAllCategories=createAsyncThunk(
    "category/fetchAllCategories",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllCategories();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchCategoryBySlug=createAsyncThunk(
    "category/fetchCategoryBySlug",
    async (slug, {rejectWithValue}) =>
    {
        try
        {
            const response=await getCategoryBySlug(slug);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchCategoryById=createAsyncThunk(
    "category/fetchCategoryById",
    async (id, {rejectWithValue}) =>
    {
        try
        {
            const response=await getCategoryById(id);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addCategory=createAsyncThunk(
    "category/addCategory",
    async (categoryData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createCategory(categoryData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editCategory=createAsyncThunk(
    "category/editCategory",
    async ({id, categoryData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateCategory(id, categoryData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeCategory=createAsyncThunk(
    "category/removeCategory",
    async (id, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteCategory(id);
            return {...response, id};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Image Thunks (Single Image)
export const uploadImage=createAsyncThunk(
    "category/uploadImage",
    async ({categoryId, formData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await uploadCategoryImage(categoryId, formData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeImage=createAsyncThunk(
    "category/removeImage",
    async (categoryId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteCategoryImage(categoryId);
            return {...response, categoryId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const categorySlice=createSlice({
    name: "category",
    initialState: {
        categories: [],
        currentCategory: null,
        loading: false,
        imageLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearCurrentCategory: (state) =>
        {
            state.currentCategory=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch All Categories
            .addCase(fetchAllCategories.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.categories=action.payload.categories||action.payload;
            })
            .addCase(fetchAllCategories.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch categories";
            })
            // Fetch Category By Slug
            .addCase(fetchCategoryBySlug.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchCategoryBySlug.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentCategory=action.payload.category||action.payload;
            })
            .addCase(fetchCategoryBySlug.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch category";
            })
            // Fetch Category By ID
            .addCase(fetchCategoryById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentCategory=action.payload.category||action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch category";
            })
            // Add Category
            .addCase(addCategory.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(addCategory.fulfilled, (state, action) =>
            {
                state.loading=false;
                const newCategory=action.payload.category||action.payload;
                state.categories.push(newCategory);
            })
            .addCase(addCategory.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to add category";
            })
            // Edit Category
            .addCase(editCategory.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(editCategory.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.category||action.payload;
                const index=state.categories.findIndex(c => c.id===updated.id);
                if (index!==-1)
                {
                    state.categories[index]=updated;
                }
                if (state.currentCategory?.id===updated.id)
                {
                    state.currentCategory=updated;
                }
            })
            .addCase(editCategory.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update category";
            })
            // Remove Category
            .addCase(removeCategory.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(removeCategory.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.categories=state.categories.filter(c => c.id!==action.payload.id);
            })
            .addCase(removeCategory.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete category";
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
                const updated=action.payload.category||action.payload;
                // Update in flat list
                const updateCategoryInTree=(categories, updatedCat) =>
                {
                    return categories.map(cat =>
                    {
                        if (cat.id===updatedCat.id)
                        {
                            return {...cat, ...updatedCat};
                        }
                        if (cat.children&&cat.children.length>0)
                        {
                            return {...cat, children: updateCategoryInTree(cat.children, updatedCat)};
                        }
                        return cat;
                    });
                };
                state.categories=updateCategoryInTree(state.categories, updated);
                if (state.currentCategory?.id===updated.id)
                {
                    state.currentCategory=updated;
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
                const updated=action.payload.category||action.payload;
                const updateCategoryInTree=(categories, updatedCat) =>
                {
                    return categories.map(cat =>
                    {
                        if (cat.id===updatedCat?.id)
                        {
                            return {...cat, ...updatedCat};
                        }
                        if (cat.children&&cat.children.length>0)
                        {
                            return {...cat, children: updateCategoryInTree(cat.children, updatedCat)};
                        }
                        return cat;
                    });
                };
                if (updated)
                {
                    state.categories=updateCategoryInTree(state.categories, updated);
                }
                if (state.currentCategory?.id===updated?.id)
                {
                    state.currentCategory=updated;
                }
            })
            .addCase(removeImage.rejected, (state, action) =>
            {
                state.imageLoading=false;
                state.error=action.payload?.message||"Failed to delete image";
            });
    },
});

export const {clearError, clearCurrentCategory}=categorySlice.actions;
export default categorySlice.reducer;
