import React from 'react'
import {Link} from 'react-router-dom'

const RefundPolicy=() =>
{
    return (
        <div className="min-h-screen bg-[#fffcef] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#1a472a] mb-4">Refund Policy</h1>
                    <p className="text-lg text-[#4a7c59]">Our commitment to your satisfaction</p>
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
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Our Commitment</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            At Ayurwell, we are committed to providing you with authentic Ayurvedic products of the highest quality. 
                            If you are not completely satisfied with your purchase, we're here to help.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            This refund policy outlines the conditions under which we process refunds and returns for our products.
                        </p>
                    </section>

                    {/* Eligibility for Refunds */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Eligibility for Refunds</h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-[#4a7c59] pl-4">
                                <h3 className="font-semibold text-[#1a472a] mb-2">30-Day Refund Window</h3>
                                <p className="text-gray-700">
                                    You can request a refund within 30 days from the date of delivery.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#4a7c59] pl-4">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Product Condition</h3>
                                <p className="text-gray-700">
                                    Products must be unused, unopened, and in their original packaging with all seals intact.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#4a7c59] pl-4">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Proof of Purchase</h3>
                                <p className="text-gray-700">
                                    Original order confirmation or invoice must be provided.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Non-Refundable Items */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Non-Refundable Items</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Products that have been opened or used
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Perishable items with expired dates
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Customized or personalized products
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Products returned after the 30-day window
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-500 mr-2">•</span>
                                    Items damaged due to customer misuse
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Refund Process */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Refund Process</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Contact Customer Support</h3>
                                    <p className="text-gray-700">
                                        Email us at support@ayurwell.com or call +91 98765 43210 with your order number and reason for return.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Return Approval</h3>
                                    <p className="text-gray-700">
                                        Our team will review your request and respond within 2-3 business days.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Ship the Product</h3>
                                    <p className="text-gray-700">
                                        Once approved, ship the product back to us using the provided return label.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-[#1a472a] text-white rounded-full flex items-center justify-center font-semibold">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#1a472a] mb-2">Refund Processing</h3>
                                    <p className="text-gray-700">
                                        Refunds are processed within 5-7 business days after we receive the returned product.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Refund Methods */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Refund Methods</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-3">Original Payment Method</h3>
                                <p className="text-gray-700 text-sm">
                                    Refunds are typically processed back to your original payment method (credit card, debit card, UPI, etc.).
                                </p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-3">Store Credit</h3>
                                <p className="text-gray-700 text-sm">
                                    You can opt for store credit, which includes an additional 10% bonus value.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Shipping Costs */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Shipping Costs</h2>
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Return Shipping</h3>
                                <p className="text-gray-700">
                                    For defective products or errors on our part, we will cover the return shipping costs.
                                </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <h3 className="font-semibold text-[#1a472a] mb-2">Customer Returns</h3>
                                <p className="text-gray-700">
                                    For change-of-mind returns, customers are responsible for return shipping costs.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Damaged or Defective Products */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Damaged or Defective Products</h2>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                            <p className="text-gray-700 mb-4">
                                If you receive a damaged or defective product, please contact us within 48 hours of delivery.
                            </p>
                            <p className="text-gray-700 mb-4">
                                We will arrange for a replacement or issue a full refund, including any shipping costs.
                            </p>
                            <p className="text-gray-700">
                                Please provide photos of the damaged product and packaging to help us process your claim quickly.
                            </p>
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-white rounded-lg shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-[#1a472a] mb-4">Need Help?</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-[#1a472a] mb-3">Customer Support</h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Email:</strong> support@ayurwell.com</p>
                                    <p><strong>Phone:</strong> +91 98765 43210</p>
                                    <p><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-[#1a472a] mb-3">Return Address</h3>
                                <div className="text-gray-700">
                                    <p>Ayurwell Returns</p>
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

export default RefundPolicy