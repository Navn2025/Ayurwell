import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import
{
    fetchCODOrders,
    settleCODPayment,
    clearError as clearCODError
} from '../../../store/slices/cod.slice';

const getOrderStatusBadgeClass=(status) =>
{
    const base='px-2 py-1 text-xs font-medium rounded-full';
    switch (status?.toUpperCase())
    {
        case 'DELIVERED':
            return `${base} bg-green-100 text-green-800`;
        case 'SHIPPED':
            return `${base} bg-blue-100 text-blue-800`;
        case 'PROCESSING':
            return `${base} bg-yellow-100 text-yellow-800`;
        case 'CANCELLED':
            return `${base} bg-red-100 text-red-800`;
        default:
            return `${base} bg-gray-100 text-[#1a472a]`;
    }
};

const getPaymentStatusBadgeClass=(status) =>
{
    const base='px-2 py-1 text-xs font-medium rounded-full';
    switch (status?.toUpperCase())
    {
        case 'PAID':
        case 'SETTLED':
            return `${base} bg-green-100 text-green-800`;
        case 'COLLECTED':
            return `${base} bg-blue-100 text-blue-800`;
        case 'PENDING':
        case 'COD':
            return `${base} bg-yellow-100 text-yellow-800`;
        case 'FAILED':
            return `${base} bg-red-100 text-red-800`;
        default:
            return `${base} bg-gray-100 text-[#1a472a]`;
    }
};

