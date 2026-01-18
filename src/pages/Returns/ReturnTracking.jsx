import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchReturnById,
    cancelReturnRequest,
    clearError,
    clearSuccessMessage
} from '../../store/slices/return.slice';

const ReturnTracking = () => {
    const { returnId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentReturn, loading, cancelling, error, successMessage } = useSelector(state => state.return);

    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (returnId) {
            dispatch(fetchReturnById(returnId));
        }
    }, [dispatch, returnId]);

    useEffect(() => {
        if (successMessage) {
            setTimeout(() => {
                dispatch(clearSuccessMessage());
            }, 5000);
        }
    }, [successMessage, dispatch]);

    const handleCancelReturn = async () => {
        const result = await dispatch(cancelReturnRequest(returnId));
        
        if (!result.error) {
            setShowCancelModal(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'REQUESTED': 'bg-yellow-100 text-yellow-700',
            'APPROVED': 'bg-blue-100 text-blue-700',
            'PICKUP_SCHEDULED': 'bg-purple-100 text-purple-700',
            'PICKED_UP': 'bg-indigo-100 text-indigo-700',
            'RECEIVED': 'bg-orange-100 text-orange-700',
            'COMPLETED': 'bg-green-100 text-green-700',
            'REJECTED': 'bg-red-100 text-red-700',
            'CANCELLED': 'bg-gray-100 text-gray-700'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'REQUESTED': '📝',
            'APPROVED': '✅',
            'PICKUP_SCHEDULED': '🚚',
            'PICKED_UP': '📦',
            'RECEIVED': '🏢',
            'COMPLETED': '🎉',
            'REJECTED': '❌',
            'CANCELLED': '🚫'
        };
        return icons[status] || '📋';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const canCancel = ['REQUESTED', 'APPROVED'].includes(currentReturn?.status);

    const getStatusSteps = (currentStatus) => {
        const allSteps = [
            { key: 'REQUESTED', label: 'Return Requested', description: 'Your return request has been submitted' },
            { key: 'APPROVED', label: 'Return Approved', description: 'Your return has been approved by the seller' },
            { key: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', description: 'Return pickup has been scheduled' },
            { key: 'PICKED_UP', label: 'Item Picked Up', description: 'Return item has been picked up by courier' },
            { key: 'RECEIVED', label: 'Item Received', description: 'Return item received at warehouse' },
            { key: 'COMPLETED', label: 'Return Completed', description: 'Return process completed and refund initiated' }
        ];

        const statusOrder = ['REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'PICKED_UP', 'RECEIVED', 'COMPLETED'];
        const currentIndex = statusOrder.indexOf(currentStatus);
        
        return allSteps.map((step, index) => ({
            ...step,
            completed: index < currentIndex || (index === currentIndex && !['REJECTED', 'CANCELLED'].includes(currentStatus)),
            current: index === currentIndex,
            failed: ['REJECTED', 'CANCELLED'].includes(currentStatus) && index >= statusOrder.indexOf(currentStatus)
        }));
    };

    if (loading && !currentReturn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a] mx-auto mb-4"></div>
                    <p className="text-[#1a472a]">Loading return tracking information...</p>
                </div>
            </div>
        );
    }

    if (!currentReturn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Return Not Found</h2>
                    <p className="text-[#1a472a] mb-6">The return request you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="px-6 py-3 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d]"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        );
    }

    const statusSteps = getStatusSteps(currentReturn.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-[#1a472a] hover:text-[#14532d] flex items-center gap-1"
                        >
                            ← Back
                        </button>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(currentReturn.status)}`}>
                                {getStatusIcon(currentReturn.status)} {currentReturn.status.replace('_', ' ')}
                            </span>
                            {canCancel && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                >
                                    Cancel Return
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-[#1a472a] mb-2">
                        Return Tracking
                    </h1>
                    <p className="text-[#1a472a]/70">
                        Return ID: <span className="font-mono">#{currentReturn.id.slice(-8)}</span>
                    </p>
                </div>

                {successMessage && (
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

                {error && (
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

                {/* Status Timeline */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#1a472a] mb-6">Return Progress</h2>
                    
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                        
                        {/* Status Steps */}
                        <div className="space-y-8">
                            {statusSteps.map((step, index) => (
                                <div key={step.key} className="flex items-start gap-4 relative">
                                    {/* Status Circle */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold z-10 ${
                                        step.completed ? 'bg-green-500' : 
                                        step.current ? 'bg-blue-500' : 
                                        step.failed ? 'bg-red-500' : 'bg-gray-300'
                                    }`}>
                                        {step.completed ? '✓' : (index + 1)}
                                    </div>
                                    
                                    {/* Status Content */}
                                    <div className="flex-1 pt-2">
                                        <h3 className={`font-semibold ${
                                            step.current ? 'text-blue-600' : 
                                            step.completed ? 'text-green-600' : 
                                            step.failed ? 'text-red-600' : 'text-gray-500'
                                        }`}>
                                            {step.label}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {step.description}
                                        </p>
                                        {step.current && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Status updated on {formatDate(currentReturn.updatedAt)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Return Details */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Return Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-[#1a472a] mb-3">Order Information</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order ID:</span>
                                    <span className="font-mono text-[#1a472a]">
                                        #{currentReturn.order.orderNumber || currentReturn.order.id?.slice(-8)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Total:</span>
                                    <span className="text-[#1a472a]">{formatCurrency(currentReturn.order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Return Type:</span>
                                    <span className="text-[#1a472a]">
                                        {currentReturn.isPartial ? 'Partial Return' : 'Full Order Return'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Requested on:</span>
                                    <span className="text-[#1a472a]">{formatDate(currentReturn.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-[#1a472a] mb-3">Return Reason</h3>
                            <p className="text-[#1a472a] bg-gray-50 p-3 rounded">
                                {currentReturn.reason}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Order Items</h2>
                    
                    <div className="space-y-3">
                        {currentReturn.order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="text-[#1a472a] font-medium">{item.productName}</p>
                                    <p className="text-sm text-gray-600">
                                        Qty: {item.quantity} | SKU: {item.sku}
                                    </p>
                                </div>
                                <p className="text-[#1a472a] font-medium">
                                    {formatCurrency(item.totalPrice)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refund Information */}
                {currentReturn.refunds && currentReturn.refunds.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Refund Information</h2>
                        
                        <div className="space-y-3">
                            {currentReturn.refunds.map(refund => (
                                <div key={refund.id} className="border border-gray-200 rounded p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-mono text-sm text-[#1a472a]">
                                            Refund ID: #{refund.id.slice(-8)}
                                        </span>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(refund.status)}`}>
                                            {refund.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Amount:</span>
                                            <p className="text-[#1a472a] font-medium">{formatCurrency(refund.amount)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Type:</span>
                                            <p className="text-[#1a472a]">{refund.type.replace('_', ' ')}</p>
                                        </div>
                                        {refund.razorpayRefundId && (
                                            <div className="col-span-2">
                                                <span className="text-gray-600">Refund ID:</span>
                                                <p className="text-[#1a472a] font-mono">{refund.razorpayRefundId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
                    <p className="text-blue-700 mb-4">
                        If you have any questions about your return request, please don't hesitate to contact our customer support.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Contact Support
                        </button>
                        <button className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50">
                            View Return Policy
                        </button>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                            Cancel Return Request
                        </h3>
                        
                        <p className="text-[#1a472a] mb-6">
                            Are you sure you want to cancel this return request? This action cannot be undone.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={handleCancelReturn}
                                disabled={cancelling}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                                {cancelling ? 'Cancelling...' : 'Yes, Cancel Return'}
                            </button>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-[#1a472a] rounded-lg hover:bg-gray-300"
                            >
                                No, Keep Return
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnTracking;