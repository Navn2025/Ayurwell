import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import
{
    fetchAllAddresses,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
    clearError
} from '../../store/slices/address.slice';
import ConfirmModal from '../../components/UI/ConfirmModal';
import Modal from '../../components/UI/Modal';

const Addresses=() =>
{
    const dispatch=useDispatch();

    const {addresses, loading, error}=useSelector((state) => state.address);

    const [showForm, setShowForm]=useState(false);
    const [editingAddress, setEditingAddress]=useState(null);
    const [successMessage, setSuccessMessage]=useState('');
    const [isMobile, setIsMobile]=useState(false);
    const [deleteModalOpen, setDeleteModalOpen]=useState(false);
    const [addressToDelete, setAddressToDelete]=useState(null);

    const [formData, setFormData]=useState({
        saveAs: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
    });

    const [formErrors, setFormErrors]=useState({});

    useEffect(() =>
    {
        dispatch(fetchAllAddresses());
    }, [dispatch]);

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

    useEffect(() =>
    {
        if (successMessage)
        {
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [successMessage]);

    const validateForm=useCallback((data) =>
    {
        const errors={};

        if (!data.saveAs.trim())
        {
            errors.saveAs='Save As is required';
        }

        if (!data.phoneNumber.trim())
        {
            errors.phoneNumber='Phone number is required';
        } else if (!/^\d{10}$/.test(data.phoneNumber.replace(/\s/g, '')))
        {
            errors.phoneNumber='Phone number must be 10 digits';
        }

        if (!data.addressLine1.trim())
        {
            errors.addressLine1='Address Line 1 is required';
        }

        if (!data.city.trim())
        {
            errors.city='City is required';
        }

        if (!data.state.trim())
        {
            errors.state='State is required';
        }

        if (!data.postalCode.trim())
        {
            errors.postalCode='PIN code is required';
        } else if (!/^\d{6}$/.test(data.postalCode))
        {
            errors.postalCode='PIN code must be 6 digits';
        }

        return errors;
    }, []);

    const handleChange=useCallback((e) =>
    {
        const {name, value, type, checked}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type==='checkbox'? checked:value
        }));

        // Clear error for this field
        if (formErrors[name])
        {
            setFormErrors(prev => ({...prev, [name]: ''}));
        }
    }, [formErrors]);

    const resetForm=useCallback(() =>
    {
        setFormData({
            saveAs: '',
            phoneNumber: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            isDefault: false
        });
        setEditingAddress(null);
        setShowForm(false);
        setFormErrors({});
    }, []);

    const handleSubmit=useCallback(async (e) =>
    {
        e.preventDefault();

        const errors=validateForm(formData);
        if (Object.keys(errors).length>0)
        {
            setFormErrors(errors);
            return;
        }

        let result;
        if (editingAddress)
        {
            result=await dispatch(editAddress({id: editingAddress.id, ...formData}));
        } else
        {
            result=await dispatch(addAddress(formData));
        }

        if (!result.error)
        {
            setSuccessMessage(editingAddress? 'Address updated successfully!':'Address added successfully!');
            resetForm();
            dispatch(fetchAllAddresses());
        }
    }, [formData, editingAddress, validateForm, resetForm, dispatch]);

    const handleEdit=useCallback((address) =>
    {
        setEditingAddress(address);
        setFormData({
            saveAs: address.saveAs,
            phoneNumber: address.phoneNumber,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2||'',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country||'India',
            isDefault: address.isDefault
        });
        setFormErrors({});
        setShowForm(true);
    }, []);

    const handleDeleteClick=useCallback((address) =>
    {
        setAddressToDelete(address);
        setDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm=useCallback(async () =>
    {
        if (addressToDelete)
        {
            const result=await dispatch(removeAddress(addressToDelete.id));
            if (!result.error)
            {
                setSuccessMessage('Address deleted successfully!');
                dispatch(fetchAllAddresses());
            }
            setDeleteModalOpen(false);
            setAddressToDelete(null);
        }
    }, [addressToDelete, dispatch]);

    const handleSetDefault=useCallback(async (addressId) =>
    {
        const result=await dispatch(makeDefaultAddress(addressId));
        if (!result.error)
        {
            setSuccessMessage('Default address updated!');
            dispatch(fetchAllAddresses());
        }
    }, [dispatch]);

    const indianStates=[
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
    ];

    if (loading&&!addresses)
    {
        return (
            <div className="min-h-screen bg-[#fffcef] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
                    <p className="text-[#1a472a]">Loading addresses...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#fffcef] py-4 sm:py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white shadow-sm  mb-4 sm:mb-6">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                            <h1 className="text-xl sm:text-2xl font-bold text-[#1a472a]">My Addresses</h1>
                            <p className="text-sm text-[#1a472a]/80 mt-1">Manage your delivery addresses</p>
                        </div>
                    </div>

                    {/* Success Message Display */}
                    {successMessage&&(
                        <div className="mb-4 bg-green-50 border border-green-200 p-4 transition-all duration-300">
                            <div className="flex">
                                <div className="shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-green-800">{successMessage}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setSuccessMessage('')}
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
                        <div className="mb-4 bg-red-50 border border-red-200  p-4 transition-all duration-300">
                            <div className="flex">
                                <div className="shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-red-800 break-all">{error.message||error}</p>
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

                    {/* Add Address Button */}
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Address
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading&&!showForm&&(
                        <div className="flex items-center justify-center h-64 text-[#1a472a]/80">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a472a] mr-3"></div>
                            Loading addresses...
                        </div>
                    )}

                    {/* Address List */}
                    {!loading&&addresses&&addresses.length>0? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {addresses.map(address => (
                                <div
                                    key={address.id}
                                    className={`bg-white shadow-sm  overflow-hidden ${address.isDefault? 'border-2 border-[#1a472a]':'border border-gray-200'
                                        }`}
                                >
                                    <div className="p-4 sm:p-6">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-[#1a472a] text-lg">{address.saveAs}</h3>
                                                    {address.isDefault&&(
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm">{address.phoneNumber}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(address)}
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(address)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Address Details */}
                                        <div className="space-y-2">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {address.addressLine1}
                                                {address.addressLine2&&<>, {address.addressLine2}</>}
                                            </p>
                                            <p className="text-gray-700 text-sm">
                                                {address.city}, {address.state} - {address.postalCode}
                                            </p>
                                            <p className="text-gray-700 text-sm">
                                                {address.country}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                                            {!address.isDefault&&(
                                                <button
                                                    onClick={() => handleSetDefault(address.id)}
                                                    className="text-[#1a472a] hover:text-[#14532d] text-sm font-medium flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Set as Default
                                                </button>
                                            )}
                                            {address.isDefault&&(
                                                <span className="text-green-600 text-sm font-medium">
                                                    Default Address
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ):!loading&&!showForm&&(
                        <div className="bg-white shadow-sm rounded-lg p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-[#1a472a] mb-2">No addresses saved</h3>
                            <p className="text-gray-500 mb-4">Add a delivery address to get started</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors"
                            >
                                Add Your First Address
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Address Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={resetForm}
                title={editingAddress? 'Edit Address':'Add New Address'}
                size="lg"
                showCloseButton={true}
                closeOnOverlayClick={false}
            >
                <div className="px-6 py-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Address Type Selection */}
                        <div className="bg-gradient-to-r from-[#1a472a]/5 to-[#2d5a3d]/5 rounded-xl p-4 border border-[#1a472a]/10">
                            <label className="block text-sm font-semibold text-[#1a472a] mb-3">Address Type *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['Home', 'Office', 'Other'].map((type) => (
                                    <label key={type} className="relative">
                                        <input
                                            type="radio"
                                            name="saveAs"
                                            value={type}
                                            checked={formData.saveAs===type}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className={`px-4 py-2 text-center rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.saveAs===type
                                            ? 'border-[#1a472a] bg-[#1a472a] text-white'
                                            :'border-gray-200 bg-white text-gray-700 hover:border-[#1a472a]/30'
                                            }`}>
                                            {type}
                                        </div>
                                    </label>
                                ))}
                                <label className="relative">
                                    <input
                                        type="radio"
                                        name="saveAs"
                                        value="Custom"
                                        checked={!['Home', 'Office', 'Other'].includes(formData.saveAs)&&formData.saveAs!==''}
                                        onChange={() => setFormData(prev => ({...prev, saveAs: ''}))}
                                        className="sr-only peer"
                                    />
                                    <div className={`px-4 py-2 text-center rounded-lg border-2 cursor-pointer transition-all duration-200 ${!['Home', 'Office', 'Other'].includes(formData.saveAs)&&formData.saveAs!==''
                                        ? 'border-[#1a472a] bg-[#1a472a] text-white'
                                        :'border-gray-200 bg-white text-gray-700 hover:border-[#1a472a]/30'
                                        }`}>
                                        Custom
                                    </div>
                                </label>
                            </div>
                            {!['Home', 'Office', 'Other'].includes(formData.saveAs)&&(
                                <input
                                    type="text"
                                    name="saveAs"
                                    value={formData.saveAs}
                                    onChange={handleChange}
                                    className={`mt-3 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.saveAs? 'border-red-500':'border-gray-300'
                                        }`}
                                    placeholder="Enter custom name"
                                />
                            )}
                            {formErrors.saveAs&&(
                                <p className="mt-2 text-sm text-red-600">{formErrors.saveAs}</p>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#1a472a] flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Contact Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.phoneNumber? 'border-red-500':'border-gray-300'
                                            }`}
                                        placeholder="10-digit mobile number"
                                    />
                                </div>
                                {formErrors.phoneNumber&&(
                                    <p className="mt-2 text-sm text-red-600">{formErrors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#1a472a] flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Address Details
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.addressLine1? 'border-red-500':'border-gray-300'
                                        }`}
                                    placeholder="House No, Building, Street"
                                />
                                {formErrors.addressLine1&&(
                                    <p className="mt-2 text-sm text-red-600">{formErrors.addressLine1}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                    placeholder="Landmark, Area, Floor, etc."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.city? 'border-red-500':'border-gray-300'
                                            }`}
                                        placeholder="City"
                                    />
                                    {formErrors.city&&(
                                        <p className="mt-2 text-sm text-red-600">{formErrors.city}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.state? 'border-red-500':'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select State</option>
                                        {indianStates.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    {formErrors.state&&(
                                        <p className="mt-2 text-sm text-red-600">{formErrors.state}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code *</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent ${formErrors.postalCode? 'border-red-500':'border-gray-300'
                                            }`}
                                        placeholder="6-digit PIN"
                                    />
                                    {formErrors.postalCode&&(
                                        <p className="mt-2 text-sm text-red-600">{formErrors.postalCode}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Default Address Setting */}
                        <div className="bg-gradient-to-r from-[#1a472a]/5 to-[#2d5a3d]/5 rounded-xl p-4 border border-[#1a472a]/10">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-[#1a472a] rounded focus:ring-2 focus:ring-[#1a472a] focus:ring-offset-2"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    Set as default address
                                </span>
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Saving...
                                    </>
                                ):(
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {editingAddress? 'Update Address':'Add Address'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Address"
                message="Are you sure you want to delete this address? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                loading={loading}
            />
        </>
    );
};

export default Addresses;
