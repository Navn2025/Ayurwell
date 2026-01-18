import React, {useEffect, useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {getAllOrders, cancelOrder} from '../../api/order.api'

const Orders=() =>
{
    const navigate=useNavigate()
    const [orders, setOrders]=useState([])
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)
    const [filter, setFilter]=useState('ALL')
    const [cancellingId, setCancellingId]=useState(null)

    useEffect(() =>
    {
        fetchOrders()
    }, [])

    const fetchOrders=async () =>
    {
        setLoading(true)
        try
        {
            const res=await getAllOrders()
            const data=res.data||res
            setOrders(Array.isArray(data)? data:data.orders||[])
        } catch (err)
        {
            console.error('Error fetching orders:', err)
            if (err.response?.status===401)
            {
                navigate('/login')
            } else
            {
                setError('Failed to load orders')
            }
        } finally
        {
            setLoading(false)
        }
    }

    const handleCancelOrder=async (orderId) =>
    {
        if (!window.confirm('Are you sure you want to cancel this order?')) return

        setCancellingId(orderId)
        try
        {
            await cancelOrder(orderId)
            await fetchOrders()
        } catch (err)
        {
            console.error('Error cancelling order:', err)
            setError(err.response?.data?.message||'Failed to cancel order')
        } finally
        {
            setCancellingId(null)
        }
    }

    const getStatusColor=(status) =>
    {
        const colors={
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            PROCESSING: 'bg-indigo-100 text-indigo-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            OUT_FOR_DELIVERY: 'bg-cyan-100 text-cyan-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
            RETURNED: 'bg-gray-100 text-gray-800',
            REFUNDED: 'bg-orange-100 text-orange-800',
            PAID: 'bg-emerald-100 text-emerald-800',
            FAILED: 'bg-red-100 text-red-800'
        }
        return colors[status]||'bg-gray-100 text-gray-800'
    }

    const getPaymentStatusColor=(status) =>
    {
        const colors={
            CREATED: 'bg-yellow-100 text-yellow-800',
            SUCCESS: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
            REFUNDED: 'bg-orange-100 text-orange-800'
        }
        return colors[status]||'bg-gray-100 text-gray-800'
    }

    const formatDate=(date) =>
    {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const filteredOrders=filter==='ALL'
        ? orders
        :orders.filter(order => order.status===filter)

    const canCancelOrder=(order) =>
    {
        return ['PENDING', 'PAID', 'CONFIRMED', 'PROCESSING'].includes(order.status)
    }

    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fffcef]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen font-exo bg-[#fffcef] py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1a472a]">My Orders</h1>
                        <p className="text-[#1a472a] mt-1">Track and manage your orders</p>
                    </div>
                    <Link
                        to="/"
                        className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[#1a472a] hover:text-[#145214] font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>

                {error&&(
                    <div className="mb-6 p-4 bg-[#ffe5e5] border border-[#ffcccc] rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter===status
                                ? 'bg-[#1a472a] text-[#fffcef]  hover:bg-[#004411]'
                                :'bg-white text-[#1a472a] hover:bg-gray-100 border-2 border-[#1a472a] border-dashed'
                                }`}
                        >
                            {status==='ALL'? 'All Orders':status.replace('_', ' ')}
                            {status==='ALL'&&` (${orders.length})`}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length===0? (
                    <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-sm p-12 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 bg-[#1a472a]/10 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#1a472a] mb-2">No orders found</h2>
                        <p className="text-[#1a472a] mb-6">
                            {filter==='ALL'
                                ? "You haven't placed any orders yet."
                                :`No ${filter.toLowerCase().replace('_', ' ')} orders.`}
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-[#1a472a] text-[#fffcef] px-6 py-3 rounded-lg font-semibold hover:bg-[#004411] transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ):(
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white border-2 border-[#1a472a] border-dashed shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b border-[#1a472a]">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-lg font-bold text-[#1a472a]">
                                                {order.orderNumber}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                            {order.payment&&(
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment.status)}`}>
                                                    Payment: {order.payment.status=='CREATED'? 'PENDING':order.payment.status}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-[#66a576]">
                                            Placed on {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items?.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">

                                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product?.images?.[0]?.imageUrl? (
                                                        <img
                                                            src={item.product.images[0].imageUrl}
                                                            alt={item.productName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ):(
                                                        <div className="w-full h-full flex items-center justify-center text-[#1a472a]">
                                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-[#1a472a] truncate">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-[#1a472a]">
                                                        ₹{item.totalPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items?.length>3&&(
                                            <p className="text-sm text-[#1a472a] text-center">
                                                +{order.items.length-3} more items
                                            </p>
                                        )}
                                    </div>

                                    {/* Delivery Address */}
                                    {order.address&&(
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            <h4 className="text-sm font-medium text-[#1a472a]/70 mb-2">Delivery Address</h4>
                                            <p className="text-sm text-[#1a472a]/50">
                                                {order.address.addressLine1}
                                                {order.address.addressLine2&&`, ${order.address.addressLine2}`}
                                                <br />
                                                {order.address.city}, {order.address.state} - {order.address.postalCode}
                                            </p>
                                        </div>
                                    )}

                                    {/* Shipment Info */}
                                    {order.shipment&&(
                                        <div className="mt-4 p-3 bg-[#1a472a]/10 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm">
                                                <svg className="w-5 h-5 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-[#1a472a]">
                                                    {order.shipment.courierName&&`Shipping via ${order.shipment.courierName}`}
                                                    {order.shipment.awbCode&&` • AWB: ${order.shipment.awbCode}`}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order Footer */}
                                <div className="px-6 py-4 bg-[#1a472a]/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <span className="text-sm text-[#1a472a]">Total Amount</span>
                                            <p className="text-xl font-bold text-[#1a472a]">
                                                ₹{order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="text-sm text-[#1a472a]">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentMethod==='COD'
                                                ? 'bg-[#1a472a] text-[#fffcef]'
                                                :'bg-[#1a472a] text-[#fffcef]'
                                                }`}>
                                                {order.paymentMethod==='COD'? 'Cash on Delivery':'Prepaid'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {canCancelOrder(order)&&(
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={cancellingId===order.id}
                                                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                {cancellingId===order.id? 'Cancelling...':'Cancel Order'}
                                            </button>
                                        )}
                                        {!['CANCELLED', 'DELIVERED', 'RETURNED', 'REFUNDED'].includes(order.status)&&(
                                            <Link
                                                to={`/track/${order.id}`}
                                                className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg font-medium hover:bg-[#153a1d] transition-colors"
                                            >
                                                Track
                                            </Link>
                                        )}
                                        <Link
                                            to={`/order/${order.id}`}
                                            className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg font-medium hover:bg-[#153a1d] transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders
