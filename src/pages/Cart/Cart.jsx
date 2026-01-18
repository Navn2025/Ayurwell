import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getCart, updateCartItem, removeFromCart, clearCart} from '../../api/cart.api'

const FREE_DELIVERY_THRESHOLD=699 // ₹699 in rupees

const Cart=() =>
{
    const navigate=useNavigate()
    const [cart, setCart]=useState(null)
    const [loading, setLoading]=useState(true)
    const [updating, setUpdating]=useState(null)
    const [error, setError]=useState(null)

    const fetchCart=async () =>
    {
        try
        {
            const response=await getCart()
            const data=response.data||response
            setCart(data)
            setError(null)
        } catch (err)
        {
            console.error('Error fetching cart:', err)
            if (err.response?.status===401)
            {
                navigate('/login')
            } else
            {
                setError('Failed to load cart')
            }
        } finally
        {
            setLoading(false)
        }
    }

    useEffect(() =>
    {
        fetchCart()
    }, [])

    const handleQuantityChange=async (item, delta) =>
    {
        const newQuantity=item.quantity+delta
        if (newQuantity<1) return

        setUpdating(item.id)
        try
        {
            await updateCartItem(item.productId, newQuantity)
            await fetchCart()
        } catch (err)
        {
            console.error('Error updating quantity:', err)
            setError('Failed to update quantity')
        } finally
        {
            setUpdating(null)
        }
    }

    const handleRemoveItem=async (productId) =>
    {
        setUpdating(productId)
        try
        {
            await removeFromCart(productId)
            await fetchCart()
        } catch (err)
        {
            console.error('Error removing item:', err)
            setError('Failed to remove item')
        } finally
        {
            setUpdating(null)
        }
    }

    const handleClearCart=async () =>
    {
        if (!window.confirm('Are you sure you want to clear your cart?')) return

        setLoading(true)
        try
        {
            await clearCart()
            await fetchCart()
        } catch (err)
        {
            console.error('Error clearing cart:', err)
            setError('Failed to clear cart')
        } finally
        {
            setLoading(false)
        }
    }

    const calculateSubtotal=() =>
    {
        if (!cart?.items) return 0
        return cart.items.reduce((sum, item) =>
        {
            const price=item.product.discountPrice||item.product.price
            return sum+(price*item.quantity)
        }, 0)
    }

    const calculateOriginalTotal=() =>
    {
        if (!cart?.items) return 0
        return cart.items.reduce((sum, item) =>
        {
            return sum+(item.product.price*item.quantity)
        }, 0)
    }

    const calculateSavings=() =>
    {
        return calculateOriginalTotal()-calculateSubtotal()
    }

    const isFreeDelivery=() =>
    {
        return calculateSubtotal()>=FREE_DELIVERY_THRESHOLD // prices in rupees
    }

    const amountForFreeDelivery=() =>
    {
        const subtotal=calculateSubtotal()
        return subtotal>=FREE_DELIVERY_THRESHOLD? 0:FREE_DELIVERY_THRESHOLD-subtotal // in rupees
    }

    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fffcef]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
            </div>
        )
    }

    if (error)
    {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fffcef] gap-4">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={() => fetchCart()}
                    className="bg-[#1a472a] text-[#fffcef] px-6 py-2 rounded-lg hover:bg-[#15381f] transition-colors"
                >
                    Try Again
                </button>
            </div>
        )
    }

    const items=cart?.items||[]

    return (
        <div className="min-h-screen bg-[#fffcef] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1a472a]">
                        Shopping Cart
                    </h1>
                    {items.length>0&&(
                        <button
                            onClick={handleClearCart}
                            className="text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                            Clear Cart
                        </button>
                    )}
                </div>

                {items.length===0? (
                    /* Empty Cart */
                    <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg p-12 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-24 w-24 mx-auto text-[#1a472a] mb-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-[#1a472a] mb-8">
                            Looks like you haven't added anything to your cart yet
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-[#1a472a] to-[#1a472a] text-[#fffcef] px-8 py-3 rounded-xl font-semibold hover:from-[#15381f] hover:to-[#15381f] transition-all shadow-lg"
                        >
                            Start Shopping
                        </button>
                    </div>
                ):(
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) =>
                            {
                                const product=item.product
                                const price=product.discountPrice||product.price
                                const discount=product.discountPrice
                                    ? Math.round(((product.price-product.discountPrice)/product.price)*100)
                                    :0

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white border-2 border-[#1a472a] border-dashed shadow-md p-4 md:p-6 flex gap-4 md:gap-6"
                                    >
                                        {/* Product Image */}
                                        <div
                                            className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-[#1a472a] rounded-lg overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/product/${product.slug}`)}
                                        >
                                            <img
                                                src={product.images?.[0]?.imageUrl||'/placeholder.png'}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className="font-semibold text-[#1a472a] text-lg mb-1 cursor-pointer hover:text-[#15381f] transition-colors line-clamp-2"
                                                onClick={() => navigate(`/product/${product.slug}`)}
                                            >
                                                {product.name}
                                            </h3>

                                            {/* Price */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-xl font-bold text-[#1a472a]">
                                                    ₹{price.toFixed(2)}
                                                </span>
                                                {product.discountPrice&&(
                                                    <>
                                                        <span className="text-sm text-[#1a472a] line-through">
                                                            ₹{product.price.toFixed(2)}
                                                        </span>
                                                        <span className="bg-[#1a472a]/10 text-[#1a472a] text-xs font-semibold px-2 py-0.5 rounded">
                                                            {discount}% OFF
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <div className="flex items-center border border-[#1a472a] rounded-lg">
                                                    <button
                                                        onClick={() => handleQuantityChange(item, -1)}
                                                        disabled={updating===item.id||item.quantity<=1}
                                                        className="px-3 py-1 text-lg font-medium hover:bg-[#1a472a]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="px-4 py-1 font-medium border-x border-[#1a472a] min-w-8 text-center">
                                                        {updating===item.id? (
                                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        ):item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item, 1)}
                                                        disabled={updating===item.id||item.quantity>=product.stockQuantity}
                                                        className="px-3 py-1 text-lg font-medium hover:bg-[#1a472a]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.productId)}
                                                    disabled={updating===item.productId}
                                                    className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="text-right flex-shrink-0 hidden md:block">
                                            <p className="text-sm text-[#1a472a]">Total</p>
                                            <p className="text-xl font-bold text-[#1a472a]">
                                                ₹{(price*item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-[#1a472a] mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-[#1a472a] font-medium">
                                        <span>Subtotal ({items.length} items)</span>
                                        <span>₹{calculateOriginalTotal().toFixed(2)}</span>
                                    </div>

                                    {calculateSavings()>0&&(
                                        <div className="flex justify-between text-[#1a472a] font-medium">
                                            <span>Discount</span>
                                            <span>-₹{calculateSavings().toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-[#1a472a] font-medium">
                                        <span>Shipping</span>
                                        {isFreeDelivery()? (
                                            <span className="text-[#1a472a] font-medium">FREE</span>
                                        ):(
                                            <span className="text-[#1a472a] text-sm">Calculated at checkout</span>
                                        )}
                                    </div>

                                    {/* Free Delivery Progress */}
                                    {!isFreeDelivery()&&amountForFreeDelivery()>0&&(
                                        <div className="bg-[#e6f4ea] border border-[#a3d9a5] rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-sm text-[#1a472a] mb-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Add ₹{amountForFreeDelivery().toFixed(2)} more for FREE delivery
                                            </div>
                                            <div className="w-full bg-[#a3d9a5] rounded-full h-2">
                                                <div
                                                    className="bg-[#1a472a] h-2 rounded-full transition-all duration-300"
                                                    style={{width: `${Math.min((calculateSubtotal()/FREE_DELIVERY_THRESHOLD)*100, 100)}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {isFreeDelivery()&&(
                                        <div className="bg-[#e6f4ea] border border-[#a3d9a5] rounded-lg p-3 text-center">
                                            <span className="text-[#1a472a] font-medium"> You qualify for FREE delivery!</span>
                                        </div>
                                    )}

                                    <hr className="border-[#1a472a]" />

                                    <div className="flex justify-between text-xl font-bold text-[#1a472a]">
                                        <span>Total</span>
                                        <span>₹{calculateSubtotal().toFixed(2)}</span>
                                    </div>

                                    {calculateSavings()>0&&(
                                        <p className="text-[#1a472a] text-sm font-medium text-center bg-[#e6f4ea] py-2 rounded-lg">
                                            You're saving ₹{calculateSavings().toFixed(2)} on this order!
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full py-4 bg-gradient-to-r from-[#1a472a] to-[#2a6b2a] text-[#fffcef] rounded-xl font-semibold text-lg hover:from-[#163916] hover:to-[#1f4d1f] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full mt-3 py-3 border border-[#1a472a] text-[#1a472a] rounded-xl font-medium hover:bg-[#e6f4ea] transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart
