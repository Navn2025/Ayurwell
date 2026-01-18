import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import
{
    fetchShipmentById,
    cancelOrderShipment as cancelShipment,
    retryAWBAssignment,
    clearError as clearShipmentError
} from '../../../store/slices/shipment.slice';

const ShipmentDetails=() =>
{
    const {shipmentId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentShipment, loading, error}=useSelector(state => state.shipment);

    const [processing, setProcessing]=useState(false);
    const [actionSuccess, setActionSuccess]=useState('');
    const [awbRetried, setAwbRetried]=useState(false);

    // Reset awbRetried when AWB is assigned
    useEffect(() =>
    {
        if (currentShipment?.awb)
        {
            setAwbRetried(false);
        }
    }, [currentShipment?.awb]);

    useEffect(() =>
    {
        if (shipmentId)
        {
            dispatch(fetchShipmentById(shipmentId));
        }
    }, [dispatch, shipmentId]);

    const handleCancelShipment=async () =>
    {
        if (window.confirm('Are you sure you want to cancel this shipment?'))
        {
            setProcessing(true);
            const result=await dispatch(cancelShipment(currentShipment?.orderId));
            if (!result.error)
            {
                setActionSuccess('Shipment cancelled successfully');
                dispatch(fetchShipmentById(shipmentId));
            } else
            {
                setActionSuccess(result.error.message||'Cancellation failed');
            }
            setProcessing(false);
        }
    };

    const handleRetryAWB=async () =>
    {
        setProcessing(true);
        const result=await dispatch(retryAWBAssignment());
        setProcessing(false); // Reset immediately after response
        if (!result.error)
        {
            setActionSuccess('AWB assignment retried successfully');
            setAwbRetried(true);
            dispatch(fetchShipmentById(shipmentId));
            // If AWB is still not assigned after retry, re-enable button after 2 seconds
            setTimeout(() =>
            {
                setAwbRetried(false);
            }, 2000);
        }
    };

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

    const getStatusColor=(status) =>
    {
        const colors={
            'PENDING': '#f59e0b',
            'PICKUP_SCHEDULED': '#3b82f6',
            'PICKED_UP': '#3b82f6',
            'IN_TRANSIT': '#8b5cf6',
            'OUT_FOR_DELIVERY': '#06b6d4',
            'DELIVERED': '#10b981',
            'RTO_INITIATED': '#ef4444',
            'RTO_DELIVERED': '#6b7280',
            'CANCELLED': '#ef4444'
        };
        return colors[status]||'#1a472a';
    };

    if (loading&&!currentShipment)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading shipment details...</div>;
    }

    if (!currentShipment)
    {
        return <div className="flex items-center justify-center h-64 text-red-500">Shipment not found</div>;
    }

    const shipment=currentShipment;
    const canCancel=!['DELIVERED', 'CANCELLED', 'RTO_DELIVERED'].includes(shipment.status);
    const needsAWB=!shipment.awb&&(shipment.status==='PENDING'||shipment.status==='CREATED');

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/shipments')} className="text-[#1a472a] hover:text-[#14532d] flex items-center gap-1">
                    ← Back to Shipments
                </button>
                <h2 className="text-2xl font-bold text-[#1a472a]">Shipment Details</h2>
            </div>

            {actionSuccess&&(
                <div className="bg-[#1a472a]/10 border border-[#1a472a]  p-4 mb-6">
                    {actionSuccess}
                    <button onClick={() => setActionSuccess('')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a472a] float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 flex justify-between items-center border border-red-200  p-4 mb-6">
                    {error}
                    <button onClick={() => dispatch(clearShipmentError())}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 float-right" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Status Banner */}
            <div
                className=" p-4 mb-6 text-[#fffcef] text-center"
                style={{backgroundColor: getStatusColor(shipment.status)}}
            >
                <span>Status: </span>
                <span>{shipment.status?.replace(/_/g, ' ')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Shipment Info */}
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Shipment Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Shipment ID:</span>
                        <span className="text-[#1a472a] font-medium">{shipment.shipmentId||shipment.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">AWB Number:</span>
                        <span className={shipment.awb? 'text-[#1a472a] font-medium':'text-orange-600'}>
                            {shipment.awb||'Not Assigned'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Courier:</span>
                        <span className="text-[#1a472a] font-medium">{shipment.courierName||'Not Selected'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Courier Company ID:</span>
                        <span className="text-[#1a472a] font-medium">{shipment.courierId||'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Created:</span>
                        <span className="text-[#1a472a] font-medium">{formatDate(shipment.createdAt)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Last Updated:</span>
                        <span className="text-[#1a472a] font-medium">{formatDate(shipment.updatedAt)}</span>
                    </div>
                    {shipment.trackingUrl&&(
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                            <span className="text-[#1a472a] text-sm">Tracking:</span>
                            <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-[#1a472a] hover:underline">
                                Track Shipment →
                            </a>
                        </div>
                    )}
                </div>

                {/* Order Info */}
                <div className="bg-white shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Order Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                        <span className="text-[#1a472a] text-sm">Order ID:</span>
                        <a href={`/admin/orders/${shipment.orderId}`} className="text-[#1a472a] hover:underline">
                            #{shipment.orderId?.slice(-8)}
                        </a>
                    </div>
                    {shipment.order&&(
                        <>
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                                <span className="text-[#1a472a] text-sm">Order Status:</span>
                                <span className="text-[#1a472a] font-medium">{shipment.order.status}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                                <span className="text-[#1a472a] text-sm">Payment Status:</span>
                                <span className="text-[#1a472a] font-medium">{shipment.order.paymentStatus}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-[#1a472a]/20">
                                <span className="text-[#1a472a] text-sm">Total Amount:</span>
                                <span className="text-[#1a472a] font-medium">₹{shipment.order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Delivery Address */}
                {console.log(shipment)}
                {shipment.order?.address&&(
                    <div className="bg-white  shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Delivery Address</h3>
                        <p className="text-[#1a472a] leading-relaxed font-medium">{shipment.order.address.fullName}</p>
                        <p className="text-[#1a472a] leading-relaxed">{shipment.order.address.addressLine1}</p>
                        {shipment.order.address.addressLine2&&(
                            <p className="text-[#1a472a] leading-relaxed">{shipment.order.address.addressLine2}</p>
                        )}
                        <p className="text-[#1a472a] leading-relaxed">
                            {shipment.order.address.city}, {shipment.order.address.state}
                        </p>
                        <p className="text-[#1a472a] leading-relaxed">PIN: {shipment.order.address.postalCode}</p>
                        <p className="text-[#1a472a] leading-relaxed">Phone: {shipment.order.address.phone}</p>
                    </div>
                )}

                {/* Tracking History */}
                <div className="bg-white shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Tracking History</h3>
                    {shipment.trackingUrl? (
                        <div className='flex-col flex gap-1'>
                            <p className="text-[#1a472a]">View the tracking history on the courier's website:</p>
                            <a className='decoration-0 text-[#1a472a]' href={shipment?.trackingUrl} target="_blank" rel="noopener noreferrer">{shipment?.trackingUrl}</a>
                        </div>
                    ):(
                        <p className="text-[#1a472a]">Tracking information is not available for this shipment.</p>
                    )}


                </div>
            </div>

            {/* Actions */}
            <div className="bg-white shadow p-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Actions</h3>
                <div className="flex gap-3">
                    {needsAWB&&(
                        <button
                            onClick={handleRetryAWB}
                            disabled={processing||awbRetried}
                            className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d1f] disabled:opacity-50"
                        >
                            {awbRetried? 'Retried':'Retry AWB Assignment'}
                        </button>
                    )}

                    {canCancel&&(
                        <button
                            onClick={handleCancelShipment}
                            disabled={processing}
                            className="px-4 py-2 bg-red-500 text-[#fffcef] rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            {processing? 'Cancelling...':'Cancel Shipment'}
                        </button>
                    )}

                    {shipment.trackingUrl&&(
                        <a
                            href={shipment.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d1f]"
                        >
                            Track on Shiprocket
                        </a>
                    )}

                    <a href={`/admin/orders/${shipment.orderId}`} className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d1f]">
                        View Order
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetails;