const CODSettlement=() =>
{
    const dispatch=useDispatch();
    const {codOrders, loading, error}=useSelector(state => state.cod);

    const [statusFilter, setStatusFilter]=useState('pending');
    const [selectedOrders, setSelectedOrders]=useState([]);
    const [processing, setProcessing]=useState(false);
    const [success, setSuccess]=useState('');

    useEffect(() =>
    {
        dispatch(fetchCODOrders(statusFilter));
    }, [dispatch, statusFilter]);

    const handleSelectOrder=(orderId) =>
    {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id!==orderId)
                :[...prev, orderId]
        );
    };

    const handleSelectAll=() =>
    {
        if (selectedOrders.length===codOrders?.length)
        {
            setSelectedOrders([]);
        } else
        {
            setSelectedOrders(codOrders?.map(order => order.id)||[]);
        }
    };

    const handleSettleSelected=async () =>
    {
        if (selectedOrders.length===0)
        {
            alert('Please select at least one order to settle');
            return;
        }

        if (!window.confirm(`Are you sure you want to settle ${selectedOrders.length} COD order(s)?`))
        {
            return;
        }

        setProcessing(true);

        let successCount=0;
        let failCount=0;

        for (const orderId of selectedOrders)
        {
            const result=await dispatch(settleCODPayment(orderId));
            if (!result.error)
            {
                successCount++;
            } else
            {
                failCount++;
            }
        }

        setSuccess(`Settled ${successCount} order(s). ${failCount>0? `Failed: ${failCount}`:''}`);
        setSelectedOrders([]);
        dispatch(fetchCODOrders(statusFilter));
        setProcessing(false);
    };

    const handleSettleSingle=async (orderId) =>
    {
        if (!window.confirm('Are you sure you want to settle this COD order?'))
        {
            return;
        }

        setProcessing(true);
        const result=await dispatch(settleCODPayment(orderId));

        if (!result.error)
        {
            setSuccess('Order settled successfully');
            dispatch(fetchCODOrders(statusFilter));
        }

        setProcessing(false);
    };

    const formatDate=(dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatCurrency=(amount) =>
    {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const totalPendingAmount=codOrders
        ?.filter(o => !o.codSettled)
        ?.reduce((sum, o) => sum+(o.codAmount||o.totalAmount||0), 0)||0;

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading COD orders...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a] mb-4">COD Settlement</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white  shadow p-4 text-center border-l-4 border-[#1a472a]">
                        <span className="text-2xl font-bold text-[#1a472a] block">{codOrders?.length||0}</span>
                        <span className="text-sm text-[#1a472a]">Total COD Orders</span>
                    </div>
                    <div className="bg-white  shadow p-4 text-center border-l-4 border-[#1a472a]">
                        <span className="text-2xl font-bold text-[#1a472a] block">
                            {codOrders?.filter(o => o.codCollected&&!o.codSettled).length||0}
                        </span>
                        <span className="text-sm text-[#1a472a]">Ready to Settle</span>
                    </div>
                    <div className="bg-white  shadow p-4 text-center border-l-4 border-[#1a472a]">
                        <span className="text-2xl font-bold text-[#1a472a] block">{formatCurrency(totalPendingAmount)}</span>
                        <span className="text-sm text-[#1a472a]">Pending Amount</span>
                    </div>
                </div>
            </div>

            {success&&(
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-green-800">{success}</span>
                    <button onClick={() => setSuccess('')} className="text-[#1a472a] hover:text-[#14532d] font-bold">×</button>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-800">{error}</span>
                    <button onClick={() => dispatch(clearCODError())} className="text-red-600 hover:text-red-800 font-bold">×</button>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6 bg-white  shadow p-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-[#1a472a]">Show:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-[#1a472a] rounded-lg"
                    >
                        <option value="pending">Pending Settlement</option>
                        <option value="settled">Settled</option>
                        <option value="all">All COD Orders</option>
                    </select>
                </div>

                {selectedOrders.length>0&&(
                    <div className="flex items-center gap-3 ml-auto">
                        <span className="text-sm text-[#1a472a]">{selectedOrders.length} selected</span>
                        <button
                            onClick={handleSettleSelected}
                            disabled={processing}
                            className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50"
                        >
                            {processing? 'Processing...':'Settle Selected'}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white  shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a] w-12">
                                <input
                                    type="checkbox"
                                    checked={selectedOrders.length===codOrders?.length&&codOrders?.length>0}
                                    onChange={handleSelectAll}
                                    className="w-4 h-4 text-[#1a472a] rounded"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Customer</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Amount</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Order Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Payment Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Delivered Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {codOrders&&codOrders.length>0? (
                            codOrders.map(order =>
                            {
                                const canSettle=order.codCollected&&!order.codSettled;

                                return (
                                    <tr key={order.id} className={`hover:bg-[#1a472a]/5 ${selectedOrders.includes(order.id)? 'bg-blue-50':''}`}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => handleSelectOrder(order.id)}
                                                disabled={!canSettle}
                                                className="w-4 h-4 text-[#1a472a] rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <a href={`/admin/orders/${order.id}`} className="text-[#1a472a] hover:underline font-mono">
                                                #{order.id.slice(-8)}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div>
                                                <span className="text-[#1a472a] block">
                                                    {order.user
                                                        ? `${order.user.firstName||''} ${order.user.lastName||''}`.trim()||'N/A'
                                                        :'N/A'}
                                                </span>
                                                <span className="text-xs text-[#1a472a]">{order.user?.phoneNumber||''}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-[#1a472a]">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-4 py-3">
                                            <span className={getOrderStatusBadgeClass(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={getPaymentStatusBadgeClass(
                                                order.codCollected? 'Collected':order.status=='CANCELLED'? 'Cancelled':'Pending'
                                            )}>
                                                {order.codCollected? '':order.status=='CANCELLED'? 'Cancelled':'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[#1a472a]">
                                            {order.deliveredAt? formatDate(order.deliveredAt):'-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {canSettle? (
                                                    <button
                                                        onClick={() => handleSettleSingle(order.id)}
                                                        disabled={processing}
                                                        className="px-3 py-1 bg-green-500 text-[#fffcef] text-sm rounded hover:bg-green-600 disabled:opacity-50"
                                                    >
                                                        Settle
                                                    </button>
                                                ):order.codSettled? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Settled</span>
                                                ):order.status=='CANCELLED'? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Cancelled</span>
                                                ):
                                                    (
                                                        <span className="text-xs text-[#1a472a]">Awaiting Delivery</span>
                                                    )}
                                                <a href={`/admin/orders/${order.id}`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]">
                                                    View
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ):(
                            <tr>
                                <td colSpan="8" className="py-8 text-center text-[#1a472a]">No COD orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Settlement Info */}
            <div className="bg-white shadow p-6 mt-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-3">About COD Settlement</h3>
                <p className="text-[#1a472a] mb-4">
                    COD orders are ready for settlement once they are marked as <strong>DELIVERED</strong>.
                    Settlement confirms that the cash has been collected from the customer and reconciled
                    with the courier partner.
                </p>
                <ul className="list-disc list-inside text-[#1a472a] space-y-1">
                    <li>Only delivered COD orders can be settled</li>
                    <li>Settlement changes payment status from "COD" to "PAID"</li>
                    <li>Bulk settlement allows processing multiple orders at once</li>
                    <li>Settled orders cannot be unsettled</li>
                </ul>
            </div>
        </div>
    );
};

export default CODSettlement;
