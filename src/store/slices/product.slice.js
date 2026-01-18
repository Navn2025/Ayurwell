import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    getAllProducts,
    getTrendingProducts,
    getProductById,
    getProductsByCategory,
    getProductsByConcern,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductTrending,
    getProductImages,
    getImageById,
    uploadProductImages,
    deleteAllProductImages,
    deleteSingleProductImage,
    setPrimaryProductImage,
    getProductFAQs,
    addProductFAQ,
    updateProductFAQ,
    deleteProductFAQ,
    getProductDirections,
    addProductDirection,
    updateProductDirection,
    deleteProductDirection
} from "../../api/product.api";

// Async Thunks
export const fetchAllProducts=createAsyncThunk(
    "product/fetchAllProducts",
    async (params={}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllProducts(params);

            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchProductById=createAsyncThunk(
    "product/fetchProductById",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductById(productId);
            console.log('res->', response);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchProductsByCategory=createAsyncThunk(
    "product/fetchProductsByCategory",
    async ({categoryId, params={}}, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductsByCategory(categoryId, params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchProductsByConcern=createAsyncThunk(
    "product/fetchProductsByConcern",
    async (concernId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductsByConcern(concernId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addProduct=createAsyncThunk(
    "product/addProduct",
    async (productData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createProduct(productData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editProduct=createAsyncThunk(
    "product/editProduct",
    async ({productId, productData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateProduct(productId, productData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeProduct=createAsyncThunk(
    "product/removeProduct",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteProduct(productId);
            return {...response, productId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const uploadImages=createAsyncThunk(
    "product/uploadImages",
    async ({productId, formData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await uploadProductImages(productId, formData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchProductImages=createAsyncThunk(
    "product/fetchProductImages",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductImages(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchImageById=createAsyncThunk(
    "product/fetchImageById",
    async (imageId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getImageById(imageId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeAllImages=createAsyncThunk(
    "product/removeAllImages",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteAllProductImages(productId);
            return {...response, productId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeImage=createAsyncThunk(
    "product/removeImage",
    async (imageId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteSingleProductImage(imageId);
            return {...response, imageId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const setPrimaryImage=createAsyncThunk(
    "product/setPrimaryImage",
    async ({productId, imageId}, {rejectWithValue}) =>
    {
        try
        {
            const response=await setPrimaryProductImage(productId, imageId);
            return {...response, productId, imageId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Trending Products
export const fetchTrendingProducts=createAsyncThunk(
    "product/fetchTrendingProducts",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getTrendingProducts();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const toggleTrending=createAsyncThunk(
    "product/toggleTrending",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await toggleProductTrending(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// FAQ Thunks
export const fetchProductFAQs=createAsyncThunk(
    "product/fetchProductFAQs",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductFAQs(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const createFAQ=createAsyncThunk(
    "product/createFAQ",
    async ({productId, faqData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await addProductFAQ(productId, faqData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editFAQ=createAsyncThunk(
    "product/editFAQ",
    async ({faqId, faqData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateProductFAQ(faqId, faqData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeFAQ=createAsyncThunk(
    "product/removeFAQ",
    async (faqId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteProductFAQ(faqId);
            return {...response, faqId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Direction Thunks
export const fetchProductDirections=createAsyncThunk(
    "product/fetchProductDirections",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await getProductDirections(productId);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const createDirection=createAsyncThunk(
    "product/createDirection",
    async ({productId, directionData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await addProductDirection(productId, directionData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editDirection=createAsyncThunk(
    "product/editDirection",
    async ({directionId, directionData}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateProductDirection(directionId, directionData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeDirection=createAsyncThunk(
    "product/removeDirection",
    async (directionId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteProductDirection(directionId);
            return {...response, directionId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const productSlice=createSlice({
    name: "product",
    initialState: {
        products: [],
        trendingProducts: [],
        currentProduct: null,
        images: [],
        currentImage: null,
        faqs: [],
        directions: [],
        pagination: null,
        loading: false,
        faqLoading: false,
        directionLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearCurrentProduct: (state) =>
        {
            state.currentProduct=null;
            state.faqs=[];
            state.directions=[];
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch All Products
            .addCase(fetchAllProducts.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.products=action.payload.products||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(fetchAllProducts.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch products";
            })
            // Fetch Product By ID
            .addCase(fetchProductById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentProduct=action.payload.product||action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch product";
            })
            // Fetch Products By Category
            .addCase(fetchProductsByCategory.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchProductsByCategory.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.products=action.payload.products||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(fetchProductsByCategory.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch products";
            })
            // Fetch Products By Concern

            // Add Product
            .addCase(addProduct.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(addProduct.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.products.unshift(action.payload.product||action.payload);
            })
            .addCase(addProduct.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to add product";
            })
            // Edit Product
            .addCase(editProduct.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(editProduct.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.product||action.payload;
                const index=state.products.findIndex(p => p.id===updated.id);
                if (index!==-1)
                {
                    state.products[index]=updated;
                }
                if (state.currentProduct?.id===updated.id)
                {
                    state.currentProduct=updated;
                }
            })
            .addCase(editProduct.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update product";
            })
            // Remove Product
            .addCase(removeProduct.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(removeProduct.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.products=state.products.filter(p => p.id!==action.payload.productId);
            })
            .addCase(removeProduct.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete product";
            })
            // Upload Images
            .addCase(uploadImages.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(uploadImages.fulfilled, (state, action) =>
            {
                state.loading=false;
                if (state.currentProduct)
                {
                    state.currentProduct.images=action.payload.images||state.currentProduct.images;
                }
                state.images=action.payload.images||state.images;
            })
            .addCase(uploadImages.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to upload images";
            })
            // Fetch Product Images
            .addCase(fetchProductImages.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchProductImages.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.images=action.payload.images||action.payload;
            })
            .addCase(fetchProductImages.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch images";
            })
            // Fetch Image By ID
            .addCase(fetchImageById.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchImageById.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.currentImage=action.payload.image||action.payload;
            })
            .addCase(fetchImageById.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch image";
            })
            // Remove All Images
            .addCase(removeAllImages.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(removeAllImages.fulfilled, (state) =>
            {
                state.loading=false;
                state.images=[];
                if (state.currentProduct)
                {
                    state.currentProduct.images=[];
                }
            })
            .addCase(removeAllImages.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete all images";
            })
            // Remove Image
            .addCase(removeImage.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(removeImage.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.images=state.images.filter(img => img.id!==action.payload.imageId);
                if (state.currentProduct?.images)
                {
                    state.currentProduct.images=state.currentProduct.images.filter(
                        img => img.id!==action.payload.imageId
                    );
                }
            })
            .addCase(removeImage.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete image";
            })
            // Set Primary Image
            .addCase(setPrimaryImage.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(setPrimaryImage.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.images=state.images.map(img => ({
                    ...img,
                    isPrimary: img.id===action.payload.imageId
                }));
            })
            .addCase(setPrimaryImage.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to set primary image";
            })
            // Fetch Trending Products
            .addCase(fetchTrendingProducts.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchTrendingProducts.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.trendingProducts=action.payload.products||action.payload;
            })
            .addCase(fetchTrendingProducts.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch trending products";
            })
            // Toggle Trending
            .addCase(toggleTrending.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(toggleTrending.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload;
                const index=state.products.findIndex(p => p.id===updated.id);
                if (index!==-1)
                {
                    state.products[index]={...state.products[index], isTrending: updated.isTrending};
                }
                if (state.currentProduct?.id===updated.id)
                {
                    state.currentProduct.isTrending=updated.isTrending;
                }
            })
            .addCase(toggleTrending.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to toggle trending";
            })
            // Fetch FAQs
            .addCase(fetchProductFAQs.pending, (state) =>
            {
                state.faqLoading=true;
                state.error=null;
            })
            .addCase(fetchProductFAQs.fulfilled, (state, action) =>
            {
                state.faqLoading=false;
                state.faqs=action.payload;
            })
            .addCase(fetchProductFAQs.rejected, (state, action) =>
            {
                state.faqLoading=false;
                state.error=action.payload?.message||"Failed to fetch FAQs";
            })
            // Create FAQ
            .addCase(createFAQ.pending, (state) =>
            {
                state.faqLoading=true;
            })
            .addCase(createFAQ.fulfilled, (state, action) =>
            {
                state.faqLoading=false;
                state.faqs.push(action.payload);
            })
            .addCase(createFAQ.rejected, (state, action) =>
            {
                state.faqLoading=false;
                state.error=action.payload?.message||"Failed to create FAQ";
            })
            // Edit FAQ
            .addCase(editFAQ.pending, (state) =>
            {
                state.faqLoading=true;
            })
            .addCase(editFAQ.fulfilled, (state, action) =>
            {
                state.faqLoading=false;
                const updated=action.payload;
                const index=state.faqs.findIndex(f => f.id===updated.id);
                if (index!==-1)
                {
                    state.faqs[index]=updated;
                }
            })
            .addCase(editFAQ.rejected, (state, action) =>
            {
                state.faqLoading=false;
                state.error=action.payload?.message||"Failed to update FAQ";
            })
            // Remove FAQ
            .addCase(removeFAQ.pending, (state) =>
            {
                state.faqLoading=true;
            })
            .addCase(removeFAQ.fulfilled, (state, action) =>
            {
                state.faqLoading=false;
                state.faqs=state.faqs.filter(f => f.id!==action.payload.faqId);
            })
            .addCase(removeFAQ.rejected, (state, action) =>
            {
                state.faqLoading=false;
                state.error=action.payload?.message||"Failed to delete FAQ";
            })
            // Fetch Directions
            .addCase(fetchProductDirections.pending, (state) =>
            {
                state.directionLoading=true;
                state.error=null;
            })
            .addCase(fetchProductDirections.fulfilled, (state, action) =>
            {
                state.directionLoading=false;
                state.directions=action.payload;
            })
            .addCase(fetchProductDirections.rejected, (state, action) =>
            {
                state.directionLoading=false;
                state.error=action.payload?.message||"Failed to fetch directions";
            })
            // Create Direction
            .addCase(createDirection.pending, (state) =>
            {
                state.directionLoading=true;
            })
            .addCase(createDirection.fulfilled, (state, action) =>
            {
                state.directionLoading=false;
                state.directions.push(action.payload);
                state.directions.sort((a, b) => a.stepNumber-b.stepNumber);
            })
            .addCase(createDirection.rejected, (state, action) =>
            {
                state.directionLoading=false;
                state.error=action.payload?.message||"Failed to create direction";
            })
            // Edit Direction
            .addCase(editDirection.pending, (state) =>
            {
                state.directionLoading=true;
            })
            .addCase(editDirection.fulfilled, (state, action) =>
            {
                state.directionLoading=false;
                const updated=action.payload;
                const index=state.directions.findIndex(d => d.id===updated.id);
                if (index!==-1)
                {
                    state.directions[index]=updated;
                }
                state.directions.sort((a, b) => a.stepNumber-b.stepNumber);
            })
            .addCase(editDirection.rejected, (state, action) =>
            {
                state.directionLoading=false;
                state.error=action.payload?.message||"Failed to update direction";
            })
            // Remove Direction
            .addCase(removeDirection.pending, (state) =>
            {
                state.directionLoading=true;
            })
            .addCase(removeDirection.fulfilled, (state, action) =>
            {
                state.directionLoading=false;
                state.directions=state.directions.filter(d => d.id!==action.payload.directionId);
            })
            .addCase(removeDirection.rejected, (state, action) =>
            {
                state.directionLoading=false;
                state.error=action.payload?.message||"Failed to delete direction";
            })
            .addCase(fetchProductsByConcern.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            }
            ).addCase(fetchProductsByConcern.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.products=action.payload.products||action.payload;
                state.pagination=action.payload.pagination||null;
            }
            ).addCase(fetchProductsByConcern.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch products";
            }
            );

        ;
    },
});

export const {clearError, clearCurrentProduct}=productSlice.actions;
export default productSlice.reducer;
