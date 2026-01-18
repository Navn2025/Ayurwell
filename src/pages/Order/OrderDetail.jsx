import React, {useEffect, useState} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {getOrderById, cancelOrder} from '../../api/order.api'

const OrderDetail=() =>
{
    const {orderId}=useParams()
    const navigate=useNavigate()
    const [order, setOrder]=useState(null)
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)
    const [cancelling, setCancelling]=useState(false)

    useEffect(() =>
    {
        fetchOrder()
    }, [orderId])

    const fetchOrder=async () =>
    {
        setLoading(true)
        try
        {
            const res=await getOrderById(orderId)
            const data=res.data||res
            setOrder(data.order||data)
        } catch (err)
        {
            console.error('Error fetching order:', err)
            if (err.response?.status===401)
            {
                navigate('/login')
            } else if (err.response?.status===404)
            {
                setError('Order not found')
            } else
            {
                setError('Failed to load order details')
            }
        } finally
        {
            setLoading(false)
        }
    }

    const handleCancelOrder=async () =>
    {
        if (!window.confirm('Are you sure you want to cancel this order?')) return

        setCancelling(true)
        try
        {
            await cancelOrder(orderId)
            await fetchOrder()
        } catch (err)
        {
            console.error('Error cancelling order:', err)
            setError(err.response?.data?.message||'Failed to cancel order')
        } finally
        {
            setCancelling(false)
        }
    }

    const getStatusColor=(status) =>
    {
        const colors={
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            PAID: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
            PROCESSING: 'bg-indigo-100 text-indigo-800 border-indigo-300',
            SHIPPED: 'bg-purple-100 text-purple-800 border-purple-300',
            OUT_FOR_DELIVERY: 'bg-cyan-100 text-cyan-800 border-cyan-300',
            DELIVERED: 'bg-green-100 text-green-800 border-green-300',
            CANCELLED: 'bg-red-100 text-red-800 border-red-300',
            RETURNED: 'bg-gray-100 text-gray-800 border-gray-300',
            REFUNDED: 'bg-orange-100 text-orange-800 border-orange-300'
        }
        return colors[status]||'bg-gray-100 text-gray-800 border-gray-300'
    }

    const formatDate=(date) =>
    {
        if (!date) return 'Date not available'
        try
        {
            return new Date(date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error)
        {
            return 'Invalid Date'
        }
    }

    const canCancelOrder=() =>
    {
        return order&&['PENDING', 'PAID', 'CONFIRMED', 'PROCESSING'].includes(order.status)
    }

    const getStatusStep=(status) =>
    {
        const steps=['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED']
        const idx=steps.indexOf(status)
        return idx===-1? 0:idx
    }

    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fffcef]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
            </div>
        )
    }

    if (error||!order)
    {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fffcef]">
                <div className="text-red-500 text-xl mb-4">{error||'Order not found'}</div>
                <Link to="/orders" className="text-[#1a472a] hover:text-[#153a1d] font-medium">
                    ← Back to Orders
                </Link>
            </div>
        )
    }

    // Add CANCELLED and REFUNDED as possible steps
    const baseSteps=['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const isCancelled=order.status==='CANCELLED';
    const isRefunded=order.status==='REFUNDED';
    let statusSteps=baseSteps;
    if (isCancelled) statusSteps=[...baseSteps, 'CANCELLED'];
    if (isRefunded) statusSteps=[...baseSteps, 'REFUNDED'];
    // If cancelled or refunded, set currentStep to last index, else use normal logic
    const currentStep=(isCancelled||isRefunded)? statusSteps.length-1:getStatusStep(order.status);

    return (
        <div className="min-h-screen font-exo bg-[#fffcef] py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-[#1a472a] hover:text-[#153a1d] font-medium mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Orders
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1a472a]">{order.orderNumber}</h1>
                            <p className="text-[#667c4a]">Placed on {formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}

                        </span>
                    </div>
                </div>


                {/* Status Timeline (with Cancelled/Refunded support) */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#1a472a] mb-6">Order Status</h2>
                    <div className="relative">
                        <div className="flex justify-between items-center">
                            {statusSteps.map((step, index) =>
                            {
                                // If cancelled, only highlight the CANCELLED step
                                // If refunded, only highlight the REFUNDED step
                                const isCancelledStep=step==='CANCELLED';
                                const isRefundedStep=step==='REFUNDED';
                                const isActive=isCancelled? isCancelledStep:isRefunded? isRefundedStep:index<=currentStep;
                                return (
                                    <div key={step} className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm z-10 ${isActive
                                                ? (isCancelledStep
                                                    ? 'bg-red-600 text-white border-2 border-red-600'
                                                    :isRefundedStep
                                                        ? 'bg-[#fa6630] text-white border-2 border-[#ff581c]'
                                                        :'bg-[#1a472a] text-[#fffcef]')
                                                :'bg-[#fffcef] text-[#1a472a] border-2 border-[#1a472a]'
                                                }`}
                                        >
                                            {isActive&&!isCancelledStep&&!isRefundedStep&&index<currentStep? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ):isCancelledStep&&isActive? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            ):isRefundedStep&&isActive? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                                                </svg>
                                            ):(
                                                index+1
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs font-medium text-center ${isActive
                                                ? (isCancelledStep
                                                    ? 'text-red-600'
                                                    :isRefundedStep
                                                        ? 'text-orange-600'
                                                        :'text-[#1a472a]')
                                                :'text-[#1a472a]'
                                                }`}
                                        >
                                            {step.replace('_', ' ')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Progress Line */}
                        <div
                            className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0"
                            style={{marginLeft: '5%', marginRight: '5%'}}
                        >
                            <div
                                className={`h-full transition-all duration-500 ${isCancelled? 'bg-red-600':isRefunded? 'bg-orange-500':'bg-[#1a472a]'}`}
                                style={{width: `${(currentStep/(statusSteps.length-1))*100}%`}}
                            />
                        </div>
                    </div>
                </div>

                {/* Cancelled/Refunded Banner */}
                {isCancelled&&(
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-800">Order Cancelled</h3>
                                <p className="text-red-600 text-sm">This order has been cancelled.</p>
                            </div>
                        </div>
                    </div>
                )}
                {isRefunded&&(
                    <div className="bg-[#fff4e5] border border-[#ffb87c] rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-800">Order Refunded</h3>
                                <p className="text-orange-600 text-sm">This order has been refunded.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-[#1a472a]/20">
                                <h2 className="text-lg font-semibold text-[#1a472a]">Order Items</h2>
                            </div>
                            <div className="divide-y divide-[#1a472a]/10">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center gap-4">
                                        {console.log(item.product.images[0])}
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product?.images?.[0]?.imageUrl? (
                                                <img
                                                    src={item.product.images[0].imageUrl}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ):(
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-[#1a472a]">{item.productName}</h3>
                                            <p className="text-sm text-[#1a472a]">SKU: {item.sku}</p>
                                            <p className="text-sm text-[#1a472a] mt-1">
                                                Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-[#1a472a]">
                                                ₹{item.totalPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status History */}
                        {console.log(order)}
                        {order.statusHistory&&order.statusHistory.length>0&&(
                            <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
                                <div className="p-6 border-b border-[#1a472a]/20">
                                    <h2 className="text-lg font-semibold text-[#1a472a]">Status History</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.statusHistory.map((history, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="w-3 h-3 mt-1.5 bg-[#1a472a] rounded-full flex-shrink-0"></div>
                                                <div>
                                                    {
                                                        console.log(history)
                                                    }
                                                    <p className="font-medium text-[#1a472a]">{history.returnStatus? history.returnStatus.replace('_', ' '):history.status.replace('_', ' ')}</p>
                                                    <p className="text-sm text-[#1a472a]">{formatDate(history.createdAt)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#1a472a]">Subtotal</span>
                                    <span className="text-[#1a472a]">₹{(order.totalAmount-(order.deliveryFee||0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#1a472a]">Delivery Fee</span>
                                    <span className="text-[#1a472a]">₹{(order.deliveryFee||0).toFixed(2)}</span>
                                </div>
                                <div className="pt-3 border-t border-[#1a472a]/20 flex justify-between">
                                    <span className="font-semibold text-[#1a472a]">Total</span>
                                    <span className="font-bold text-xl text-[#1a472a]">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#1a472a]/20">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${order.paymentMethod==='COD'
                                    ? 'bg-orange-100 text-orange-700'
                                    :'bg-[#1a472a] text-[#fffcef]'
                                    }`}>
                                    {order.paymentMethod==='COD'? 'Cash on Delivery':'Prepaid'}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        {order.address&&(
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Delivery Address</h2>
                                <div className="text-[#1a472a]">
                                    <p className="font-medium text-[#1a472a] mb-1">{order.address.saveAs}</p>
                                    <p>{order.address.addressLine1}</p>
                                    {order.address.addressLine2&&<p>{order.address.addressLine2}</p>}
                                    <p>{order.address.city}, {order.address.state}</p>
                                    <p>{order.address.postalCode}</p>
                                    <p className="mt-2 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {order.address.phoneNumber}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Shipment Info */}
                        {order.shipment&&order.status==!'DELIVERED'&&(
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Shipment Info</h2>
                                <div className="space-y-2 text-sm">
                                    {order.shipment.courierName&&(
                                        <div className="flex justify-between">
                                            <span className="text-[#1a472a]">Courier</span>
                                            <span className="text-[#1a472a]">{order.shipment.courierName}</span>
                                        </div>
                                    )}
                                    {order.shipment.awbCode&&(
                                        <div className="flex justify-between">
                                            <span className="text-[#1a472a]">AWB Code</span>
                                            <span className="text-[#1a472a] font-mono">{order.shipment.awbCode}</span>
                                        </div>
                                    )}
                                    {order.shipment.trackingUrl&&(
                                        <a
                                            href={order.shipment.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-3 text-center py-2 bg-[#1a472a]/10 text-[#1a472a] rounded-lg hover:bg-[#1a472a]/20 transition-colors"
                                        >
                                            Track on Courier Site →
                                        </a>
                                    )}
                                    <Link
                                        to={`/track/${order.id}`}
                                        className="block mt-2 text-center py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#153d1f] transition-colors font-medium"
                                    >
                                        Track Order
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Track Order Button (when no shipment yet) */}
                        {!order.shipment&&!isCancelled&&(
                            <Link
                                to={`/track/${order.id}`}
                                className="block w-full text-center py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                            >
                                Track Order
                            </Link>
                        )}

                        {/* Return Button */}
                        {order.status==='DELIVERED'&&(
                            <Link
                                to={`/return/request/${order.id}`}
                                className="w-full py-3 px-4 bg-[#1a472a] text-white rounded-xl font-medium hover:bg-[#153d1f] transition-colors text-center"
                            >
                                Request Return
                            </Link>
                        )}

                        {/* Cancel Button */}
                        {canCancelOrder()&&(
                            <button
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {cancelling? 'Cancelling...':'Cancel Order'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail
