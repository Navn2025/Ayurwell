import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllRefunds, clearError as clearRefundError} from '../../../store/slices/refund.slice';

const RefundsList=() =>
{
    const dispatch=useDispatch();
    const {refunds, loading, error}=useSelector(state => state.refund);

    const [statusFilter, setStatusFilter]=useState('all');
    const [typeFilter, setTypeFilter]=useState('all');

    useEffect(() =>
    {
        dispatch(fetchAllRefunds());
    }, [dispatch]);

    const getStatusBadgeClass=(status) =>
    {
        const statusClasses={
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'PROCESSING': 'bg-blue-100 text-blue-700',
            'COMPLETED': 'bg-green-100 text-green-700',
            'FAILED': 'bg-red-100 text-red-700',
            'REJECTED': 'bg-red-100 text-red-700'
        };
        return statusClasses[status]||'bg-gray-100 text-gray-700';
    };

    const getTypeBadgeClass=(type) =>
    {
        const typeClasses={
            'CANCELLATION': 'bg-gray-100 text-gray-700',
            'RTO': 'bg-orange-100 text-orange-700',
            'RETURN': 'bg-blue-100 text-blue-700',
            'ADMIN': 'bg-purple-100 text-purple-700'
        };
        return typeClasses[type]||'bg-gray-100 text-gray-700';
    };

    const filteredRefunds=refunds?.filter(refund =>
    {
        const statusMatch=statusFilter==='all'||refund.status===statusFilter;
        const typeMatch=typeFilter==='all'||refund.type===typeFilter;
        return statusMatch&&typeMatch;
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
        }).format(amount);
    };

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading refunds...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Refunds Management</h2>
                <div className="flex gap-4">
                    <span className="text-[#1a472a]">
                        Total: {refunds?.length||0}
                    </span>
                    <span className="text-yellow-600">
                        Pending: {refunds?.filter(r => r.status==='PENDING').length||0}
                    </span>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearRefundError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6 bg-white shadow p-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-[#1a472a]">Status:</label>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-[#1a472a]">Type:</label>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="CANCELLATION">Cancellation</option>
                        <option value="RTO">RTO</option>
                        <option value="RETURN">Return</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Refund ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Customer</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a472a]/20">
                        {filteredRefunds&&filteredRefunds.length>0? (
                            filteredRefunds.map(refund => (
                                <tr key={refund.id} className="hover:bg-[#1a472a]/5">
                                    <td className="px-4 py-3">
                                        <a href={`/admin/refunds/${refund.id}`} className="text-[#1a472a] hover:underline font-mono">
                                            #{refund.id.slice(-8)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`/admin/orders/${refund.payment?.order?.id}`} className="text-[#1a472a] hover:underline">
                                            #{refund.payment?.order?.orderNumber||refund.payment?.order?.id?.slice(-8)||'N/A'}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[#1a472a]">
                                                {refund.payment?.order?.user
                                                    ? `${refund.payment.order.user.firstName||''} ${refund.payment.order.user.lastName||''}`.trim()||'N/A'
                                                    :'N/A'}
                                            </span>
                                            <span className="text-xs text-[#1a472a]">{refund.payment?.order?.user?.email||''}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-[#1a472a]">{formatCurrency(refund.amount)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadgeClass(refund.type)}`}>
                                            {refund.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(refund.status)}`}>
                                            {refund.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-[#1a472a]">{formatDate(refund.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <a href={`/admin/refunds/${refund.id}`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]">
                                                View
                                            </a>
                                            {refund.status==='PENDING'&&(
                                                <a href={`/admin/refunds/${refund.id}/process`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]">
                                                    Process
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="8" className="py-8 text-center text-[#1a472a]">No refunds found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefundsList;
