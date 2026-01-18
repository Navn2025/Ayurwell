import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import {fetchPaymentDetails, clearError as clearPaymentError} from '../../../store/slices/payment.slice';

const PaymentDetails=() =>
{
    const {paymentId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentPayment, loading, error}=useSelector(state => state.payment);

    useEffect(() =>
    {
        if (paymentId)
        {
            dispatch(fetchPaymentDetails(paymentId));
        }
    }, [dispatch, paymentId]);

    const formatDate=(dateString) =>
    {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatCurrency=(amount) =>
    {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getStatusColor=(status) =>
    {
        const colors={
            'SUCCESS': '#1a472a',
            'CAPTURED': '#1a472a',
            'PENDING': '#f59e0b',
            'FAILED': '#ef4444',
            'REFUNDED': '#6366f1'
        };
        return colors[status]||'#6b7280';
    };

    if (loading&&!currentPayment)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading payment details...</div>;
    }

    if (!currentPayment)
    {
        return <div className="flex items-center justify-center h-64 text-red-500">Payment not found</div>;
    }

    const payment=currentPayment;

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/payments')} className="text-[#1a472a] hover:text-[#14532d]">
                    ← Back to Payments
                </button>
                <h2 className="text-2xl font-bold text-[#1a472a]">Payment Details</h2>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearPaymentError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            {/* Status Banner */}
            <div
                className=" p-4 mb-6 text-[#fffcef] text-center"
                style={{backgroundColor: getStatusColor(payment.status)}}
            >
                <span className="mr-2">Status:</span>
                <span className="font-bold">{payment.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Info */}
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Payment Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Payment ID:</span>
                        <span className="text-[#1a472a] font-medium font-mono text-sm">{payment.razorpayPaymentId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Razorpay Order ID:</span>
                        <span className="text-[#1a472a] font-medium font-mono text-sm">{payment.razorpayOrderId}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Amount:</span>
                        <span className="text-xl font-bold text-[#1a472a]">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Currency:</span>
                        <span className="text-[#1a472a] font-medium">{payment.currency||'INR'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Method:</span>
                        <span className="px-2 py-1 rounded bg-[#1a472a]/10 text-sm capitalize">
                            {payment.method||'N/A'}
                        </span>
                    </div>
                    {payment.bank&&(
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Bank:</span>
                            <span className="text-[#1a472a] font-medium">{payment.bank}</span>
                        </div>
                    )}
                    {payment.wallet&&(
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Wallet:</span>
                            <span className="text-[#1a472a] font-medium">{payment.wallet}</span>
                        </div>
                    )}
                    {payment.vpa&&(
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20 last:border-0">
                            <span className="text-[#1a472a] text-sm">VPA (UPI ID):</span>
                            <span className="text-[#1a472a] font-medium">{payment.vpa}</span>
                        </div>
                    )}
                </div>

                {/* Card Details (if applicable) */}
                {payment.card&&(
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Card Details</h3>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Card Network:</span>
                            <span className="text-[#1a472a] font-medium">{payment.card.network}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Card Type:</span>
                            <span className="text-[#1a472a] font-medium">{payment.card.type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Last 4 Digits:</span>
                            <span className="text-[#1a472a] font-medium">**** **** **** {payment.card.last4}</span>
                        </div>
                        {payment.card.issuer&&(
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20 last:border-0">
                                <span className="text-[#1a472a] text-sm">Issuer:</span>
                                <span className="text-[#1a472a] font-medium">{payment.card.issuer}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Order Info */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Order Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Order ID:</span>
                        <a href={`/admin/orders/${payment.orderId}`} className="text-[#1a472a] hover:underline">
                            #{payment.orderId?.slice(-8)}
                        </a>
                    </div>
                    {payment.order&&(
                        <>
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                                <span className="text-[#1a472a] text-sm">Order Status:</span>
                                <span className="text-[#1a472a] font-medium">{payment.order.status}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20 last:border-0">
                                <span className="text-[#1a472a] text-sm">Order Total:</span>
                                <span className="text-[#1a472a] font-medium">{new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR'
                                }).format(payment.order.totalAmount)}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Timeline</h3>
                    <div className="space-y-4 relative">
                        <div className="flex items-start gap-4">
                            <div className="w-3 h-3 rounded-full mt-1.5 bg-[#1a472a]"></div>
                            <div>
                                <p className="text-[#1a472a] font-medium">Payment Created</p>
                                <p className="text-sm text-[#1a472a]">{formatDate(payment.createdAt)}</p>
                            </div>
                        </div>
                        {payment.capturedAt&&(
                            <div className="flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full mt-1.5 bg-[#1a472a]"></div>
                                <div>
                                    <p className="text-[#1a472a] font-medium">Payment Captured</p>
                                    <p className="text-sm text-[#1a472a]">{formatDate(payment.capturedAt)}</p>
                                </div>
                            </div>
                        )}
                        {payment.refundedAt&&(
                            <div className="flex items-start gap-4">
                                <div className="w-3 h-3 rounded-full mt-1.5 bg-[#1a472a]"></div>
                                <div>
                                    <p className="text-[#1a472a] font-medium">Payment Refunded</p>
                                    <p className="text-sm text-[#1a472a]">{formatDate(payment.refundedAt)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Error Info (if failed) */}
                {payment.status==='FAILED'&&payment.errorCode&&(
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Error Details</h3>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Error Code:</span>
                            <span className="text-red-600 font-medium font-mono text-sm">{payment.errorCode}</span>
                        </div>
                        {payment.errorDescription&&(
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                                <span className="text-[#1a472a] text-sm">Description:</span>
                                <span className="text-[#1a472a] font-medium">{payment.errorDescription}</span>
                            </div>
                        )}
                        {payment.errorReason&&(
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20 last:border-0">
                                <span className="text-[#1a472a] text-sm">Reason:</span>
                                <span className="text-[#1a472a] font-medium">{payment.errorReason}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Refund Info */}
                {payment.refunds&&payment.refunds.length>0&&(
                    <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Refunds ({payment.refunds.length})</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 text-[#1a472a] font-medium">Refund ID</th>
                                        <th className="text-left py-2 text-[#1a472a] font-medium">Amount</th>
                                        <th className="text-left py-2 text-[#1a472a] font-medium">Status</th>
                                        <th className="text-left py-2 text-[#1a472a] font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payment.refunds.map(refund => (
                                        <tr key={refund.id} className="border-b border-[#1a472a]/20 last:border-0">
                                            <td className="py-2 text-[#1a472a] font-mono text-sm">{refund.id}</td>
                                            <td className="py-2 text-[#1a472a] font-medium">{formatCurrency(refund.amount)}</td>
                                            <td className="py-2 text-[#1a472a]">{refund.status}</td>
                                            <td className="py-2 text-[#1a472a]">{formatDate(refund.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Actions</h3>
                <div className="flex gap-4">
                    <a href={`/admin/orders/${payment.orderId}`} className="px-4 py-2 bg-[#fffcef] border-2 border-[#1a472a] text-[#1a472a] rounded hover:bg-[#1a472a]/10 transition-colors">
                        View Order
                    </a>
                    {payment.order?.userId&&(
                        <a href={`/admin/users/${payment.order.userId}`} className="px-4 py-2 bg-[#fffcef] border-2 border-[#1a472a] text-[#1a472a] rounded hover:bg-[#1a472a]/10 transition-colors">
                            View Customer
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;
