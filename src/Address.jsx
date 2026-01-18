import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import
{
    fetchAllAddresses,
    addAddress,
    editAddress,
    removeAddress,
    makeDefaultAddress,
    clearError
} from './store/slices/address.slice';

const Address=() =>
{
    const dispatch=useDispatch();
    const {addresses, loading, error}=useSelector(state => state.address);
    const {user}=useSelector(state => state.auth);

    const [showForm, setShowForm]=useState(false);
    const [editingAddress, setEditingAddress]=useState(null);
    const [success, setSuccess]=useState('');

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

    useEffect(() =>
    {
        dispatch(fetchAllAddresses());
    }, [dispatch]);

    useEffect(() =>
    {
        if (editingAddress)
        {
            setFormData({
                saveAs: editingAddress.saveAs||'',
                phoneNumber: editingAddress.phoneNumber||'',
                addressLine1: editingAddress.addressLine1||'',
                addressLine2: editingAddress.addressLine2||'',
                city: editingAddress.city||'',
                state: editingAddress.state||'',
                postalCode: editingAddress.postalCode||'',
                country: editingAddress.country||'India',
                isDefault: editingAddress.isDefault||false
            });
            setShowForm(true);
        }
    }, [editingAddress]);

    const handleChange=(e) =>
    {
        const {name, value, type, checked}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type==='checkbox'? checked:value
        }));
    };

    const resetForm=() =>
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
    };

    const handleSubmit=async (e) =>
    {
        e.preventDefault();

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
            setSuccess(editingAddress? 'Address updated successfully!':'Address added successfully!');
            resetForm();
            dispatch(fetchAllAddresses());
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handleDelete=async (addressId) =>
    {
        if (window.confirm('Are you sure you want to delete this address?'))
        {
            const result=await dispatch(removeAddress(addressId));
            if (!result.error)
            {
                setSuccess('Address deleted successfully!');
                dispatch(fetchAllAddresses());
                setTimeout(() => setSuccess(''), 3000);
            }
        }
    };

    const handleSetDefault=async (addressId) =>
    {
        const result=await dispatch(makeDefaultAddress(addressId));
        if (!result.error)
        {
            setSuccess('Default address updated!');
            dispatch(fetchAllAddresses());
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const indianStates=[
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
                        <p className="text-gray-500 mt-1">Manage your delivery addresses</p>
                    </div>
                    {!showForm&&(
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                        >
                            <span className="text-xl">+</span>
                            Add New Address
                        </button>
                    )}
                </div>

                {/* Success Message */}
                {success&&(
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <span className="text-green-700">{success}</span>
                        <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">&times;</button>
                    </div>
                )}

                {/* Error Message */}
                {error&&(
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                        <span className="text-red-700">{error?.message||error}</span>
                        <button onClick={() => dispatch(clearError())} className="text-red-500 hover:text-red-700">&times;</button>
                    </div>
                )}

                {/* Add/Edit Form */}
                {showForm&&(
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingAddress? 'Edit Address':'Add New Address'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Save As *</label>
                                    <input
                                        type="text"
                                        name="saveAs"
                                        value={formData.saveAs}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g., Home, Office, etc."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="10-digit mobile number"
                                        pattern="[0-9]{10}"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    required
                                    placeholder="House No, Building, Street"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    placeholder="Landmark, Area (Optional)"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="City"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select State</option>
                                        {indianStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code *</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="6-digit PIN"
                                        pattern="[0-9]{6}"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                                />
                                <label htmlFor="isDefault" className="text-sm text-gray-700">
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                                >
                                    {loading? 'Saving...':editingAddress? 'Update Address':'Add Address'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Loading State */}
                {loading&&!showForm&&(
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        Loading addresses...
                    </div>
                )}

                {/* Address List */}
                {!loading&&addresses&&addresses.length>0? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(address => (
                            <div
                                key={address.id}
                                className={`bg-white rounded-lg shadow p-5 relative ${address.isDefault? 'border-2 border-green-500':''}`}
                            >
                                {/* Default Badge */}
                                {address.isDefault&&(
                                    <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                        Default
                                    </span>
                                )}

                                {/* Name & Phone */}
                                <h3 className="font-semibold text-gray-800 mb-1">{address.saveAs}</h3>
                                <p className="text-gray-600 text-sm mb-3">{address.phoneNumber}</p>

                                {/* Address */}
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {address.addressLine1}
                                    {address.addressLine2&&<>, {address.addressLine2}</>}
                                    <br />
                                    {address.city}, {address.state} - {address.postalCode}
                                    <br />
                                    {address.country}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setEditingAddress(address)}
                                        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                    {!address.isDefault&&(
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="text-green-500 hover:text-green-700 text-sm font-medium ml-auto"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ):!loading&&!showForm&&(
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl text-gray-400">📍</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No addresses saved</h3>
                        <p className="text-gray-500 mb-4">Add a delivery address to get started</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Add Your First Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Address;