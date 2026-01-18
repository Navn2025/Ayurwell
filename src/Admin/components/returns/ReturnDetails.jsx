import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import
    {
        fetchReturnById,
        updateReturnStatus,
        scheduleReturnPickup,
        clearError,
        clearSuccessMessage
    } from '../../../store/slices/return.slice';

const ReturnDetails=() =>
{
    const {returnId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {currentReturn, loading, updating, error, successMessage}=useSelector(state => state.return);

    const [showStatusModal, setShowStatusModal]=useState(false);
    const [showPickupModal, setShowPickupModal]=useState(false);
    const [statusForm, setStatusForm]=useState({status: '', notes: ''});
    const [pickupForm, setPickupForm]=useState({pickupDate: '', notes: ''});

    useEffect(() =>
    {
        if (returnId)
        {
            dispatch(fetchReturnById(returnId));
        }
    }, [dispatch, returnId]);

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

    const handleStatusUpdate=async () =>
    {
        if (!currentReturn||!statusForm.status) return;

        const result=await dispatch(updateReturnStatus({
            returnId: currentReturn.id,
            status: statusForm.status,
            notes: statusForm.notes
        }));

        if (!result.error)
        {
            setShowStatusModal(false);
            setStatusForm({status: '', notes: ''});
        }
    };

    const handlePickupSchedule=async () =>
    {
        if (!currentReturn||!pickupForm.pickupDate) return;

        const result=await dispatch(scheduleReturnPickup({
            returnId: currentReturn.id,
            pickupDate: pickupForm.pickupDate,
            pickupAddress: currentReturn.order.address,
            notes: pickupForm.notes
        }));

        if (!result.error)
        {
            setShowPickupModal(false);
            setPickupForm({pickupDate: '', notes: ''});
        }
    };

    const openStatusModal=() =>
    {
        setStatusForm({
            status: currentReturn.status,
            notes: ''
        });
        setShowStatusModal(true);
    };

    const openPickupModal=() =>
    {
        setPickupForm({
            pickupDate: '',
            notes: ''
        });
        setShowPickupModal(true);
    };

    const getStatusBadgeClass=(status) =>
    {
        const statusClasses={
            'REQUESTED': 'bg-yellow-100 text-yellow-700',
            'APPROVED': 'bg-blue-100 text-blue-700',
            'PICKUP_SCHEDULED': 'bg-purple-100 text-purple-700',
            'PICKED_UP': 'bg-indigo-100 text-indigo-700',
            'RECEIVED': 'bg-orange-100 text-orange-700',
            'COMPLETED': 'bg-green-100 text-green-700',
            'REJECTED': 'bg-red-100 text-red-700',
            'CANCELLED': 'bg-gray-100 text-gray-700'
        };
        return statusClasses[status]||'bg-gray-100 text-gray-700';
    };

    const formatDate=(dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency=(amount) =>
    {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getStatusOptions=(currentStatus) =>
    {
        const options={
            'REQUESTED': ['APPROVED', 'REJECTED', 'CANCELLED'],
            'APPROVED': ['PICKUP_SCHEDULED', 'CANCELLED'],
            'PICKUP_SCHEDULED': ['PICKED_UP', 'CANCELLED'],
            'PICKED_UP': ['RECEIVED', 'CANCELLED'],
            'RECEIVED': ['COMPLETED', 'REJECTED'],
            'REJECTED': [],
            'COMPLETED': [],
            'CANCELLED': []
        };
        return options[currentStatus]||[];
    };

    if (loading&&!currentReturn)
    {
        return <div className="flex items-center bg-[#fffcef] justify-center h-64 text-[#1a472a]">Loading return details...</div>;
    }

    if (!currentReturn)
    {
        return <div className="flex items-center bg-[#fffcef] justify-center h-64 text-red-500">Return not found</div>;
    }

    return (
        <div className="p-6 bg-[#fffcef] max-w-6xl">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/returns')}
                    className="text-[#1a472a] hover:text-[#14532d] flex items-center gap-1"
                >
                    ← Back to Returns
                </button>
                <h2 className="text-2xl font-bold text-[#1a472a]">
                    Return Details #{currentReturn.id.slice(-8)}
                </h2>
            </div>

            {successMessage&&(
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span className="text-green-700">{successMessage}</span>
                    <button
                        onClick={() => dispatch(clearSuccessMessage())}
                        className="text-green-500 hover:text-green-700 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => dispatch(clearError())}
                        className="text-red-500 hover:text-red-700 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Return Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Return Details */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Return Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Return ID:</span>
                                <p className="font-mono text-[#1a472a]">#{currentReturn.id.slice(-8)}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Status:</span>
                                <p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(currentReturn.status)}`}>
                                        {currentReturn.status.replace('_', ' ')}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Type:</span>
                                <p className="text-[#1a472a]">{currentReturn.isPartial? 'Partial Return':'Full Order Return'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Requested:</span>
                                <p className="text-[#1a472a]">{formatDate(currentReturn.createdAt)}</p>
                            </div>
                            <div className="col-span-2">
                                <span className="text-sm text-[#1a472a]/70">Reason:</span>
                                <p className="text-[#1a472a] mt-1">{currentReturn.reason}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Order Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Order ID:</span>
                                <p>
                                    <a href={`/admin/orders/${currentReturn.order.id}`} className="text-[#1a472a] hover:underline font-mono">
                                        #{currentReturn.order.orderNumber||currentReturn.order.id?.slice(-8)}
                                    </a>
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Order Status:</span>
                                <p className="text-[#1a472a]">{currentReturn.order.status}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Payment Method:</span>
                                <p className="text-[#1a472a]">{currentReturn.order.paymentMethod}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Order Total:</span>
                                <p className="text-[#1a472a]">{formatCurrency(currentReturn.order.totalAmount)}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-4">
                            <span className="text-sm text-[#1a472a]/70">Order Items:</span>
                            <div className="mt-2 space-y-2">
                                {currentReturn.order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div>
                                            <p className="text-[#1a472a] font-medium">{item.productName}</p>
                                            <p className="text-sm text-[#1a472a]/70">Qty: {item.quantity} | SKU: {item.sku}</p>
                                        </div>
                                        <p className="text-[#1a472a]">{formatCurrency(item.totalPrice)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Customer Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Name:</span>
                                <p className="text-[#1a472a]">
                                    {currentReturn.order.user
                                        ? `${currentReturn.order.user.firstName||''} ${currentReturn.order.user.lastName||''}`.trim()
                                        :'N/A'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Email:</span>
                                <p className="text-[#1a472a]">{currentReturn.order.user?.email||'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Phone:</span>
                                <p className="text-[#1a472a]">{currentReturn.order.user?.phoneNumber||'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-sm text-[#1a472a]/70">Delivery Address:</span>
                                <p className="text-[#1a472a] text-sm">
                                    {currentReturn.order.address
                                        ? `${currentReturn.order.address.addressLine1}, ${currentReturn.order.address.city}, ${currentReturn.order.address.state} - ${currentReturn.order.address.postalCode}`
                                        :'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Panel */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={openStatusModal}
                                disabled={getStatusOptions(currentReturn.status).length===0}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Update Status
                            </button>

                            {currentReturn.status==='APPROVED'&&(
                                <button
                                    onClick={openPickupModal}
                                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                >
                                    Schedule Pickup
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Status Timeline</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${getStatusBadgeClass(currentReturn.status).replace('text-', 'bg-').split(' ')[0]}`}></div>
                                <div>
                                    <p className="text-[#1a472a] font-medium">Return Requested</p>
                                    <p className="text-sm text-[#1a472a]/70">{formatDate(currentReturn.createdAt)}</p>
                                </div>
                            </div>

                            {currentReturn.status!=='REQUESTED'&&(
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${getStatusBadgeClass(currentReturn.status).replace('text-', 'bg-').split(' ')[0]}`}></div>
                                    <div>
                                        <p className="text-[#1a472a] font-medium">
                                            {currentReturn.status.replace('_', ' ')}
                                        </p>
                                        <p className="text-sm text-[#1a472a]/70">
                                            {formatDate(currentReturn.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Refund Information */}
                    {currentReturn.refunds&&currentReturn.refunds.length>0&&(
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Refund Information</h3>
                            <div className="space-y-3">
                                {currentReturn.refunds.map(refund => (
                                    <div key={refund.id} className="border border-[#1a472a]/20 rounded p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-mono text-sm text-[#1a472a]">
                                                #{refund.id.slice(-8)}
                                            </span>
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(refund.status)}`}>
                                                {refund.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-[#1a472a]">
                                            <p>Amount: {formatCurrency(refund.amount)}</p>
                                            <p>Type: {refund.type.replace('_', ' ')}</p>
                                            {refund.razorpayRefundId&&(
                                                <p>Refund ID: {refund.razorpayRefundId}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                            Update Return Status
                        </h3>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">New Status:</label>
                            <select
                                value={statusForm.status}
                                onChange={(e) => setStatusForm(prev => ({...prev, status: e.target.value}))}
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            >
                                <option value="">Select Status</option>
                                {getStatusOptions(currentReturn.status).map(status => (
                                    <option key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">Notes (Optional):</label>
                            <textarea
                                value={statusForm.notes}
                                onChange={(e) => setStatusForm(prev => ({...prev, notes: e.target.value}))}
                                rows="3"
                                placeholder="Add any notes about this status update..."
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updating||!statusForm.status}
                                className="flex-1 px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50"
                            >
                                {updating? 'Updating...':'Update Status'}
                            </button>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-[#1a472a] rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pickup Schedule Modal */}
            {showPickupModal&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                            Schedule Return Pickup
                        </h3>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">Pickup Date:</label>
                            <input
                                type="date"
                                value={pickupForm.pickupDate}
                                onChange={(e) => setPickupForm(prev => ({...prev, pickupDate: e.target.value}))}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">Notes (Optional):</label>
                            <textarea
                                value={pickupForm.notes}
                                onChange={(e) => setPickupForm(prev => ({...prev, notes: e.target.value}))}
                                rows="3"
                                placeholder="Add pickup instructions..."
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handlePickupSchedule}
                                disabled={updating||!pickupForm.pickupDate}
                                className="flex-1 px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50"
                            >
                                {updating? 'Scheduling...':'Schedule Pickup'}
                            </button>
                            <button
                                onClick={() => setShowPickupModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-[#1a472a] rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnDetails;