import React from 'react'
import {Link} from 'react-router-dom'

const ShippingPolicy=() =>
{
    return (
        <div className="min-h-screen bg-[#fffcef] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#1a472a] mb-4">Shipping Policy</h1>
                    <p className="text-lg text-[#4a7c59]">Fast, reliable delivery to your doorstep</p>
                </div>

                {/* Last Updated */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <p className="text-sm text-gray-600">
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                {/* Policy Content */}
                <div className="space-y-8">
                    {/* Introduction */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Our Shipping Promise</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            At Ayurwell, we understand how important it is to receive your Ayurvedic products promptly and safely. 
                            We partner with trusted delivery services to ensure your orders reach you in perfect condition.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            This shipping policy outlines our delivery timelines, costs, and procedures for orders within India.
                        </p>
                    </section>

                    {/* Delivery Timeline */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Delivery Timeline</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Standard Delivery
                                </h3>
                                <ul className="space-y-2 text-gray-700 text-sm">
                                    <li>• Metro Cities: 3-5 business days</li>
                                    <li>• Tier 2 & 3 Cities: 5-7 business days</li>
                                    <li>• Rural Areas: 7-10 business days</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                    Express Delivery
                                </h3>
                                <ul className="space-y-2 text-gray-700 text-sm">
                                    <li>• Metro Cities: 1-2 business days</li>
                                    <li>• Tier 2 & 3 Cities: 2-3 business days</li>
                                    <li>• Available for select pin codes</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Shipping Charges */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Shipping Charges</h2>
                        <div className="space-y-4">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-3">Free Shipping</h3>
                                <p className="text-gray-700 mb-2">
                                    Orders above ₹699 qualify for free standard shipping across India.
                                </p>
                                <div className="text-sm text-purple-700 font-medium">
                                    🎉 FREE SHIPPING ON ORDERS ABOVE ₹699
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-[#1a472a] mb-2">Standard Shipping</h4>
                                    <p className="text-gray-700 text-sm">₹40 for orders below ₹699</p>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-[#1a472a] mb-2">Express Shipping</h4>
                                    <p className="text-gray-700 text-sm">₹120 for all order values</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Order Processing */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Order Processing Time</h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Order Confirmation</h3>
                                    <p className="text-gray-700 text-sm">
                                        You'll receive an order confirmation email within 2 hours of placing your order.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Order Processing</h3>
                                    <p className="text-gray-700 text-sm">
                                        Orders are processed within 1-2 business days (excluding Sundays and public holidays).
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Shipment Dispatch</h3>
                                    <p className="text-gray-700 text-sm">
                                        Once shipped, you'll receive a tracking number via email and SMS.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Order Tracking */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Order Tracking</h2>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">
                                Track your order in real-time using the tracking number provided in your shipment confirmation email.
                            </p>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p>• Visit our website's "Track Order" page</p>
                                <p>• Enter your order ID or tracking number</p>
                                <p>• Get real-time updates on your shipment status</p>
                                <p>• Receive SMS and email notifications at key milestones</p>
                            </div>
                        </div>
                    </section>

                    {/* Service Areas */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Service Areas</h2>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-3">We Ship Across India</h3>
                                <p className="text-gray-700 mb-3">
                                    We deliver to over 20,000 pin codes across India, including:
                                </p>
                                <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-700">
                                    <div>• All major metro cities</div>
                                    <div>• Tier 2 and 3 cities</div>
                                    <div>• Most rural areas</div>
                                    <div>• Union territories</div>
                                    <div>• Northeast states</div>
                                    <div>• Island territories (limited service)</div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Note:</strong> Some remote areas may have longer delivery times. 
                                    We'll notify you if your location requires additional shipping time.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Instructions */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Delivery Instructions</h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-[#4a7c59] pl-4">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Address Accuracy</h3>
                                <p className="text-gray-700 text-sm">
                                    Please ensure your delivery address is complete and accurate. 
                                    We're not responsible for deliveries to incorrect addresses.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#4a7c59] pl-4">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Contact Number</h3>
                                <p className="text-gray-700 text-sm">
                                    Provide a valid phone number for delivery coordination. 
                                    Our delivery partners may contact you before delivery.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#4a7c59] pl-4">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Special Instructions</h3>
                                <p className="text-gray-700 text-sm">
                                    Add delivery notes during checkout (e.g., "Leave with security guard" or "Call before delivery").
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Failed Delivery */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Failed Delivery Attempts</h2>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">
                                If delivery fails due to any of the following reasons, additional charges may apply:
                            </p>
                            <ul className="space-y-2 text-gray-700 text-sm">
                                <li>• Recipient not available at the provided address</li>
                                <li>• Incorrect or incomplete address</li>
                                <li>• Phone number not reachable</li>
                                <li>• Premise access restrictions</li>
                            </ul>
                            <p className="text-gray-700 mt-4 text-sm">
                                After 2 failed attempts, the order will be returned to our warehouse. 
                                Re-shipment will incur additional shipping charges.
                            </p>
                        </div>
                    </section>

                    {/* International Shipping */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">International Shipping</h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">
                                Currently, we only ship within India. However, we're working on expanding our services internationally.
                            </p>
                            <p className="text-gray-700 text-sm">
                                For international orders, please contact us at support@ayurwell.com to explore available options.
                            </p>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Shipping Support</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-[#1a472a] mb-3">Contact Us</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Email:</strong> support@ayurwell.com</p>
                                    <p><strong>Phone:</strong> +91 98765 43210</p>
                                    <p><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1a472a] mb-3">Our Warehouse</h3>
                                <div className="text-gray-700">
                                    <p>Ayurwell Fulfillment Center</p>
                                    <p>123 Wellness Street</p>
                                    <p>Mumbai, Maharashtra 400001</p>
                                    <p>India</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Back to Home */}
                    <div className="text-center pt-8">
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShippingPolicy