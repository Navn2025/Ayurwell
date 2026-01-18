import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

// Add fade-in animation
const fadeAnimation=`
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
import
{
    fetchUserProfile,
    updateUserProfile,
    deleteUserAccount,
    setEditMode,
    updateFormData,
    resetFormData,
    setShowDeleteModal,
    setShowSuccessModal,
    clearError,
    clearSuccessMessage
} from '../../store/slices/profile.slice';
import {logoutUser} from '../../store/slices/auth.slice';

import AlertModal from '../../components/UI/AlertModal';
import ConfirmModal from '../../components/UI/ConfirmModal';
import Modal from '../../components/UI/Modal';

const Profile=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const {
        user,
        loading,
        updating,
        deleting,
        editMode,
        showDeleteModal,
        showSuccessModal,
        formData,
        error,
        successMessage,
        modalMessage,
        modalType
    }=useSelector(state => state.profile);

    // Local state for form validation
    const [formErrors, setFormErrors]=useState({});
    const [isMobile, setIsMobile]=useState(false);

    useEffect(() =>
    {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() =>
    {
        if (successMessage)
        {
            setTimeout(() =>
            {
                dispatch(clearSuccessMessage());
            }, 5000);
        }
    }, [successMessage, dispatch]);

    // Detect mobile view
    useEffect(() =>
    {
        const checkMobile=() =>
        {
            setIsMobile(window.innerWidth<768);
        }

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Form validation functions
    const validateProfileForm=(data) =>
    {
        const errors={};

        if (!data.email.trim())
        {
            errors.email='Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email))
        {
            errors.email='Email is invalid';
        }

        if (!data.firstName.trim())
        {
            errors.firstName='First name is required';
        } else if (data.firstName.trim().length<2)
        {
            errors.firstName='First name must be at least 2 characters';
        }

        if (!data.lastName.trim())
        {
            errors.lastName='Last name is required';
        } else if (data.lastName.trim().length<2)
        {
            errors.lastName='Last name must be at least 2 characters';
        }

        if (!data.phoneNumber.trim())
        {
            errors.phoneNumber='Phone number is required';
        } else if (!/^\d{10}$/.test(data.phoneNumber.replace(/\s/g, '')))
        {
            errors.phoneNumber='Phone number must be 10 digits';
        }

        return errors;
    };



    // Event handlers
    const handleEditToggle=() =>
    {
        if (editMode)
        {
            dispatch(setEditMode(false));
            dispatch(resetFormData());
            setFormErrors({});
        } else
        {
            dispatch(setEditMode(true));
        }
    };

    const handleInputChange=(e) =>
    {
        const {name, value}=e.target;
        dispatch(updateFormData({[name]: value}));

        // Clear error for this field
        if (formErrors[name])
        {
            setFormErrors(prev => ({...prev, [name]: ''}));
        }
    };



    const handleUpdateProfile=async (e) =>
    {
        e.preventDefault();

        const errors=validateProfileForm(formData);
        if (Object.keys(errors).length>0)
        {
            setFormErrors(errors);
            return;
        }

        const result=await dispatch(updateUserProfile(formData));
        if (!result.error)
        {
            setFormErrors({});
        }
    };

    const handleDeleteAccount=async () =>
    {
        dispatch(logoutUser());
        const result=await dispatch(deleteUserAccount());
        if (!result.error)
        {
            // Logout and redirect to home
            navigate('/');
        }
    };



    const handleCancelEdit=() =>
    {
        dispatch(setEditMode(false));
        dispatch(resetFormData());
        setFormErrors({});
    };

    const formatDate=(dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading&&!user)
    {
        return (
            <div className="min-h-screen bg-[#fffcef] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
                    <p className="text-[#1a472a]">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{fadeAnimation}</style>
            <div className="min-h-screen bg-[#fffcef] py-4 sm:py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white shadow-sm mb-4 sm:mb-6">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#1a472a]">My Profile</h1>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="bg-white shadow-sm ">
                        <div className="p-4 sm:p-6">
                            {/* Profile Header */}
                            <div className={`flex flex-col ${isMobile? 'space-y-4':'sm:flex-row sm:items-center sm:justify-between'} mb-6`}>
                                <div className={`flex ${isMobile? 'flex-col':'items-center'} space-x-4`}>
                                    <div className="h-12 w-12 sm:h-16 sm:w-16 bg-[#1a472a] rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-lg sm:text-xl font-bold">
                                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                                        </span>
                                    </div>
                                    <div className={`${isMobile? 'mt-3':''}`}>
                                        <h2 className="text-lg sm:text-xl font-semibold text-[#1a472a]">
                                            {user?.firstName} {user?.lastName}
                                        </h2>
                                        <p className="text-sm text-gray-500 break-all">{user?.email}</p>
                                        <div className={`flex ${isMobile? 'flex-col':'items-center'} mt-1 space-y-1 sm:space-y-0 sm:space-x-2`}>
                                            <span className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.isEmailVerified
                                                ? 'bg-green-100 text-green-800'
                                                :'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {user?.isEmailVerified? 'Verified':'Not Verified'}
                                            </span>
                                            <span className={`${isMobile? 'text-xs':'ml-2 text-xs'} text-gray-500`}>
                                                Member since {user?.createdAt&&formatDate(user.createdAt)}
                                                {console.log(user)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex ${isMobile? 'flex-col space-y-2 mt-4':'space-x-3'} mt-4 sm:mt-0`}>
                                    {!editMode? (
                                        <button
                                            onClick={handleEditToggle}
                                            className={`px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors ${isMobile? 'w-full':''}`}
                                        >
                                            Edit Profile
                                        </button>
                                    ):(
                                        <>
                                            <button
                                                onClick={handleCancelEdit}
                                                className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${isMobile? 'w-full':''}`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateProfile}
                                                disabled={updating}
                                                className={`px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors disabled:opacity-50 ${isMobile? 'w-full':''}`}
                                            >
                                                {updating? 'Saving...':'Save Changes'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Profile Form */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    {editMode? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.firstName? 'border-red-500':'border-gray-300'
                                                }`}
                                        />
                                    ):(
                                        <p className="text-gray-900">{user?.firstName}</p>
                                    )}
                                    {formErrors.firstName&&(
                                        <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    {editMode? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.lastName? 'border-red-500':'border-gray-300'
                                                }`}
                                        />
                                    ):(
                                        <p className="text-gray-900">{user?.lastName}</p>
                                    )}
                                    {formErrors.lastName&&(
                                        <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    {editMode? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.email? 'border-red-500':'border-gray-300'
                                                }`}
                                        />
                                    ):(
                                        <p className="text-gray-900 break-all">{user?.email}</p>
                                    )}
                                    {formErrors.email&&(
                                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    {editMode? (
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.phoneNumber? 'border-red-500':'border-gray-300'
                                                }`}
                                        />
                                    ):(
                                        <p className="text-gray-900">{user?.phoneNumber}</p>
                                    )}
                                    {formErrors.phoneNumber&&(
                                        <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                                    )}
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-medium text-[#1a472a] mb-4">Account Actions</h3>
                                <div className={`${isMobile? 'space-y-3':'flex flex-wrap gap-3'}`}>
                                    <button
                                        onClick={() => dispatch(setShowDeleteModal(true))}
                                        className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${isMobile? 'w-full':''}`}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Success Message Display */}
                    {successMessage&&(
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 transition-all duration-300 transform" style={{
                            animation: 'fadeIn 0.3s ease-in-out'
                        }}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-green-800">{successMessage}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => dispatch(clearSuccessMessage())}
                                        className="text-green-400 hover:text-green-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {error&&(
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 transition-all duration-300 transform" style={{
                            animation: 'fadeIn 0.3s ease-in-out'
                        }}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-red-800 break-all">{error}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => dispatch(clearError())}
                                        className="text-red-400 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Account Confirmation Modal */}
                <ConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => dispatch(setShowDeleteModal(false))}
                    onConfirm={handleDeleteAccount}
                    title="Delete Account"
                    message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
                    confirmText="Delete Account"
                    cancelText="Cancel"
                    type="danger"
                    loading={deleting}
                />

                {/* Success/Error Alert Modal */}
                <AlertModal
                    isOpen={showSuccessModal}
                    onClose={() => dispatch(setShowSuccessModal({show: false, message: '', type: 'success'}))}
                    type={modalType}
                    message={modalMessage}
                    autoClose={modalType==='success'}
                    autoCloseDelay={modalType==='success'? 2000:0}
                />
            </div>
        </>
    );
};

export default Profile;