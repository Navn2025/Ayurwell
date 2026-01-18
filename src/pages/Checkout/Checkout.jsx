import React, {useEffect, useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {getCart} from '../../api/cart.api'
import {getAllAddresses, createAddress, updateAddress} from '../../api/address.api'
import {createOrderFromCart, createOrderFromProduct} from '../../api/order.api'
import {initiatePayment, verifyPayment} from '../../api/payment.api'
import {calculateCartShipping, calculateShipping} from '../../api/shipment.api'
import {createCODOrder} from '../../store/slices/cod.slice'
import {useDispatch} from 'react-redux'


const FREE_DELIVERY_THRESHOLD=699 // ₹699 in rupees

const Checkout=() =>
{
    const navigate=useNavigate()
    const location=useLocation()
    const dispatch=useDispatch()
    // Check if this is a Buy Now checkout
    const buyNowData=location.state?.buyNow? location.state:null

    const [cart, setCart]=useState(null)
    const [addresses, setAddresses]=useState([])
    const [selectedAddressId, setSelectedAddressId]=useState(null)
    const [loading, setLoading]=useState(true)
    const [processing, setProcessing]=useState(false)
    const [error, setError]=useState(null)
    const [paymentMethod, setPaymentMethod]=useState('PREPAID')

    // Shipping state
    const [shippingInfo, setShippingInfo]=useState(null)
    const [calculatingShipping, setCalculatingShipping]=useState(false)

    // Address form state
    const [showAddressForm, setShowAddressForm]=useState(false)
    const [editingAddress, setEditingAddress]=useState(null)
    const [addressForm, setAddressForm]=useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phoneNumber: '',
        saveAs: 'Home'
    })

    useEffect(() =>
    {
        fetchData()
    }, [])

    const fetchData=async () =>
    {
        setLoading(true)
        try
        {
            // If Buy Now mode, we don't need to fetch cart
            if (buyNowData)
            {
                const addressRes=await getAllAddresses()
                const addressData=addressRes.data||addressRes
                const addressList=Array.isArray(addressData)
                    ? addressData
                    :(addressData.address||addressData.addresses||[])

                setAddresses(addressList)

                const defaultAddr=addressList.find(a => a.isDefault)
                if (defaultAddr)
                {
                    setSelectedAddressId(defaultAddr.id)

                    // FIX: use single product shipping
                    calculateShippingForSingleProduct(
                        defaultAddr.postalCode,
                        buyNowData.product.id,
                        buyNowData.quantity
                    )
                }

                setLoading(false)
                return
            }


            const [cartRes, addressRes]=await Promise.all([
                getCart(),
                getAllAddresses()
            ])
            const cartData=cartRes.data||cartRes
            const addressData=addressRes.data||addressRes

            setCart(cartData)
            // API returns { message, address } where address is the array
            const addressList=Array.isArray(addressData)? addressData:(addressData.address||addressData.addresses||[])
            setAddresses(addressList)

            // Set default address as selected
            const defaultAddr=addressList.find(a => a.isDefault)
            if (defaultAddr)
            {
                setSelectedAddressId(defaultAddr.id)

                if (buyNowData)
                {
                    calculateShippingForSingleProduct(
                        defaultAddr.postalCode,
                        buyNowData.product.id,
                        buyNowData.quantity
                    )
                } else
                {
                    calculateShippingForAddress(defaultAddr.postalCode)
                }
            }


            if (!cartData?.items?.length&&!buyNowData)
            {
                navigate('/cart')
            }
        } catch (err)
        {
            console.error('Error fetching data:', err)
            if (err.response?.status===401)
            {
                navigate('/login')
            } else
            {
                setError('Failed to load checkout data')
            }
        } finally
        {
            setLoading(false)
        }
    }

    const handleAddressSubmit=async (e) =>
    {
        e.preventDefault()
        setProcessing(true)
        try
        {
            if (editingAddress)
            {
                await updateAddress({...addressForm, id: editingAddress.id})
            } else
            {
                await createAddress(addressForm)
            }
            await fetchData()
            setShowAddressForm(false)
            setEditingAddress(null)
            resetAddressForm()
        } catch (err)
        {
            console.error('Error saving address:', err)
            setError('Failed to save address')
        } finally
        {
            setProcessing(false)
        }
    }

    const resetAddressForm=() =>
    {
        setAddressForm({
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'India',
            phoneNumber: '',
            saveAs: 'Home'
        })
    }

    const handleEditAddress=(address) =>
    {
        setEditingAddress(address)
        setAddressForm({
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2||'',
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            phoneNumber: address.phoneNumber,
            saveAs: address.saveAs||'Home'
        })
        setShowAddressForm(true)
    }

    const calculateShippingForAddress=async (pincode) =>
    {
        if (!pincode) return

        setCalculatingShipping(true)
        try
        {
            const res=await calculateCartShipping(pincode)
            const data=res.data||res
            setShippingInfo(data)
        } catch (err)
        {
            console.error('Error calculating shipping:', err)
            // Set default shipping info if API fails
            setShippingInfo(null)
        } finally
        {
            setCalculatingShipping(false)
        }
    }
    const calculateShippingForSingleProduct=async (pincode, productId, quantity) =>
    {
        if (!pincode) return
        setCalculatingShipping(true)
        try
        {
            const res=await calculateShipping({
                pincode,
                productId,
                quantity
            })
            const data=res.data||res
            setShippingInfo(data)
        } catch (err)
        {
            console.error('Error calculating shipping:', err)
            setShippingInfo(null)
        } finally
        {
            setCalculatingShipping(false)
        }
    }


    const handleAddressSelect=(addressId) =>
    {
        setSelectedAddressId(addressId)
        const selectedAddress=addresses.find(a => a.id===addressId)
        if (!selectedAddress) return

        if (buyNowData)
        {
            calculateShippingForSingleProduct(
                selectedAddress.postalCode,
                buyNowData.product.id,
                buyNowData.quantity
            )
        } else
        {
            calculateShippingForAddress(selectedAddress.postalCode)
        }
    }


    const calculateSubtotal=() =>
    {
        // Buy Now mode
        if (buyNowData)
        {
            const price=buyNowData.product.discountPrice||buyNowData.product.price
            return price*buyNowData.quantity
        }
        // Cart mode
        if (!cart?.items) return 0
        return cart.items.reduce((sum, item) =>
        {
            const price=item.product.discountPrice||item.product.price // prices in paise
            return sum+(price*item.quantity)
        }, 0)
    }

    const getShippingFee=() =>
    {
        const subtotal=calculateSubtotal()
        if (subtotal>=FREE_DELIVERY_THRESHOLD) return 0 // Free delivery
        return shippingInfo?.originalShippingFee||shippingInfo?.courier?.shippingFee||0 // in paise
    }

    const getTotal=() =>
    {
        return calculateSubtotal()+getShippingFee()
    }

    const isFreeDelivery=() =>
    {
        return calculateSubtotal()>=FREE_DELIVERY_THRESHOLD // in paise
    }

    const amountForFreeDelivery=() =>
    {
        const subtotal=calculateSubtotal()
        return subtotal>=FREE_DELIVERY_THRESHOLD? 0:FREE_DELIVERY_THRESHOLD-subtotal // in paise
    }

    const loadRazorpayScript=() =>
    {
        return new Promise((resolve) =>
        {
            if (window.Razorpay)
            {
                resolve(true)
                return
            }
            const script=document.createElement('script')
            script.src='https://checkout.razorpay.com/v1/checkout.js'
            script.onload=() => resolve(true)
            script.onerror=() => resolve(false)
            document.body.appendChild(script)
        })
    }

    const handlePayment=async () =>
    {
        if (!selectedAddressId)
        {
            setError('Please select a delivery address')
            return
        }

        setProcessing(true)
        setError(null)

        try
        {
            let order

            // Create order - different API for Buy Now vs Cart
            if (buyNowData)
            {
                // Buy Now - create order for single product
                const orderRes=await createOrderFromProduct(
                    buyNowData.product.id,
                    buyNowData.quantity,
                    paymentMethod,
                    selectedAddressId
                )
                const orderData=orderRes.data||orderRes
                order=orderData.order||orderData
            } else
            {
                // Cart checkout
                const orderRes=await createOrderFromCart(paymentMethod, selectedAddressId)
                const orderData=orderRes.data||orderRes
                order=orderData.order||orderData
            }

            if (paymentMethod==='COD')
            {
                // COD order - redirect to success
                await dispatch(createCODOrder(order.id))
                navigate(`/order-success/${order.id}`)

                return
            }

            // Online payment - initiate Razorpay
            const scriptLoaded=await loadRazorpayScript()
            if (!scriptLoaded)
            {
                throw new Error('Failed to load payment gateway')
            }

            const paymentRes=await initiatePayment(order.id)
            const paymentData=paymentRes.data||paymentRes

            const options={
                key: paymentData.key,
                amount: paymentData.razorpayOrder?.amount||paymentData.amount,
                currency: paymentData.razorpayOrder?.currency||paymentData.currency||'INR',
                name: 'Ayurwell',
                description: 'Order Payment',
                order_id: paymentData.razorpayOrder?.id||paymentData.razorpayOrderId,
                handler: async (response) =>
                {
                    try
                    {
                        await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        )
                        navigate(`/order-success/${order.id}`)
                    } catch (verifyErr)
                    {
                        console.error('Payment verification failed:', verifyErr)
                        setError('Payment verification failed. Please contact support.')
                        setProcessing(false)
                    }
                },
                prefill: {
                    contact: addresses.find(a => a.id===selectedAddressId)?.phoneNumber||''
                },
                theme: {
                    color: '#16a34a'
                },
                modal: {
                    ondismiss: () =>
                    {
                        setProcessing(false)
                    }
                }
            }

            const razorpay=new window.Razorpay(options)
            razorpay.open()

        } catch (err)
        {
            console.error('Payment error:', err)
            setError(err.response?.data?.message||'Payment failed. Please try again.')
            setProcessing(false)
        }
    }

    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
            </div>
        )
    }

    const items=cart?.items||[]

    return (
        <div className="min-h-screen bg-[#fffcef] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    Checkout
                </h1>

                {error&&(
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Section - Address & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#1a472a] flex items-center gap-2">
                                    <span className="w-8 h-8 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center text-sm">1</span>
                                    Delivery Address
                                </h2>
                                <button
                                    onClick={() =>
                                    {
                                        setEditingAddress(null)
                                        resetAddressForm()
                                        setShowAddressForm(true)
                                    }}
                                    className="text-[#1a472a] hover:text-[#145214] font-medium text-sm"
                                >
                                    + Add New Address
                                </button>
                            </div>

                            {/* Address Form */}
                            {showAddressForm&&(
                                <form onSubmit={handleAddressSubmit} className="mb-6 p-4 bg-[#1a472a]/20 rounded-lg space-y-4">
                                    <h3 className="font-semibold text-[#1a472a] text-lg mb-4">
                                        {editingAddress? 'Edit Address':'Add New Address'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Address Line 1 *"
                                            value={addressForm.addressLine1}
                                            onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Address Line 2"
                                            value={addressForm.addressLine2}
                                            onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="City *"
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="State *"
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Postal Code *"
                                            value={addressForm.postalCode}
                                            onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Country *"
                                            value={addressForm.country}
                                            onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number *"
                                            value={addressForm.phoneNumber}
                                            onChange={(e) => setAddressForm({...addressForm, phoneNumber: e.target.value})}
                                            required
                                            className="w-full px-4 py-2 border border-[#1a472a]/20 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        {['Home', 'Office', 'Other'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setAddressForm({...addressForm, saveAs: type})}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${addressForm.saveAs===type
                                                    ? 'bg-[#1a472a] text-[#fffcef] hover:bg-[#153d1f]'
                                                    :'bg-[#1a472a]/20 text-[#1a472a] hover:bg-[#1a472a]/40'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-[#1a472a] text-[#fffcef] px-6 py-2 rounded-lg font-medium hover:bg-[#153d1f] transition-colors disabled:opacity-50"
                                        >
                                            {processing? 'Saving...':'Save Address'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                            {
                                                setShowAddressForm(false)
                                                setEditingAddress(null)
                                                resetAddressForm()
                                            }}
                                            className="border border-[#1a472a] text-[#1a472a] px-6 py-2 rounded-lg font-medium hover:bg-[#f0f5f0] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Address List */}
                            {addresses.length===0&&!showAddressForm? (
                                <p className="text-[#1a472a] text-center py-8">
                                    No addresses found. Please add a delivery address.
                                </p>
                            ):(
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            onClick={() => handleAddressSelect(address.id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddressId===address.id
                                                ? 'border-[#1a472a] bg-[#1a472a]/5'
                                                :'border-[#1a472a]/20 hover:border-[#1a472a]/80'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedAddressId===address.id
                                                        ? 'border-[#1a472a]'
                                                        :'border-[#1a472a]/20'
                                                        }`}>
                                                        {selectedAddressId===address.id&&(
                                                            <div className="w-3 h-3 bg-[#1a472a] rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-[#1a472a]">{address.saveAs||'Address'}</span>
                                                            {address.isDefault&&(
                                                                <span className="bg-[#1a472a]/10 text-[#1a472a] text-xs px-2 py-0.5 rounded">Default</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[#1a472a] text-sm">
                                                            {address.addressLine1}
                                                            {address.addressLine2&&`, ${address.addressLine2}`}
                                                        </p>
                                                        <p className="text-[#1a472a] text-sm">
                                                            {address.city}, {address.state} - {address.postalCode}
                                                        </p>
                                                        <p className="text-[#1a472a] text-sm mt-1">
                                                            {address.phoneNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) =>
                                                    {
                                                        e.stopPropagation()
                                                        handleEditAddress(address)
                                                    }}
                                                    className="text-[#1a472a] hover:text-[#16391a] text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-[#1a472a] flex items-center gap-2 mb-6">
                                <span className="w-8 h-8 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                <div
                                    onClick={() => setPaymentMethod('PREPAID')}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod==='PREPAID'
                                        ? 'border-[#1a472a] bg-[#1a472a]/5'
                                        :'border-[#1a472a]/20 hover:border-[#1a472a]/80'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod==='PREPAID'? 'border-[#1a472a]':'border-[#1a472a]/50'}`}>
                                            {paymentMethod==='PREPAID'&&(
                                                <div className="w-3 h-3 bg-[#1a472a] rounded-full"></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1a472a]">Pay Online</p>
                                            <p className="text-sm text-[#1a472a]/70">UPI, Cards, Net Banking, Wallets</p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod==='COD'
                                        ? 'border-[#1a472a] bg-[#1a472a]/5'
                                        :'border-[#1a472a]/20 hover:border-[#1a472a]/80'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod==='COD'? 'border-[#1a472a]':'border-[#1a472a]/50'}`}>
                                            {paymentMethod==='COD'&&(
                                                <div className="w-3 h-3 bg-[#1a472a] rounded-full"></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#1a472a]">Cash on Delivery</p>
                                            <p className="text-sm text-[#1a472a]/70">Pay when you receive your order</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-[#1a472a] flex items-center gap-2 mb-6">
                                <span className="w-8 h-8 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center text-sm">3</span>
                                Order Items ({buyNowData? 1:items.length})
                            </h2>

                            <div className="space-y-4">
                                {buyNowData? (
                                    // Buy Now mode - single product
                                    <div className="flex gap-4 pb-4 border-b border-[#1a472a]/20 last:border-0">
                                        <div className="w-16 h-16 bg-[#1a472a]/10 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={buyNowData.product.images?.[0]?.imageUrl||'/placeholder.png'}
                                                alt={buyNowData.product.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#1a472a] line-clamp-1">{buyNowData.product.name}</p>
                                            <p className="text-sm text-[#1a472a]/70">Qty: {buyNowData.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-[#1a472a]">
                                            ₹{((buyNowData.product.discountPrice||buyNowData.product.price)*buyNowData.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ):(
                                    // Cart mode - multiple items
                                    items.map((item) =>
                                    {
                                        const product=item.product
                                        const price=product.discountPrice||product.price

                                        return (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b border-[#1a472a]/20 last:border-0">
                                                <div className="w-16 h-16 bg-[#1a472a]/10 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.images?.[0]?.imageUrl||'/placeholder.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-[#1a472a] line-clamp-1">{product.name}</p>
                                                    <p className="text-sm text-[#1a472a]/70">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-semibold text-[#1a472a]">₹{(price*item.quantity).toFixed(2)}</p>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky" style={{top: '76px'}}>
                            <h2 className="text-xl font-bold text-[#1a472a] mb-6">
                                Order Summary
                            </h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-[#1a472a]/70">
                                    <span>Subtotal</span>
                                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#1a472a]/70">
                                    <span>Shipping</span>
                                    {calculatingShipping? (
                                        <span className="text-[#1a472a]/70">Calculating...</span>
                                    ):isFreeDelivery()? (
                                        <div className="text-right">

                                            {shippingInfo?.originalShippingFee>0&&(
                                                <span className="text-[#1a472a]/70 line-through text-sm mr-2">
                                                    ₹{shippingInfo.originalShippingFee.toFixed(2)}
                                                </span>
                                            )}
                                            <span className="text-[#1a472a] font-medium">FREE</span>
                                        </div>
                                    ):(
                                        <span>₹{getShippingFee().toFixed(2)}</span>
                                    )}
                                </div>

                                {/* Free Delivery Progress */}
                                {!isFreeDelivery()&&amountForFreeDelivery()>0&&(
                                    <div className="bg-[#1a472a]/10 border border-[#1a472a]/20 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-sm text-[#1a472a]/70 mb-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Add ₹{amountForFreeDelivery().toFixed(2)} more for FREE delivery
                                        </div>
                                        <div className="w-full bg-[#1a472a]/20 rounded-full h-2">
                                            <div
                                                className="bg-[#1a472a] h-2 rounded-full transition-all duration-300"
                                                style={{width: `${Math.min((calculateSubtotal()/FREE_DELIVERY_THRESHOLD)*100, 100)}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Courier Info */}
                                {shippingInfo?.courier&&!calculatingShipping&&(
                                    <div className="flex items-center gap-2 text-sm text-[#1a472a]/70">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {shippingInfo.courier.name} • Est. {shippingInfo.courier.estimatedDeliveryDays} days
                                    </div>
                                )}

                                <hr />
                                <div className="flex justify-between text-xl font-bold text-[#1a472a]">
                                    <span>Total</span>
                                    <span>₹{getTotal().toFixed(2)}</span>
                                </div>

                                {isFreeDelivery()&&shippingInfo?.originalShippingFee>0&&(
                                    <div className="text-sm text-[#1a472a] text-right">
                                        You save ₹{shippingInfo.originalShippingFee.toFixed(2)} on delivery!
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing||!selectedAddressId||calculatingShipping}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${processing||!selectedAddressId||calculatingShipping
                                    ? 'bg-gray-300 text-[#1a472a]/50 cursor-not-allowed'
                                    :'bg-gradient-to-r from-[#1a472a] to-[#14532d] text-[#fffcef] hover:from-[#14532d] hover:to-[#1a472a] shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {processing? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ):paymentMethod==='COD'? (
                                    `Place Order - ₹${getTotal().toFixed(2)}`
                                ):(
                                    `Pay ₹${getTotal().toFixed(2)}`
                                )}
                            </button>

                            {!selectedAddressId&&(
                                <p className="text-red-500 text-sm text-center mt-2">
                                    Please select a delivery address
                                </p>
                            )}

                            <p className="text-xs text-[#1a472a]/70 text-center mt-4">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
