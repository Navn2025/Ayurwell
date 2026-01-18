import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import
{
    createReturnRequest,
    fetchReturnsByOrder,
    clearError,
    clearSuccessMessage
} from '../../store/slices/return.slice';

const ReturnRequest=() =>
{
    const {orderId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const {creating, error, successMessage, customerReturns}=useSelector(state => state.return);
    const {currentOrder}=useSelector(state => state.order);

    const [formData, setFormData]=useState({
        reason: '',
        isPartial: false,
        itemIds: []
    });

    const [showForm, setShowForm]=useState(false);

    useEffect(() =>
    {
        if (orderId)
        {
            dispatch(fetchReturnsByOrder(orderId));
        }
    }, [dispatch, orderId]);

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

    const handleInputChange=(e) =>
    {
        const {name, value, type, checked}=e.target;

        if (type==='checkbox')
        {
            setFormData(prev => ({
                ...prev,
                [name]: checked,
                itemIds: checked? []:prev.itemIds
            }));
        } else
        {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleItemSelection=(itemId) =>
    {
        setFormData(prev => ({
            ...prev,
            itemIds: prev.itemIds.includes(itemId)
                ? prev.itemIds.filter(id => id!==itemId)
                :[...prev.itemIds, itemId]
        }));
    };

    const handleSubmit=async (e) =>
    {
        e.preventDefault();

        if (!formData.reason.trim())
        {
            return;
        }

        const result=await dispatch(createReturnRequest({
            orderId,
            reason: formData.reason.trim(),
            isPartial: formData.isPartial,
            itemIds: formData.itemIds
        }));
        console.log(result)

        if (!result.error)
        {
            setFormData({
                reason: '',
                isPartial: false,
                itemIds: []
            });
            setShowForm(false);
        }
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

    const hasActiveReturn=customerReturns?.some(r =>
        !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(r.status)
    );

    return (
        <div className="p-6  max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#1a472a] hover:text-[#14532d] flex items-center gap-1"
                >
                    ← Back
                </button>
                <h2 className="text-2xl font-bold text-[#1a472a]">Return Request</h2>
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

            {/* Existing Returns */}
            {customerReturns&&customerReturns.length>0&&(
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Existing Return Requests</h3>
                    <div className="space-y-4">
                        {customerReturns.map(returnRequest => (
                            <div key={returnRequest.id} className="border border-[#1a472a]/20 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="font-mono text-sm text-[#1a472a]">
                                            #{returnRequest.id.slice(-8)}
                                        </span>
                                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(returnRequest.status)}`}>
                                            {returnRequest.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[#1a472a]">
                                        {formatDate(returnRequest.createdAt)}
                                    </span>
                                </div>
                                <p className="text-[#1a472a] mb-2">{returnRequest.reason}</p>
                                {returnRequest.isPartial&&(
                                    <p className="text-sm text-[#1a472a]">
                                        <span className="font-medium">Type:</span> Partial Return
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Return Request Form */}
            {!hasActiveReturn&&!showForm&&(
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Request a Return</h3>
                    <p className="text-[#1a472a] mb-6">
                        If you're not satisfied with your order, you can request a return within 30 days of delivery.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d]"
                    >
                        Request Return
                    </button>
                </div>
            )}

            {showForm&&(
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Return Request Form</h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Return Type */}
                        <div>
                            <label className="text-[#1a472a] text-sm font-medium block mb-3">
                                Return Type
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 border border-[#1a472a]/20 rounded-lg cursor-pointer hover:bg-[#1a472a]/5">
                                    <input
                                        type="radio"
                                        name="isPartial"
                                        value={false}
                                        checked={!formData.isPartial}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#1a472a]"
                                    />
                                    <div>
                                        <span className="text-[#1a472a] font-medium">Full Order Return</span>
                                        <p className="text-sm text-[#1a472a]/70">Return all items in the order</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-3 border border-[#1a472a]/20 rounded-lg cursor-pointer hover:bg-[#1a472a]/5">
                                    <input
                                        type="radio"
                                        name="isPartial"
                                        value={true}
                                        checked={formData.isPartial}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-[#1a472a]"
                                    />
                                    <div>
                                        <span className="text-[#1a472a] font-medium">Partial Return</span>
                                        <p className="text-sm text-[#1a472a]/70">Return specific items from the order</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Item Selection for Partial Return */}
                        {formData.isPartial&&currentOrder?.items&&(
                            <div>
                                <label className="text-[#1a472a] text-sm font-medium block mb-3">
                                    Select Items to Return
                                </label>
                                <div className="space-y-2">
                                    {currentOrder.items.map(item => (
                                        <label key={item.id} className="flex items-center gap-3 p-3 border border-[#1a472a]/20 rounded-lg cursor-pointer hover:bg-[#1a472a]/5">
                                            <input
                                                type="checkbox"
                                                checked={formData.itemIds.includes(item.id)}
                                                onChange={() => handleItemSelection(item.id)}
                                                className="w-4 h-4 text-[#1a472a]"
                                            />
                                            <div className="flex-1">
                                                <span className="text-[#1a472a] font-medium">{item.productName}</span>
                                                <p className="text-sm text-[#1a472a]/70">
                                                    Qty: {item.quantity} | ₹{(item.price/100).toFixed(2)} each
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {formData.itemIds.length===0&&(
                                    <p className="text-sm text-red-500 mt-2">Please select at least one item to return</p>
                                )}
                            </div>
                        )}

                        {/* Return Reason */}
                        <div>
                            <label htmlFor="reason" className="text-[#1a472a] text-sm font-medium block mb-2">
                                Return Reason *
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Please describe why you want to return this order..."
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                required
                                minLength="10"
                                maxLength="500"
                            />
                            <p className="text-xs text-[#1a472a]/60 mt-1">
                                {formData.reason.length}/500 characters (minimum 10 characters required)
                            </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={creating||!formData.reason.trim()||(formData.isPartial&&formData.itemIds.length===0)}
                                className="px-6 py-3 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {creating? 'Submitting...':'Submit Return Request'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 bg-gray-200 text-[#1a472a] rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {hasActiveReturn&&(
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-yellow-700 mb-2">Return Already in Progress</h3>
                    <p className="text-yellow-600">
                        You already have an active return request for this order. Please wait for it to be processed before requesting another return.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReturnRequest;