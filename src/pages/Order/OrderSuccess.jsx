import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {getOrderById} from '../../api/order.api'

const OrderSuccess=() =>
{
    const {orderId}=useParams()
    const navigate=useNavigate()
    const [order, setOrder]=useState(null)
    const [loading, setLoading]=useState(true)

    useEffect(() =>
    {
        const fetchOrder=async () =>
        {
            try
            {
                const response=await getOrderById(orderId)
                setOrder(response.data||response)
            } catch (err)
            {
                console.error('Error fetching order:', err)
            } finally
            {
                setLoading(false)
            }
        }

        if (orderId)
        {
            fetchOrder()
        }
    }, [orderId])

    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fffcef] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-[#d6f5d6] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-[#1a472a] mb-2">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-[#1a472a] mb-6">
                        Thank you for your order. We'll send you a confirmation email shortly.
                    </p>

                    {order&&(
                        <div className="bg-[#fffcef] rounded-lg p-4 mb-6 text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-[#1a472a]">Order ID:</span>
                                <span className="font-semibold text-[#1a472a]">{order.id?.slice(0, 8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#1a472a]">Total Amount:</span>
                                <span className="font-semibold text-[#1a472a]">₹{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-[#1a472a]">Payment Method:</span>
                                <span className="font-semibold text-[#1a472a]">{order.paymentMethod==='COD'? 'Cash on Delivery':'Online Payment'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#1a472a]">Status:</span>
                                <span className="font-semibold text-[#1a472a]">{order.status}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-gradient-to-r from-[#1a472a] to-[#2a6b2a] text-[#fffcef] px-8 py-3 rounded-xl font-semibold hover:from-[#153d1f] hover:to-[#1f4d1f] transition-all shadow-lg"
                        >
                            View My Orders
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="border border-[#1a472a] text-[#1a472a] px-8 py-3 rounded-xl font-medium hover:bg-[#f0f5f0] transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                {/* Order Items */}
                {order?.orderItems&&order.orderItems.length>0&&(
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                        <h2 className="text-xl font-bold text-[#1a472a] mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-[#1a472a]/20 last:border-0">
                                    <div className="w-16 h-16 bg-[#1a472a]/20 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.product?.images?.[0]?.imageUrl||'/placeholder.png'}
                                            alt={item.product?.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[#1a472a]">{item.product?.name}</p>
                                        <p className="text-sm text-[#1a472a]">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-[#1a472a]">₹{item.priceAtPurchase*item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delivery Address */}
                {order?.address&&(
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                        <h2 className="text-xl font-bold text-[#1a472a] mb-4">Delivery Address</h2>
                        <div className="text-[#1a472a]">
                            <p className="font-semibold text-[#1a472a]">{order.address.saveAs}</p>
                            <p>{order.address.addressLine1}</p>
                            {order.address.addressLine2&&<p>{order.address.addressLine2}</p>}
                            <p>{order.address.city}, {order.address.state} - {order.address.postalCode}</p>
                            <p className="mt-2"> {order.address.phoneNumber}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderSuccess
