import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||'http://localhost:3000/api';

// ══════════════════════════════════════════════════════════════════
// 👤 ASYNC THUNKS
// ══════════════════════════════════════════════════════════════════

// Get current user profile
export const fetchUserProfile=createAsyncThunk(
    'profile/fetchUserProfile',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.get(
                `${API_BASE_URL}/auth/current/user`,
                {withCredentials: true}
            );
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Update user profile
export const updateUserProfile=createAsyncThunk(
    'profile/updateUserProfile',
    async (profileData, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.put(
                `${API_BASE_URL}/auth/update-user`,
                profileData,
                {withCredentials: true}
            );
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Delete user account
export const deleteUserAccount=createAsyncThunk(
    'profile/deleteUserAccount',
    async (_, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.delete(
                `${API_BASE_URL}/auth/delete`,
                {withCredentials: true}
            );
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// Change password
export const changePassword=createAsyncThunk(
    'profile/changePassword',
    async ({currentPassword, newPassword}, {rejectWithValue}) =>
    {
        try
        {
            const response=await axios.post(
                `${API_BASE_URL}/auth/change-password`,
                {currentPassword, newPassword},
                {withCredentials: true}
            );
            return response.data;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

// ══════════════════════════════════════════════════════════════════
// 👤 REDUX SLICE
// ══════════════════════════════════════════════════════════════════

const profileSlice=createSlice({
    name: 'profile',
    initialState: {
        // User data
        user: null,

        // UI state
        loading: false,
        updating: false,
        deleting: false,
        changingPassword: false,

        // Forms state
        editMode: false,
        showDeleteModal: false,
        showPasswordModal: false,
        showSuccessModal: false,

        // Form data
        formData: {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: ''
        },

        passwordData: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },

        // Error handling
        error: null,
        successMessage: null,

        // Modal messages
        modalMessage: '',
        modalType: 'success' // 'success', 'error', 'warning', 'info'
    },

    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },

        clearSuccessMessage: (state) =>
        {
            state.successMessage=null;
        },

        setEditMode: (state, action) =>
        {
            state.editMode=action.payload;
            if (action.payload)
            {
                // Initialize form data with current user data
                state.formData={
                    email: state.user?.email||'',
                    firstName: state.user?.firstName||'',
                    lastName: state.user?.lastName||'',
                    phoneNumber: state.user?.phoneNumber||''
                };
            }
        },

        updateFormData: (state, action) =>
        {
            state.formData={...state.formData, ...action.payload};
        },

        resetFormData: (state) =>
        {
            state.formData={
                email: state.user?.email||'',
                firstName: state.user?.firstName||'',
                lastName: state.user?.lastName||'',
                phoneNumber: state.user?.phoneNumber||''
            };
        },

        setShowDeleteModal: (state, action) =>
        {
            state.showDeleteModal=action.payload;
        },

        setShowPasswordModal: (state, action) =>
        {
            state.showPasswordModal=action.payload;
            if (!action.payload)
            {
                // Reset password form when closing modal
                state.passwordData={
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };
            }
        },

        setShowSuccessModal: (state, action) =>
        {
            state.showSuccessModal=action.payload.show;
            if (action.payload.show)
            {
                state.modalMessage=action.payload.message||'';
                state.modalType=action.payload.type||'success';
            } else
            {
                // Clear modal data when closing
                state.modalMessage='';
                state.modalType='success';
            }
        },

        updatePasswordData: (state, action) =>
        {
            state.passwordData={...state.passwordData, ...action.payload};
        },

        resetPasswordData: (state) =>
        {
            state.passwordData={
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
        },

        setUser: (state, action) =>
        {
            state.user=action.payload;
        }
    },

    extraReducers: (builder) =>
    {
        // Fetch user profile
        builder
            .addCase(fetchUserProfile.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.user=action.payload.user;
                // Initialize form data
                state.formData={
                    email: action.payload.user?.email||'',
                    firstName: action.payload.user?.firstName||'',
                    lastName: action.payload.user?.lastName||'',
                    phoneNumber: action.payload.user?.phoneNumber||''
                };
            })
            .addCase(fetchUserProfile.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||'Failed to fetch profile';
            });

        // Update user profile
        builder
            .addCase(updateUserProfile.pending, (state) =>
            {
                state.updating=true;
                state.error=null;
                state.successMessage=null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) =>
            {
                state.updating=false;
                state.successMessage=action.payload.message||'Profile updated successfully!';
                state.user=action.payload.user||state.user; // Update user if returned
                state.editMode=false;

                // Don't show modal - just show success message
                state.showSuccessModal=false;
                state.modalMessage='';
                state.modalType='success';
            })
            .addCase(updateUserProfile.rejected, (state, action) =>
            {
                state.updating=false;
                state.error=action.payload?.message||'Failed to update profile';

                // Don't show modal - just show error message
                state.showSuccessModal=false;
                state.modalMessage='';
                state.modalType='success';
            });

        // Delete user account
        builder
            .addCase(deleteUserAccount.pending, (state) =>
            {
                state.deleting=true;
                state.error=null;
            })
            .addCase(deleteUserAccount.fulfilled, (state, action) =>
            {
                state.deleting=false;
                state.successMessage=action.payload.message;
                state.showDeleteModal=false;
                state.user=null;

                // Show success modal
                state.showSuccessModal=true;
                state.modalMessage='Account deleted successfully!';
                state.modalType='success';
            })
            .addCase(deleteUserAccount.rejected, (state, action) =>
            {
                state.deleting=false;
                state.error=action.payload?.message||'Failed to delete account';
                state.showDeleteModal=false;

                // Show error modal
                state.showSuccessModal=true;
                state.modalMessage=state.error;
                state.modalType='error';
            });

        // Change password
        builder
            .addCase(changePassword.pending, (state) =>
            {
                state.changingPassword=true;
                state.error=null;
            })
            .addCase(changePassword.fulfilled, (state, action) =>
            {
                state.changingPassword=false;
                state.successMessage=action.payload.message;
                state.showPasswordModal=false;
                state.passwordData={
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };

                // Show success modal
                state.showSuccessModal=true;
                state.modalMessage='Password changed successfully!';
                state.modalType='success';
            })
            .addCase(changePassword.rejected, (state, action) =>
            {
                state.changingPassword=false;
                state.error=action.payload?.message||'Failed to change password';

                // Show error modal
                state.showSuccessModal=true;
                state.modalMessage=state.error;
                state.modalType='error';
            });
    }
});

export const {
    clearError,
    clearSuccessMessage,
    setEditMode,
    updateFormData,
    resetFormData,
    setShowDeleteModal,
    setShowPasswordModal,
    setShowSuccessModal,
    updatePasswordData,
    resetPasswordData,
    setUser
}=profileSlice.actions;

export default profileSlice.reducer;