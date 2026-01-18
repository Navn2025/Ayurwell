import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    getAllAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from "../../api/address.api";

// Async Thunks
export const fetchAllAddresses=createAsyncThunk(
    "address/fetchAllAddresses",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await getAllAddresses();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const addAddress=createAsyncThunk(
    "address/addAddress",
    async (addressData, {rejectWithValue}) =>
    {
        try
        {
            const response=await createAddress(addressData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const editAddress=createAsyncThunk(
    "address/editAddress",
    async (addressData, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateAddress(addressData);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const removeAddress=createAsyncThunk(
    "address/removeAddress",
    async (addressId, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteAddress(addressId);
            return {...response, addressId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const makeDefaultAddress=createAsyncThunk(
    "address/makeDefaultAddress",
    async (addressId, {rejectWithValue}) =>
    {
        try
        {
            const response=await setDefaultAddress(addressId);
            return {...response, addressId};
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const addressSlice=createSlice({
    name: "address",
    initialState: {
        addresses: [],
        defaultAddress: null,
        selectedAddress: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        selectAddress: (state, action) =>
        {
            state.selectedAddress=action.payload;
        },
        clearSelectedAddress: (state) =>
        {
            state.selectedAddress=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch All Addresses
            .addCase(fetchAllAddresses.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchAllAddresses.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.addresses=action.payload.address||action.payload.addresses||action.payload||[];
                state.defaultAddress=state.addresses.find(addr => addr.isDefault)||null;
            })
            .addCase(fetchAllAddresses.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to fetch addresses";
            })
            // Add Address
            .addCase(addAddress.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(addAddress.fulfilled, (state, action) =>
            {
                state.loading=false;
                const newAddress=action.payload.address||action.payload;
                state.addresses.push(newAddress);
                if (newAddress.isDefault)
                {
                    state.addresses=state.addresses.map(addr => ({
                        ...addr,
                        isDefault: addr.id===newAddress.id
                    }));
                    state.defaultAddress=newAddress;
                }
            })
            .addCase(addAddress.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to add address";
            })
            // Edit Address
            .addCase(editAddress.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(editAddress.fulfilled, (state, action) =>
            {
                state.loading=false;
                const updated=action.payload.address||action.payload;
                const index=state.addresses.findIndex(a => a.id===updated.id);
                if (index!==-1)
                {
                    state.addresses[index]=updated;
                }
                if (updated.isDefault)
                {
                    state.defaultAddress=updated;
                }
            })
            .addCase(editAddress.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to update address";
            })
            // Remove Address
            .addCase(removeAddress.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(removeAddress.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.addresses=state.addresses.filter(a => a.id!==action.payload.addressId);
                if (state.defaultAddress?.id===action.payload.addressId)
                {
                    state.defaultAddress=state.addresses.find(addr => addr.isDefault)||null;
                }
            })
            .addCase(removeAddress.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to delete address";
            })
            // Make Default Address
            .addCase(makeDefaultAddress.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(makeDefaultAddress.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.addresses=state.addresses.map(addr => ({
                    ...addr,
                    isDefault: addr.id===action.payload.addressId
                }));
                state.defaultAddress=state.addresses.find(a => a.id===action.payload.addressId)||null;
            })
            .addCase(makeDefaultAddress.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Failed to set default address";
            });
    },
});

export const {clearError, selectAddress, clearSelectedAddress}=addressSlice.actions;
export default addressSlice.reducer;
