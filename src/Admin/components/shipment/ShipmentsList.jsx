import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllShipments, clearError as clearShipmentError} from '../../../store/slices/shipment.slice';

const ShipmentsList=() =>
{
    const dispatch=useDispatch();
    const {shipments, loading, error}=useSelector(state => state.shipment);

    const [statusFilter, setStatusFilter]=useState('all');
    const [searchQuery, setSearchQuery]=useState('');

    useEffect(() =>
    {
        dispatch(fetchAllShipments());
    }, [dispatch]);

    const getStatusBadgeClass=(status) =>
    {
        const statusClasses={
            'PENDING': 'bg-yellow-100 text-yellow-700',
            'PICKUP_SCHEDULED': 'bg-blue-100 text-blue-700',
            'PICKED_UP': 'bg-blue-100 text-blue-700',
            'IN_TRANSIT': 'bg-purple-100 text-purple-700',
            'OUT_FOR_DELIVERY': 'bg-cyan-100 text-cyan-700',
            'DELIVERED': 'bg-green-100 text-green-700',
            'RTO_INITIATED': 'bg-red-100 text-red-700',
            'RTO_DELIVERED': 'bg-red-100 text-red-700',
            'CANCELLED': 'bg-gray-100 text-gray-700'
        };
        return statusClasses[status]||'bg-gray-100 text-gray-700';
    };

    const filteredShipments=shipments?.filter(shipment =>
    {
        const statusMatch=statusFilter==='all'||shipment.status===statusFilter;
        const searchMatch=!searchQuery||
            shipment.awbNumber?.toLowerCase().includes(searchQuery.toLowerCase())||
            shipment.shipmentId?.toLowerCase().includes(searchQuery.toLowerCase())||
            shipment.orderId?.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch&&searchMatch;
    });

    const formatDate=(dateString) =>
    {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading shipments...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Shipments Management</h2>
                <div className="flex gap-4">
                    <span>Total: {shipments?.length||0}</span>
                    <span className="text-[#915802]">
                        In Transit: {shipments?.filter(s => s.status==='IN_TRANSIT').length||0}
                    </span>
                    <span className="text-[#1a472a]">
                        Delivered: {shipments?.filter(s => s.status==='DELIVERED').length||0}
                    </span>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearShipmentError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6 bg-white  shadow p-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-[#1a472a]">Search:</label>
                    <input
                        type="text"
                        placeholder="AWB, Shipment ID, Order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] w-64"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-[#1a472a]">Status:</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-[#1a472a]/20 rounded-lg">
                        <option value="all">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="RTO_INITIATED">RTO Initiated</option>
                        <option value="RTO_DELIVERED">RTO Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white  shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Shipment ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">AWB Number</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Courier</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Created</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Last Update</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredShipments&&filteredShipments.length>0? (
                            filteredShipments.map(shipment => (
                                <tr key={shipment.id} className="hover:bg-[#1a472a]/5">
                                    <td className="px-4 py-3">
                                        <a href={`/admin/shipments/${shipment.id}`} className="text-[#1a472a] hover:underline font-mono">
                                            {shipment.shipmentId||shipment.id.slice(-8)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`/admin/orders/${shipment.orderId}`} className="text-[#1a472a] hover:underline">
                                            #{shipment.orderId?.slice(-8)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-sm">
                                        {shipment.awbNumber||(
                                            <span className="text-gray-400 italic">Not Assigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">{shipment.courierName||'N/A'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(shipment.status)}`}>
                                            {shipment.status?.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#1a472a]">{formatDate(shipment.createdAt)}</td>
                                    <td className="px-4 py-3 text-sm text-[#1a472a]">{formatDate(shipment.updatedAt)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <a href={`/admin/shipments/${shipment.id}`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]">
                                                View
                                            </a>
                                            {shipment.trackingUrl&&(
                                                <a
                                                    href={shipment.trackingUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]"
                                                >
                                                    Track
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="8" className="py-8 text-center text-[#1a472a]">No shipments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShipmentsList;
