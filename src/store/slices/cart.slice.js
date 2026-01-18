import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../../api/cart.api";

// Async Thunks
export const fetchCart=createAsyncThunk(
    "cart/fetchCart",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getCart();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addItemToCart=createAsyncThunk(
    "cart/addItemToCart",
    async ({productId, quantity}, {rejectWithValue}) =>
    {
        try
        {
            const response=await addToCart(productId, quantity);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const updateCartItemQuantity=createAsyncThunk(
    "cart/updateCartItemQuantity",
    async ({productId, quantity}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateCartItem(productId, quantity);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeCartItem=createAsyncThunk(
    "cart/removeCartItem",
    async (productId, {rejectWithValue}) =>
    {
        try
        {
            const response=await removeFromCart(productId);
            return {...response, productId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const emptyCart=createAsyncThunk(
    "cart/emptyCart",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await clearCart();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const cartSlice=createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        resetCart: (state) =>
        {
            state.items=[];
            state.totalItems=0;
            state.totalPrice=0;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchCart.fulfilled, (state, action) =>
            {
                state.loading=false;
                const cart=action.payload.cart||action.payload;
                state.items=cart.items||cart.cartItems||[];
                state.totalItems=cart.totalItems||state.items.length;
                state.totalPrice=cart.totalPrice||cart.total||0;
            })
            .addCase(fetchCart.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch cart";
            })
            // Add Item To Cart
            .addCase(addItemToCart.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(addItemToCart.fulfilled, (state, action) =>
            {
                state.loading=false;
                const cart=action.payload.cart||action.payload;
                state.items=cart.items||cart.cartItems||[];
                state.totalItems=cart.totalItems||state.items.length;
                state.totalPrice=cart.totalPrice||cart.total||0;
            })
            .addCase(addItemToCart.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to add item to cart";
            })
            // Update Cart Item
            .addCase(updateCartItemQuantity.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(updateCartItemQuantity.fulfilled, (state, action) =>
            {
                state.loading=false;
                const cart=action.payload.cart||action.payload;
                state.items=cart.items||cart.cartItems||[];
                state.totalItems=cart.totalItems||state.items.length;
                state.totalPrice=cart.totalPrice||cart.total||0;
            })
            .addCase(updateCartItemQuantity.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update cart item";
            })
            // Remove Cart Item
            .addCase(removeCartItem.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) =>
            {
                state.loading=false;
                const cart=action.payload.cart||action.payload;
                if (cart.items||cart.cartItems)
                {
                    state.items=cart.items||cart.cartItems;
                    state.totalItems=cart.totalItems||state.items.length;
                    state.totalPrice=cart.totalPrice||cart.total||0;
                } else
                {
                    state.items=state.items.filter(
                        item => item.productId!==action.payload.productId
                    );
                    state.totalItems=state.items.length;
                }
            })
            .addCase(removeCartItem.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to remove cart item";
            })
            // Empty Cart
            .addCase(emptyCart.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(emptyCart.fulfilled, (state) =>
            {
                state.loading=false;
                state.items=[];
                state.totalItems=0;
                state.totalPrice=0;
            })
            .addCase(emptyCart.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to clear cart";
            });
    },
});

export const {clearError, resetCart}=cartSlice.actions;
export default cartSlice.reducer;
