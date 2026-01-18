import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import
{
    fetchOrderById,
    changeOrderStatus,
    cancelUserOrder,
    clearError as clearOrderError
} from '../../../store/slices/order.slice';

const OrderDetails=() =>
{
    const {orderId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentOrder, loading, error}=useSelector(state => state.order);

    const [newStatus, setNewStatus]=useState('');
    const [showStatusModal, setShowStatusModal]=useState(false);

    useEffect(() =>
    {
        if (orderId)
        {
            dispatch(fetchOrderById(orderId));
        }
    }, [dispatch, orderId]);

    useEffect(() =>
    {
        if (currentOrder)
        {
            setNewStatus(currentOrder.status);
        }
    }, [currentOrder]);

    const handleStatusUpdate=async () =>
    {
        await dispatch(changeOrderStatus({orderId, status: newStatus}));
        setShowStatusModal(false);
        dispatch(fetchOrderById(orderId));
    };

    const handleCancelOrder=async () =>
    {
        if (window.confirm('Are you sure you want to cancel this order?'))
        {
            await dispatch(cancelUserOrder({orderId}));
            dispatch(fetchOrderById(orderId));
        }
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

    const statusFlow=['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

    const getStatusBadgeColor=(status) =>
    {
        const colors={
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            PROCESSING: 'bg-purple-100 text-purple-800',
            SHIPPED: 'bg-indigo-100 text-indigo-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800'
        };
        return colors[status]||'bg-gray-100 text-gray-800';
    };

    const getPaymentBadgeColor=(status) =>
    {
        const colors={
            PAID: 'bg-green-100 text-green-800',
            PENDING: 'bg-yellow-100 text-yellow-800',
            FAILED: 'bg-red-100 text-red-800',
            REFUNDED: 'bg-purple-100 text-purple-800'
        };
        return colors[status]||'bg-gray-100 text-gray-800';
    };

    if (loading&&!currentOrder)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading order details...</div>;
    }

    if (!currentOrder)
    {
        return <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">Order not found</div>;
    }

    const order=currentOrder;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/orders')} className="text-[#1a472a] hover:text-[#153d1a] flex items-center gap-1">
                        ← Back to Orders
                    </button>
                    <h2 className="text-2xl font-bold text-[#1a472a]">Order #{order.id.slice(-8)}</h2>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    {error}
                    <button onClick={() => dispatch(clearOrderError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                {/* Order Summary */}
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 pb-2 border-b">Order Summary</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Order ID:</span>
                        <span className="text-[#1a472a] font-medium">{order.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Order Date:</span>
                        <span className="text-[#1a472a] font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70   text-sm">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Payment Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentBadgeColor(order.payment?.status||'PENDING')}`}>
                            {order.payment?.status||'PENDING'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Payment Method:</span>
                        <span className="text-[#1a472a] font-medium">{order.paymentMethod||'N/A'}</span>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 pb-2 border-b">Customer Information</h3>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Name:</span>
                        <span className="text-[#1a472a] font-medium">
                            {order.user
                                ? `${order.user.firstName||''} ${order.user.lastName||''}`.trim()||'N/A'
                                :'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Email:</span>
                        <span className="text-[#1a472a] font-medium">{order.user?.email||'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                        <span className="text-[#1a472a]/70 text-sm">Phone:</span>
                        <span className="text-[#1a472a] font-medium">{order.user?.phoneNumber||'N/A'}</span>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 pb-2 border-b">Shipping Address</h3>
                    {order.address? (
                        <div className="text-[#1a472a] leading-relaxed">
                            {console.log(order)}
                            <p className="font-medium">{order.address.saveAs}</p>
                            <p>{order.address.addressLine1}</p>
                            {order.address.addressLine2&&(
                                <p>{order.address.addressLine2}</p>
                            )}
                            <p>
                                {order.address.city}, {order.address.state} - {order.address.postalCode}
                            </p>
                            <p>Phone: {order.address.phoneNumber}</p>
                        </div>
                    ):(
                        <p className="text-[#1a472a]/70 leading-relaxed">No shipping address</p>
                    )}
                </div>

                {/* Shipment Info */}
                {order.shipment&&(
                    <div className="bg-white  shadow p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 pb-2 border-b">Shipment Details</h3>
                        <div className="flex justify-between py-2 border-b border-[#1a472a]/10 last:border-0">
                            <span className="text-[#1a472a]/70 text-sm">Shipment ID:</span>
                            <span className="text-[#1a472a] font-medium">{order.shipment.id}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500 text-sm">AWB Number:</span>
                            <span className="text-gray-800 font-medium">{order.shipment.awb||'Not assigned'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500 text-sm">Courier:</span>
                            <span className="text-gray-800 font-medium">{order.shipment.courierName||'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-500 text-sm">Status:</span>
                            <span className="text-gray-800 font-medium">{order.shipment.status}</span>
                        </div>
                        {order.shipment.trackingUrl&&(
                            <a href={order.shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-[#fffcef]  hover:bg-blue-600">
                                Track Shipment
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Order Items */}
            <div className="bg-white  shadow p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#1a472a] mb-4 pb-2 border-b">Order Items ({order.orderItems?.length||0})</h3>
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Product</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">SKU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map(item => (
                            <tr key={item.id} className="border-b border-[#1a472a]/10 hover:bg-[#1a472a]/20">
                                {console.log(item)}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {item.product?.images?.[0]&&(
                                            <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                                        )}
                                        <span className="text-[#1a472a]">{item.product?.name||'Product'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-[#1a472a]">{item.product?.sku||'N/A'}</td>
                                <td className="px-4 py-3 text-[#1a472a]">{formatCurrency(item.price)}</td>
                                <td className="px-4 py-3 text-[#1a472a]">{item.quantity}</td>
                                <td className="px-4 py-3 text-[#1a472a]">{formatCurrency(item.price*item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-[#1a472a]/10">
                            <td colSpan="4" className="px-4 py-3 text-right text-[#1a472a]/70">Subtotal:</td>
                            <td className="px-4 py-3 text-[#1a472a]">{formatCurrency(order.subtotal||order.totalAmount)}</td>
                        </tr>
                        {order.shippingCost>0&&(
                            <tr className="bg-[#1a472a]/10">
                                <td colSpan="4" className="px-4 py-3 text-right text-[#1a472a]/70">Shipping:</td>
                                <td className="px-4 py-3 text-[#1a472a]">{formatCurrency(order.shippingCost)}</td>
                            </tr>
                        )}
                        {order.discount>0&&(
                            <tr className="bg-[#1a472a]/10">
                                <td colSpan="4" className="px-4 py-3 text-right text-[#1a472a]/70">Discount:</td>
                                <td className="px-4 py-3 text-[#1a472a]">-{formatCurrency(order.discount)}</td>
                            </tr>
                        )}
                        <tr className="bg-[#1a472a]/10">
                            <td colSpan="4" className="px-4 py-3 text-right font-bold text-lg text-[#1a472a]">Total:</td>
                            <td className="px-4 py-3 font-bold text-lg text-[#1a472a]">{formatCurrency(order.totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Actions</h3>
                <div className="flex gap-3">
                    {order.status!=='CANCELLED'&&order.status!=='DELIVERED'&&(
                        <>
                            <button onClick={() => setShowStatusModal(true)} className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d23]">
                                Update Status
                            </button>
                            <button onClick={handleCancelOrder} className="px-4 py-2 bg-red-500 text-[#fffcef] rounded-lg hover:bg-red-600">
                                Cancel Order
                            </button>
                        </>
                    )}
                    <a href={`/admin/refunds?orderId=${order.id}`} className="px-4 py-2 bg-[#fffcef] border border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#e6e6d6]">
                        View Refunds
                    </a>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal&&(
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#fffcef]  shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Update Order Status</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-[#1a472a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a472a]"
                        >
                            {statusFlow.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="flex gap-3 mt-4">
                            <button onClick={handleStatusUpdate} className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d23]">
                                Update
                            </button>
                            <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 bg-[#fffcef] border border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#e6e6d6]">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
