import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    completeProfile,
    deleteAccount,
    forgotPassword,
    resetPassword
} from "../../api/auth.api";

export const registerUser=createAsyncThunk(
    "auth/registerUser",
    async ({email, password, firstName, lastName, phoneNumber}, {rejectWithValue}) =>
    {
        try
        {
            const response=await register(email, password, firstName, lastName, phoneNumber);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const loginUser=createAsyncThunk(
    "auth/loginUser",
    async ({email, password}, {rejectWithValue}) =>
    {
        try
        {
            const response=await login(email, password);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const logoutUser=createAsyncThunk(
    "auth/logoutUser",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await logout();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const fetchCurrentUser=createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, {rejectWithValue}) =>
    {
        // Prevent multiple simultaneous calls


        try
        {
            const response=await getCurrentUser();
            console.log("fetchCurrentUser response:", response);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const updateUserProfile=createAsyncThunk(
    "auth/updateUserProfile",
    async ({firstName, lastName, phoneNumber}, {rejectWithValue}) =>
    {
        try
        {
            const response=await updateProfile(firstName, lastName, phoneNumber);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const completeUserProfile=createAsyncThunk(
    "auth/completeUserProfile",
    async ({firstName, lastName, phoneNumber}, {rejectWithValue}) =>
    {
        try
        {
            const response=await completeProfile(firstName, lastName, phoneNumber);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const deleteUserAccount=createAsyncThunk(
    "auth/deleteUserAccount",
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await deleteAccount();
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const forgotUserPassword=createAsyncThunk(
    "auth/forgotUserPassword",
    async ({email}, {rejectWithValue}) =>
    {
        try
        {
            const response=await forgotPassword(email);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const resetUserPassword=createAsyncThunk(
    "auth/resetUserPassword",
    async ({token, newPassword}, {rejectWithValue}) =>
    {
        try
        {
            const response=await resetPassword(token, newPassword);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const authSlice=createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: true, // Start as true to wait for auth check
        error: null,
        message: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
            state.message=null;
        },
        clearAuth: (state) =>
        {
            state.user=null;
            state.isAuthenticated=false;
            state.error=null;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            .addCase(registerUser.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(registerUser.fulfilled, (state, action) =>
            {
                state.loading=false;
                // Handle both {user: {...}} and direct user object
                state.user=action.payload?.user||action.payload;
                state.isAuthenticated=!!state.user?.id;
            })
            .addCase(registerUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Registration failed";
            })
            .addCase(loginUser.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(loginUser.fulfilled, (state, action) =>
            {
                state.loading=false;
                // Handle both {user: {...}} and direct user object
                state.user=action.payload?.user||action.payload;
                state.isAuthenticated=!!state.user?.id;
            })
            .addCase(loginUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Login failed";
            })
            .addCase(logoutUser.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(logoutUser.fulfilled, (state) =>
            {
                state.loading=false;
                state.user=null;
                state.isAuthenticated=false;
            })
            .addCase(logoutUser.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Logout failed";
            })
            .addCase(fetchCurrentUser.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) =>
            {
                state.loading=false;
                // Handle both {user: {...}} and direct user object response
                state.user=action.payload?.user||action.payload;
                state.isAuthenticated=!!state.user;
            })
            .addCase(fetchCurrentUser.rejected, (state) =>
            {
                state.loading=false;
                state.user=null;
                state.isAuthenticated=false;
            })
            .addCase(updateUserProfile.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.user=action.payload.user;
            })
            .addCase(updateUserProfile.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Update failed";
            })
            .addCase(completeUserProfile.fulfilled, (state, action) =>
            {
                state.user=action.payload.user;
            })
            .addCase(deleteUserAccount.fulfilled, (state) =>
            {
                state.user=null;
                state.isAuthenticated=false;
            })
            .addCase(forgotUserPassword.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(forgotUserPassword.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.message=action.payload?.message||"Password reset link sent successfully";
            })
            .addCase(forgotUserPassword.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message;
            })
            .addCase(resetUserPassword.pending, (state) =>
            {
                state.loading=true;
            })
            .addCase(resetUserPassword.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.message=action.payload?.message||"Password reset successfully";
            })
            .addCase(resetUserPassword.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message;
            });
    },
});

export const {clearError, clearAuth}=authSlice.actions;
export default authSlice.reducer;