import React, {useEffect, useState} from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {getOrderById, cancelOrder} from '../../api/order.api'
import {getShipmentByOrder} from '../../api/shipment.api'

const TrackOrder=() =>
{
    const {orderId}=useParams()
    const navigate=useNavigate()
    const [order, setOrder]=useState(null)
    const [shipment, setShipment]=useState(null)
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)
    const [cancelling, setCancelling]=useState(false)

    useEffect(() =>
    {
        fetchData()
    }, [orderId])

    const fetchData=async () =>
    {
        setLoading(true)
        try
        {
            const [orderRes, shipmentRes]=await Promise.all([
                getOrderById(orderId),
                getShipmentByOrder(orderId).catch(() => null)
            ])

            const orderData=orderRes.data||orderRes
            setOrder(orderData.order||orderData)

            if (shipmentRes)
            {
                const shipmentData=shipmentRes.data||shipmentRes
                setShipment(shipmentData)
            }
        } catch (err)
        {
            console.error('Error fetching data:', err)
            if (err.response?.status===401)
            {
                navigate('/login')
            } else if (err.response?.status===404)
            {
                setError('Order not found')
            } else
            {
                setError('Failed to load tracking information')
            }
        } finally
        {
            setLoading(false)
        }
    }

    const handleCancelOrder=async () =>
    {
        if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return

        setCancelling(true)
        setError(null)
        try
        {
            await cancelOrder(orderId)
            await fetchData()
        } catch (err)
        {
            console.error('Error cancelling order:', err)
            setError(err.response?.data?.message||'Failed to cancel order')
        } finally
        {
            setCancelling(false)
        }
    }


    // Determines if the order can be cancelled (not delivered, not cancelled, not refunded)
    const canCancelOrder=() =>
    {
        if (!order) return false;
        // Only allow cancel if status is strictly in cancellable states
        // and NOT in any forbidden state
        const cancellableStatuses=['PENDING', 'PAID', 'CONFIRMED', 'PROCESSING'];
        const forbiddenStatuses=['DELIVERED', 'CANCELLED', 'REFUNDED', 'RETURNED'];
        return cancellableStatuses.includes(order.status)&&!forbiddenStatuses.some(s => order.status===s);
    };

    // Determines if the order can be returned (delivered and returnable)
    console.log(order)
    const canReturnOrder=() =>
    {
        return order&&order.status==='DELIVERED'&&order.returnable;
    };

    const handleReturnOrder=async () =>
    {
        // Implement your return order logic here (e.g., navigate to return page or open modal)
        navigate(`/order/${orderId}/return`);
    };

    const getStatusInfo=(status) =>
    {
        const statusMap={
            CREATED: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeWidth="2" />
                    </svg>
                ),
                title: 'Order Created',
                description: 'Your order has been placed successfully',
                color: 'blue'
            },

            PICKUP_SCHEDULED: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                    </svg>
                ),
                title: 'Pickup Scheduled',
                description: 'Courier pickup has been scheduled',
                color: 'indigo'
            },

            PICKED_UP: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path d="M3 17h13V6H3v11Z" strokeWidth="2" />
                        <path d="M16 8h4l1 3v6h-5" strokeWidth="2" />
                        <circle cx="7.5" cy="17.5" r="1.5" />
                        <circle cx="18.5" cy="17.5" r="1.5" />
                    </svg>
                ),
                title: 'Picked Up',
                description: 'Package has been picked up by courier',
                color: 'purple'
            },

            IN_TRANSIT: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path d="M2 16l20-8-8 20-2-8-10-4Z" strokeWidth="2" />
                    </svg>
                ),
                title: 'In Transit',
                description: 'Your package is on its way',
                color: 'cyan'
            },

            OUT_FOR_DELIVERY: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <circle cx="5.5" cy="17.5" r="1.5" />
                        <circle cx="18.5" cy="17.5" r="1.5" />
                        <path d="M3 17V6h11v11M14 8h4l2 3v6h-6" strokeWidth="2" />
                    </svg>
                ),
                title: 'Out for Delivery',
                description: 'Package is out for delivery today',
                color: 'orange'
            },

            DELIVERED: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <polyline points="20 6 9 17 4 12" strokeWidth="2" />
                    </svg>
                ),
                title: 'Delivered',
                description: 'Package has been delivered successfully',
                color: 'green'
            },

            CANCELLED: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                        <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
                    </svg>
                ),
                title: 'Cancelled',
                description: 'Shipment has been cancelled',
                color: 'red'
            },

            RTO_INITIATED: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path d="M9 14l-4-4 4-4" strokeWidth="2" />
                        <path d="M5 10h10a4 4 0 1 1 0 8h-1" strokeWidth="2" />
                    </svg>
                ),
                title: 'Return Initiated',
                description: 'Package is being returned to origin',
                color: 'orange'
            },

            RTO_DELIVERED: {
                icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
                        <path d="M4 4h16v16H4z" strokeWidth="2" />
                        <path d="M8 12l2 2 6-6" strokeWidth="2" />
                    </svg>
                ),
                title: 'Returned',
                description: 'Package has been returned to warehouse',
                color: 'gray'
            }
        };

        return statusMap[status]||{icon: '📦', title: status, description: '', color: 'gray'}
    }

    const getTrackingSteps=() =>
    {
        const allSteps=[
            {status: 'CREATED', label: 'Order Placed'},
            {status: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled'},
            {status: 'PICKED_UP', label: 'Picked Up'},
            {status: 'IN_TRANSIT', label: 'In Transit'},
            {status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery'},
            {status: 'DELIVERED', label: 'Delivered'}
        ];

        let steps=[...allSteps];
        // Helper to get last status before refund/cancel from order.statusHistory
        const getLastStatusBefore=(target) =>
        {
            if (!order.statusHistory||!Array.isArray(order.statusHistory)) return null;
            const idx=order.statusHistory.findIndex(h => h.status===target);
            if (idx>0)
            {
                // Return the status just before the target
                return order.statusHistory[idx-1]?.status;
            }
            return null;
        };
        if (order.status==='CANCELLED')
        {
            let lastStatus=getLastStatusBefore('CANCELLED');
            let lastStatusIdx=lastStatus? steps.findIndex(s => s.status===lastStatus):0;
            steps=steps.slice(0, lastStatusIdx+1);
            steps.push({status: 'CANCELLED', label: 'Order Cancelled'});
        } else if (order.status==='REFUNDED')
        {
            let lastStatus=getLastStatusBefore('REFUNDED');
            let lastStatusIdx=lastStatus? steps.findIndex(s => s.status===lastStatus):steps.length-1;
            steps=steps.slice(0, lastStatusIdx+1);
            steps.push({status: 'REFUNDED', label: 'Order Refunded'});
        }

        // Find current status index (shipment status or final order status)
        let currentStatus=shipment?.status||'CREATED';
        let currentIndex=steps.findIndex(s => s.status===currentStatus);
        // If cancelled/refunded, set currentIndex to last step
        if (order.status==='CANCELLED'||order.status==='REFUNDED')
        {
            currentIndex=steps.length-1;
        }

        return steps.map((step, index) => ({
            ...step,
            completed: index<currentIndex,
            current: index===currentIndex,
            upcoming: index>currentIndex
        }));
    };

    const formatDate=(date) =>
    {
        if (!date) return null
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
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

    const statusInfo=getStatusInfo(shipment?.status||'CREATED')
    const trackingSteps=getTrackingSteps()

    return (
        <div className="min-h-screen bg-[#fffcef] py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        to={`/order/${orderId}`}
                        className="inline-flex items-center gap-2 text-[#1a472a] hover:text-[#153a1d] font-medium mb-4"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Order
                    </Link>
                    <h1 className="text-2xl font-bold text-[#1a472a]">Track Order</h1>
                    <p className="text-[#667c4a]">{order.orderNumber}</p>
                </div>

                {/* Current Status Card */}
                <div className={`bg-${statusInfo.color}-50 border border-${statusInfo.color}-200 rounded-2xl p-6 mb-8`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-${statusInfo.color}-100 rounded-full flex items-center justify-center text-3xl`}>
                            {statusInfo.icon}
                        </div>
                        <div>
                            <h2 className={`text-xl font-bold text-${statusInfo.color}-800`}>{statusInfo.title}</h2>
                            <p className={`text-${statusInfo.color}-600`}>{statusInfo.description}</p>
                        </div>
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-6">Tracking Timeline</h3>

                    <div className="relative">
                        {trackingSteps.map((step, index) =>
                        {
                            // Special styling for cancelled/refunded step
                            const isCancelledStep=step.status==='CANCELLED';
                            const isRefundedStep=step.status==='REFUNDED';
                            let indicatorClass='';
                            let textClass='';
                            if (isCancelledStep)
                            {
                                indicatorClass=step.current? 'bg-red-600 text-white ring-4 ring-red-100':'bg-gray-200 text-gray-500';
                                textClass=step.current? 'text-red-700 font-bold':'text-gray-900';
                            } else if (isRefundedStep)
                            {
                                indicatorClass=step.current? 'bg-orange-500 text-white ring-4 ring-orange-100':'bg-gray-200 text-gray-500';
                                textClass=step.current? 'text-orange-700 font-bold':'text-gray-900';
                            } else
                            {
                                indicatorClass=step.completed
                                    ? 'bg-[#1a472a] text-white'
                                    :step.current
                                        ? 'bg-[#1a472a] text-white ring-4 ring-[#1a472a]/20'
                                        :'bg-gray-200 text-gray-500';
                                textClass=step.current? 'text-[#1a472a] font-bold':'text-gray-900';
                            }
                            return (
                                <div key={step.status} className="flex items-start mb-8 last:mb-0">
                                    {/* Step Indicator */}
                                    <div className="flex flex-col items-center mr-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm z-10 ${indicatorClass}`}>
                                            {step.completed&&!isCancelledStep&&!isRefundedStep? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ):isCancelledStep&&step.current? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                                                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
                                                </svg>
                                            ):isRefundedStep&&step.current? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                                                </svg>
                                            ):(
                                                index+1
                                            )}
                                        </div>
                                        {index<trackingSteps.length-1&&(
                                            <div className={`w-0.5 h-12 ${step.completed? 'bg-[#1a472a]':'bg-gray-200'}`}></div>
                                        )}
                                    </div>

                                    {/* Step Content */}
                                    <div className={`pt-2 ${step.upcoming? 'opacity-50':''}`}>
                                        <h4 className={`font-medium ${textClass}`}>{step.label}</h4>
                                        {step.current&&!isCancelledStep&&!isRefundedStep&&(
                                            <p className="text-sm text-[#1a472a] mt-1">Current Status</p>
                                        )}
                                        {isCancelledStep&&step.current&&(
                                            <p className="text-sm text-red-600 mt-1">Order has been cancelled.</p>
                                        )}
                                        {isRefundedStep&&step.current&&(
                                            <p className="text-sm text-orange-600 mt-1">Order has been refunded.</p>
                                        )}
                                        {step.status==='PICKED_UP'&&shipment?.pickedUpAt&&(
                                            <p className="text-sm text-[#1a472a] mt-1">{formatDate(shipment.pickedUpAt)}</p>
                                        )}
                                        {step.status==='DELIVERED'&&shipment?.deliveredAt&&(
                                            <p className="text-sm text-[#1a472a] mt-1">{formatDate(shipment.deliveredAt)}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shipment Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Courier Info */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Shipment Details</h3>

                        {shipment? (
                            <div className="space-y-4">
                                {shipment.courier&&(
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#1a472a]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#1a472a]">Courier Partner</p>
                                            <p className="font-medium text-[#1a472a]">{shipment.courier}</p>
                                        </div>
                                    </div>
                                )}

                                {shipment.awb&&(
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#1a472a]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#1a472a]">AWB / Tracking Number</p>
                                            <p className="font-mono font-medium text-[#1a472a]">{shipment.awb}</p>
                                        </div>
                                    </div>
                                )}

                                {shipment.createdAt&&(
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#1a472a]/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#1a472a]">Shipment Created</p>
                                            <p className="font-medium text-[#1a472a]">{formatDate(shipment.createdAt)}</p>
                                        </div>
                                    </div>
                                )}

                                {shipment.trackingUrl&&(
                                    <a
                                        href={shipment.trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 block w-full py-3 bg-[#1a472a] text-white text-center rounded-xl font-medium hover:bg-[#153a1f] transition-colors"
                                    >
                                        Track on Courier Website →
                                    </a>
                                )}
                            </div>
                        ):(
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-[#1a472a]">Shipment not yet created</p>
                                <p className="text-sm text-[#1a472a] mt-1">Tracking details will be available once the order is shipped</p>
                            </div>
                        )}
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Delivery Address</h3>

                        {order.address? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#1a472a]/20 text-[#1a472a] px-2 py-1 rounded text-sm font-medium">
                                        {order.address.saveAs||'Home'}
                                    </span>
                                </div>
                                <p className="text-[#1a472a]">{order.address.addressLine1}</p>
                                {order.address.addressLine2&&(
                                    <p className="text-[#1a472a]">{order.address.addressLine2}</p>
                                )}
                                <p className="text-[#1a472a]">
                                    {order.address.city}, {order.address.state} - {order.address.postalCode}
                                </p>
                                <p className="text-[#1a472a]">{order.address.country}</p>

                                <div className="pt-4 mt-4 border-t border-[#1a472a]/20">
                                    <div className="flex items-center gap-2 text-[#1a472a]">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>{order.address.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        ):(
                            <p className="text-[#1a472a]">Address not available</p>
                        )}
                    </div>
                </div>

                {/* Order Items Preview */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Order Items</h3>
                    <div className="flex flex-wrap gap-4">
                        {order.items?.slice(0, 4).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-[#1a472a]/10 rounded-lg p-3">
                                <div className="w-12 h-12 bg-[#1a472a]/20 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.product?.images?.[0]?.imageUrl? (
                                        <img
                                            src={item.product.images[0].imageUrl}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ):(
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1a472a] line-clamp-1">{item.productName}</p>
                                    <p className="text-xs text-[#1a472a]">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                        {order.items?.length>4&&(
                            <div className="flex items-center justify-center bg-[#1a472a]/10 rounded-lg px-4 py-3">
                                <span className="text-sm text-[#1a472a]">+{order.items.length-4} more</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {/* Show Cancel Order button only if not delivered and cancellable */}
                    {canCancelOrder()&&(
                        <button
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelling? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Cancelling...
                                </span>
                            ):(
                                'Cancel Order'
                            )}
                        </button>
                    )}
                    {/* Show Return Order button if delivered and returnable */}
                    {canReturnOrder()&&(
                        <button
                            onClick={handleReturnOrder}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            Return Order
                        </button>
                    )}
                    <Link
                        to={`/order/${orderId}`}
                        className="px-6 py-3 bg-[#1a472a] text-[#fffcef] rounded-xl font-medium hover:bg-[#153a1f] transition-colors"
                    >
                        View Order Details
                    </Link>
                    <Link
                        to="/orders"
                        className="px-6 py-3 bg-[#1a472a]/10 text-[#1a472a] rounded-xl font-medium hover:bg-[#1a472a]/20 transition-colors"
                    >
                        All Orders
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TrackOrder
