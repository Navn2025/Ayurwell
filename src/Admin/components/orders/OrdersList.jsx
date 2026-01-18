import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllOrders as fetchOrders, clearError as clearOrderError} from '../../../store/slices/order.slice';

const OrdersList=() =>
{
    const dispatch=useDispatch();
    const {orders, loading, error}=useSelector(state => state.order);

    const [statusFilter, setStatusFilter]=useState('all');
    const [paymentFilter, setPaymentFilter]=useState('all');

    useEffect(() =>
    {
        dispatch(fetchOrders());
    }, [dispatch]);

    const getStatusBadgeClass=(status) =>
    {
        const statusClasses={
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'CONFIRMED': 'bg-blue-100 text-blue-700',
            'PROCESSING': 'bg-indigo-100 text-indigo-700',
            'SHIPPED': 'bg-purple-100 text-purple-700',
            'DELIVERED': 'bg-green-100 text-green-700',
            'CANCELLED': 'bg-red-100 text-red-700',
            'RTO': 'bg-orange-100 text-orange-700'
        };
        return statusClasses[status]||'bg-gray-100 text-gray-700';
    };

    const getPaymentBadgeClass=(status) =>
    {
        const classes={
            'PAID': 'bg-green-100 text-green-700',
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'FAILED': 'bg-red-100 text-red-700',
            'REFUNDED': 'bg-blue-100 text-blue-700',
            'COD': 'bg-gray-100 text-gray-700'
        };
        return classes[status]||'bg-gray-100 text-gray-700';
    };

    const filteredOrders=orders?.filter(order =>
    {
        const statusMatch=statusFilter==='all'||order.status===statusFilter;
        const paymentMatch=paymentFilter==='all'||order.paymentStatus===paymentFilter;
        return statusMatch&&paymentMatch;
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
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading orders...</div>;
    }

    return (
        <div className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-[#1a472a]">Orders Management</h2>
                <div className="text-[#1a472a]">
                    <span className="text-sm lg:text-base">Total: {orders?.length||0}</span>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 flex justify-between items-center">
                    <span className="text-sm lg:text-base">{error}</span>
                    <button onClick={() => dispatch(clearOrderError())} className="text-red-700 hover:text-red-900 text-lg lg:text-xl ml-2">×</button>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 lg:gap-4 mb-4 lg:mb-6 bg-white shadow p-3 lg:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 sm:flex-initial">
                    <label className="text-sm font-medium text-[#1a472a]">Order Status:</label>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a472a] w-full sm:w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RTO">RTO</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 sm:flex-initial">
                    <label className="text-sm font-medium text-[#1a472a]">Payment:</label>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a472a] w-full sm:w-auto" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                        <option value="COD">COD</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px] lg:min-w-0">
                        <table className="w-full">
                            <thead className="bg-[#1a472a]/10">
                                <tr>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Order ID</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Customer</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Items</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Total</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Payment</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Status</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Date</th>
                                    <th className="px-2 lg:px-4 py-2 lg:py-3 text-left text-xs lg:text-sm font-medium text-[#1a472a]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a472a]/10">
                                {filteredOrders&&filteredOrders.length>0? (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-[#1a472a]/20">
                                            <td className="px-2 lg:px-4 py-2 lg:py-3">
                                                <a href={`/admin/orders/${order.id}`} className="text-[#1a472a] hover:underline font-mono text-xs lg:text-sm">
                                                    #{order.id.slice(-8)}
                                                </a>
                                            </td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[#1a472a] font-medium text-xs lg:text-sm truncate">
                                                        {order.user
                                                            ? `${order.user.firstName||''} ${order.user.lastName||''}`.trim()||'N/A'
                                                            :'N/A'}
                                                    </span>
                                                    <span className="text-xs text-[#1a472a]/70 hidden sm:block truncate">{order.user?.email||''}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm">{order.items?.length||0} items</td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3 font-medium text-[#1a472a] text-xs lg:text-sm">{formatCurrency(order.totalAmount)}</td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadgeClass(order.payment?.status||'PENDING')}`}>
                                                    {order.payment?.status||'PENDING'}
                                                </span>
                                                {order.paymentMethod&&(
                                                    <small className="block text-xs text-[#1a472a]/70 mt-1 hidden sm:block">{order.paymentMethod}</small>
                                                )}
                                            </td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-sm text-[#1a472a]">{formatDate(order.createdAt)}</td>
                                            <td className="px-2 lg:px-4 py-2 lg:py-3">
                                                <a href={`/admin/orders/${order.id}`} className="px-2 lg:px-3 py-1 bg-[#1a472a] text-[#fffcef] text-xs lg:text-sm rounded hover:bg-[#153d1a]">
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ):(
                                    <tr>
                                        <td colSpan="8" className="py-6 lg:py-8 text-center text-gray-500 text-sm lg:text-base">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersList;
