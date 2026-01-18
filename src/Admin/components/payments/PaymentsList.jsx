import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllPayments, clearError as clearPaymentError} from '../../../store/slices/payment.slice';

const PaymentsList=() =>
{
    const dispatch=useDispatch();
    const {payments, loading, error}=useSelector(state => state.payment);

    const [statusFilter, setStatusFilter]=useState('all');
    const [methodFilter, setMethodFilter]=useState('all');
    const [searchQuery, setSearchQuery]=useState('');

    useEffect(() =>
    {
        dispatch(fetchAllPayments());
    }, [dispatch]);

    const getStatusBadgeClass=(status) =>
    {
        const statusClasses={
            'SUCCESS': 'bg-green-100 text-green-700',
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'FAILED': 'bg-red-100 text-red-700',
            'REFUNDED': 'bg-blue-100 text-blue-700',
            'CAPTURED': 'bg-green-100 text-green-700'
        };
        return statusClasses[status]||'bg-gray-100 text-gray-700';
    };

    const filteredPayments=payments?.filter(payment =>
    {
        const statusMatch=statusFilter==='all'||payment.status===statusFilter;
        const methodMatch=methodFilter==='all'||payment.method===methodFilter;
        const searchMatch=!searchQuery||
            payment.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase())||
            payment.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase())||
            payment.orderId?.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch&&methodMatch&&searchMatch;
    });

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
        }).format(amount); // Amount is stored in rupees
    };

    const totalSuccessAmount=payments
        ?.filter(p => p.status==='SUCCESS'||p.status==='CAPTURED')
        ?.reduce((sum, p) => sum+(p.amount||0), 0)||0;

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading payments...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a] mb-4">Payments Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white  shadow border-l-4 border-[#1a472a] p-4 text-center">
                        <span className="text-2xl font-bold text-[#1a472a]">{payments?.length||0}</span>
                        <span className="text-sm text-[#1a472a] block">Total Payments</span>
                    </div>
                    <div className="bg-white  shadow border-l-4 border-[#1a472a] p-4 text-center">
                        <span className="text-2xl font-bold text-[#1a472a]">
                            {payments?.filter(p => p.status==='SUCCESS'||p.status==='CAPTURED').length||0}
                        </span>
                        <span className="text-sm text-[#1a472a] block">Successful</span>
                    </div>
                    <div className="bg-white  shadow border-l-4 border-[#1a472a] p-4 text-center">
                        <span className="text-2xl font-bold text-[#1a472a]">{formatCurrency(totalSuccessAmount)}</span>
                        <span className="text-sm text-[#1a472a] block">Total Collected</span>
                    </div>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearPaymentError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6 bg-white  shadow p-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-[#1a472a]">Search:</label>
                    <input
                        type="text"
                        placeholder="Payment ID, Order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-[#1a472a]/10 rounded-lg focus:ring-2 focus:ring-[#1a472a] w-64"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-[#1a472a]">Status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-[#1a472a]/10 rounded-lg focus:ring-2 focus:ring-[#1a472a]">
                        <option value="all">All</option>
                        <option value="SUCCESS">Success</option>
                        <option value="CAPTURED">Captured</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-[#1a472a]">Method:</label>
                    <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="px-3 py-2 border border-[#1a472a]/10 rounded-lg focus:ring-2 focus:ring-[#1a472a]">
                        <option value="all">All</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="netbanking">Netbanking</option>
                        <option value="wallet">Wallet</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Payment ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Method</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPayments&&filteredPayments.length>0? (
                            filteredPayments.map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-sm text-[#1a472a]" title={payment.razorpayPaymentId}>
                                            {payment.razorpayPaymentId?.slice(0, 16)||'N/A'}...
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`/admin/orders/${payment.orderId}`} className="text-[#1a472a] hover:underline">
                                            #{payment.orderId?.slice(-8)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-[#1a472a]">{formatCurrency(payment.amount)}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded text-xs capitalize bg-gray-100">
                                            {payment.order?.paymentMethod||'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#1a472a]">{formatDate(payment.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <a href={`/admin/payments/${payment.id}`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#153d1a] mr-2">
                                            Details
                                        </a>
                                        <a href={`/admin/orders/${payment.orderId}`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#153d1a]">
                                            Order
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-[#1a472a]">No payments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentsList;
