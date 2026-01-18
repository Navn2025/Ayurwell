import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import
{
    fetchRefundById,
    initiateRefund as processAdminRefund,
    clearError as clearRefundError
} from '../../../store/slices/refund.slice';

const ProcessRefund=() =>
{
    const {refundId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentRefund, loading, error}=useSelector(state => state.refund);

    const [action, setAction]=useState('approve');
    const [notes, setNotes]=useState('');
    const [processing, setProcessing]=useState(false);
    const [success, setSuccess]=useState(false);

    useEffect(() =>
    {
        if (refundId)
        {
            dispatch(fetchRefundById(refundId));
        }
    }, [dispatch, refundId]);

    const handleProcess=async () =>
    {
        setProcessing(true);

        const refundData={
            refundId,
            action, // 'approve' or 'reject'
            notes
        };

        const result=await dispatch(processAdminRefund(refundData));

        if (!result.error)
        {
            setSuccess(true);
            setTimeout(() => navigate('/admin/refunds'), 2000);
        }

        setProcessing(false);
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

    const getTypeBadgeClass=(type) =>
    {
        const baseClass='px-2 py-1 rounded text-xs font-medium';
        switch (type?.toLowerCase())
        {
            case 'full':
                return `${baseClass} bg-blue-100 text-blue-800`;
            case 'partial':
                return `${baseClass} bg-purple-100 text-purple-800`;
            default:
                return `${baseClass} bg-gray-100 text-[#1a472a]`;
        }
    };

    const getStatusBadgeClass=(status) =>
    {
        const baseClass='px-2 py-1 rounded text-xs font-medium';
        switch (status?.toLowerCase())
        {
            case 'pending':
                return `${baseClass} bg-yellow-100 text-yellow-800`;
            case 'approved':
            case 'completed':
                return `${baseClass} bg-green-100 text-green-800`;
            case 'rejected':
            case 'failed':
                return `${baseClass} bg-red-100 text-red-800`;
            case 'processing':
                return `${baseClass} bg-blue-100 text-blue-800`;
            default:
                return `${baseClass} bg-gray-100 text-[#1a472a]`;
        }
    };

    if (loading&&!currentRefund)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading refund details...</div>;
    }

    if (!currentRefund)
    {
        return <div className="flex items-center justify-center h-64 text-red-500">Refund not found</div>;
    }

    const refund=currentRefund;

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/refunds')} className="text-[#1a472a] hover:text-[#14532d] flex items-center gap-1">
                    ← Back to Refunds
                </button>
                <h2 className="text-2xl font-bold text-[#1a472a]">Process Refund #{refund.id.slice(-8)}</h2>
            </div>

            {success&&(
                <div className="bg-[#1a472a] border border-[#14532d] rounded-lg p-4 mb-6">
                    Refund processed successfully! Redirecting...
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearRefundError())} className="text-red-500 hover:text-red-700 font-bold">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Refund Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Refund Details</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Refund ID:</span>
                        <span className="text-[#1a472a] font-medium">{refund.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Amount:</span>
                        <span className="text-xl font-bold text-[#1a472a]">{formatCurrency(refund.amount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Type:</span>
                        <span className={getTypeBadgeClass(refund.type)}>
                            {refund.type}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Status:</span>
                        <span className={getStatusBadgeClass(refund.status)}>
                            {refund.status}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Created:</span>
                        <span className="text-[#1a472a] font-medium">{formatDate(refund.createdAt)}</span>
                    </div>
                    {refund.reason&&(
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Reason:</span>
                            <span className="text-[#1a472a] font-medium">{refund.reason}</span>
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Order Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Order ID:</span>
                        <a href={`/admin/orders/${refund.payment?.order?.id}`} className="text-[#1a472a] hover:underline">
                            #{refund.payment?.order?.id?.slice(-8)||'N/A'}
                        </a>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Order Total:</span>
                        <span className="text-[#1a472a] font-medium">{formatCurrency(refund.payment?.order?.totalAmount||0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Order Status:</span>
                        <span className="text-[#1a472a] font-medium">{refund.payment?.order?.status||'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Payment Method:</span>
                        <span className="text-[#1a472a] font-medium">{refund.payment?.order?.paymentMethod||'N/A'}</span>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Customer Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Name:</span>
                        <span className="text-[#1a472a] font-medium">
                            {refund.payment?.order?.user
                                ? `${refund.payment.order.user.firstName||''} ${refund.payment.order.user.lastName||''}`.trim()||'N/A'
                                :'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Email:</span>
                        <span className="text-[#1a472a] font-medium">{refund.payment?.order?.user?.email||'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Phone:</span>
                        <span className="text-[#1a472a] font-medium">{refund.payment?.order?.user?.phoneNumber||'N/A'}</span>
                    </div>
                </div>

                {/* Payment Info */}
                {refund.payment&&(
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Payment Information</h3>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Payment ID:</span>
                            <span className="text-[#1a472a] font-medium">{refund.payment.razorpayPaymentId||'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Amount Paid:</span>
                            <span className="text-[#1a472a] font-medium">{formatCurrency(refund.payment.amount||0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Payment Status:</span>
                            <span className="text-[#1a472a] font-medium">{refund.payment.status}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Process Form */}
            {refund.status==='PENDING'&&(
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Process Refund</h3>

                    <div className="mb-4">
                        <label className="text-[#1a472a] text-sm block mb-2">Action:</label>
                        <div className="space-y-3">
                            <label className={`flex items-center gap-3 p-3 border  cursor-pointer hover:bg-[#1a472a]/5 ${action==='approve'? 'border-blue-500 bg-blue-50':''}`}>
                                <input
                                    type="radio"
                                    name="action"
                                    value="approve"
                                    checked={action==='approve'}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="w-4 h-4 text-[#1a472a]"
                                />
                                <span className="text-[#1a472a] font-medium">Approve Refund</span>
                            </label>
                            <label className={`flex items-center gap-3 p-3 border  cursor-pointer hover:bg-[#1a472a]/5 ${action==='reject'? 'border-blue-500 bg-blue-50':''}`}>
                                <input
                                    type="radio"
                                    name="action"
                                    value="reject"
                                    checked={action==='reject'}
                                    onChange={(e) => setAction(e.target.value)}
                                    className="w-4 h-4 text-[#1a472a]"
                                />
                                <span className="text-red-600 font-medium">Reject Refund</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="notes" className="text-[#1a472a] text-sm block mb-2">Notes (Optional):</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            placeholder="Add any notes about this refund decision..."
                            className="w-full px-3 py-2 border border-[#1a472a] rounded-lg focus:ring-2 focus:ring-[#1a472a] mt-4"
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleProcess}
                            disabled={processing}
                            className={`px-6 py-2 text-white rounded-lg disabled:opacity-50 ${action==='approve'? 'bg-[#1a472a] hover:bg-[#153d1f]':'bg-red-500 hover:bg-red-600'}`}
                        >
                            {processing? 'Processing...':(action==='approve'? 'Approve Refund':'Reject Refund')}
                        </button>
                        <button onClick={() => navigate('/admin/refunds')} className="px-6 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153d1f]">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {refund.status!=='PENDING'&&(
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Refund Already Processed</h3>
                    <p className="text-[#1a472a] mb-2">This refund has been {refund.status.toLowerCase()}.</p>
                    {refund.processedAt&&(
                        <p className="text-[#1a472a] text-sm">Processed on: {formatDate(refund.processedAt)}</p>
                    )}
                    {refund.notes&&(
                        <p className="text-[#1a472a] text-sm mt-2">Notes: {refund.notes}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProcessRefund;
