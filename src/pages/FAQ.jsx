import React, {useState} from 'react'

const FAQ=() =>
{
    const [activeCategory, setActiveCategory]=useState('general')
    const [openItems, setOpenItems]=useState(new Set())

    const categories=[
        {
            id: 'general',
            name: 'General',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            )
        },
        {
            id: 'products',
            name: 'Products',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
            )
        },
        {
            id: 'orders',
            name: 'Orders & Shipping',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            )
        },
        {
            id: 'payments',
            name: 'Payments',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
            )
        },
        {
            id: 'returns',
            name: 'Returns & Refunds',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            )
        },
        {
            id: 'account',
            name: 'Account',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            )
        },
    ];

    const faqData={
        general: [
            {
                question: "What is Ayurwell?",
                answer: "Ayurwell is your trusted destination for authentic Ayurvedic products and wellness solutions. We offer a carefully curated range of herbal supplements, skincare products, and traditional remedies to support your holistic health journey."
            },
            {
                question: "Are your products authentic?",
                answer: "Yes, all our products are 100% authentic and sourced from reputable manufacturers who follow traditional Ayurvedic principles. We work directly with certified suppliers and ensure quality control at every step."
            },
            {
                question: "Do you have physical stores?",
                answer: "Currently, we operate exclusively online to serve customers across India. However, we have fulfillment centers in major cities to ensure quick delivery. We're planning to open physical stores soon."
            },
            {
                question: "How can I contact customer support?",
                answer: "You can reach our customer support team via email at support@ayurwell.com or call us at +91 98765 43210. Our support hours are Monday to Saturday, 9:00 AM to 6:00 PM IST."
            },
        ],
        products: [
            {
                question: "Are your products safe to use?",
                answer: "Yes, our products are completely safe when used as directed. They are manufactured using natural ingredients following strict quality standards. However, we recommend consulting with a healthcare professional before starting any new supplement regimen."
            },
            {
                question: "Do your products have side effects?",
                answer: "Our Ayurvedic products are generally well-tolerated and have minimal side effects when used correctly. However, individual responses may vary. Please read product labels carefully and follow recommended dosages."
            },
            {
                question: "Are your products vegetarian/vegan?",
                answer: "Most of our products are vegetarian and many are vegan. Each product page clearly indicates dietary information. Look for the vegetarian (🌱) or vegan (🌿) symbols on product listings."
            },
            {
                question: "Do you test on animals?",
                answer: "No, we are completely against animal testing. None of our products or ingredients are tested on animals. We believe in cruelty-free wellness solutions."
            },
            {
                question: "What is the shelf life of your products?",
                answer: "Most of our products have a shelf life of 2-3 years from the date of manufacturing. The expiration date is clearly mentioned on each product packaging. We recommend using products within 6 months of opening for best results."
            },
        ],
        orders: [
            {
                question: "How do I place an order?",
                answer: "Placing an order is simple! Browse our products, add items to your cart, proceed to checkout, enter your delivery details, select a payment method, and confirm your order. You'll receive an order confirmation email shortly after."
            },
            {
                question: "Can I modify or cancel my order?",
                answer: "Yes, you can modify or cancel your order within 2 hours of placing it. After this window, the order enters our processing stage and cannot be changed. Please contact customer support immediately if you need changes."
            },
            {
                question: "How long does delivery take?",
                answer: "Standard delivery takes 3-5 business days for metro cities, 5-7 days for tier 2 & 3 cities, and 7-10 days for rural areas. Express delivery is available for select pin codes with 1-2 day delivery."
            },
            {
                question: "How can I track my order?",
                answer: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can use this number on our 'Track Order' page or the courier partner's website to get real-time updates."
            },
            {
                question: "What if I'm not available during delivery?",
                answer: "If you're not available, the delivery partner will attempt delivery again the next day. After 2 failed attempts, the order will be returned to our warehouse. Please provide accurate delivery details and contact information."
            },
        ],
        payments: [
            {
                question: "What payment methods do you accept?",
                answer: "We accept multiple payment methods including credit/debit cards (Visa, Mastercard, RuPay), UPI, net banking, digital wallets (PayTM, PhonePe, Google Pay), and Cash on Delivery (COD)."
            },
            {
                question: "Is it safe to use my credit card on your website?",
                answer: "Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. Our payment gateway is PCI-DSS compliant, and we never store your card details on our servers."
            },
            {
                question: "Can I pay in installments (EMI)?",
                answer: "Yes, we offer EMI options on orders above ₹2000 for select credit cards. The EMI option will be displayed during checkout if your card is eligible. No additional processing fees are charged for EMI."
            },
            {
                question: "Why was my payment declined?",
                answer: "Payment declines can happen due to various reasons: insufficient funds, incorrect card details, bank security measures, or international transaction restrictions. Please check your details or contact your bank. You can also try another payment method."
            },
            {
                question: "Do you offer Cash on Delivery (COD)?",
                answer: "Yes, COD is available for orders up to ₹5000 across most serviceable areas. A nominal COD charge of ₹40 may apply for orders below ₹699. Please note that COD orders require phone verification."
            },
        ],
        returns: [
            {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for unused products in their original packaging. If you're not satisfied with your purchase, you can request a refund or exchange within 30 days of delivery."
            },
            {
                question: "How do I initiate a return?",
                answer: "To initiate a return, contact our customer support with your order number and reason for return. We'll guide you through the process and provide a return shipping label if approved."
            },
            {
                question: "Are there any items that cannot be returned?",
                answer: "Yes, opened or used products, perishable items, customized products, and items returned after 30 days cannot be refunded. Products damaged due to customer misuse are also non-returnable."
            },
            {
                question: "Who pays for return shipping?",
                answer: "For defective products or our errors, we cover return shipping costs. For change-of-mind returns, customers are responsible for return shipping charges."
            },
            {
                question: "How long do refunds take?",
                answer: "Refunds are processed within 5-7 business days after we receive the returned product. The amount will be credited back to your original payment method. Store credit options are also available with additional benefits."
            },
        ],
        account: [
            {
                question: "Do I need an account to place an order?",
                answer: "No, you can place an order as a guest. However, creating an account offers benefits like order tracking, faster checkout, wishlist management, and exclusive member discounts."
            },
            {
                question: "How do I create an account?",
                answer: "Click on 'Login/Register' at the top of our website, then select 'Create Account'. Fill in your details, verify your email, and you're all set! The process takes less than 2 minutes."
            },
            {
                question: "I forgot my password. How do I reset it?",
                answer: "Click on 'Login' and then 'Forgot Password'. Enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
            },
            {
                question: "Can I change my email address?",
                answer: "For security reasons, email addresses cannot be changed directly. If you need to update your email, please contact our customer support team, and they'll assist you with the process."
            },
            {
                question: "How do I update my shipping address?",
                answer: "Log in to your account, go to 'My Addresses' in your profile, and you can add, edit, or delete shipping addresses. You can also select a default address for future orders."
            },
        ],
    }

    const toggleItem=(itemId) =>
    {
        const newOpenItems=new Set(openItems)
        if (newOpenItems.has(itemId))
        {
            newOpenItems.delete(itemId)
        } else
        {
            newOpenItems.add(itemId)
        }
        setOpenItems(newOpenItems)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-green-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-lg text-green-700">Find answers to common questions about Ayurwell</p>
                </div>

                {/* Search Bar */}
                <div className="bg-white shadow-md p-6 mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                        />
                        <svg
                            className="absolute right-4 top-3.5 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white shadow-md p-6 mb-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${activeCategory===category.id
                                    ? 'bg-[#1a472a] text-[#fffcef] shadow-lg'
                                    :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.icon}
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqData[activeCategory].map((item, index) =>
                    {
                        const itemId=`${activeCategory}-${index}`
                        const isOpen=openItems.has(itemId)

                        return (
                            <div
                                key={itemId}
                                className="bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
                            >
                                <button
                                    onClick={() => toggleItem(itemId)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <h3 className="font-semibold text-green-900 pr-4">{item.question}</h3>
                                    <svg
                                        className={`w-5 h-5 text-green-700 flex-shrink-0 transform transition-transform duration-200 ${isOpen? 'rotate-180':''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6,9 12,15 18,9"></polyline>
                                    </svg>
                                </button>
                                {isOpen&&(
                                    <div className="px-6 py-4 border-t border-gray-100 bg-green-50">
                                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Still Have Questions */}
                <div className="mt-12 bg-gradient-to-r from-green-800 to-green-900 rounded-xl p-8 text-[#fffcef] text-center shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="mb-6 text-green-100">
                        Can't find the answer you're looking for? Our customer support team is here to help!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-900 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Support
                        </button>
                        <a
                            href="tel:+919876543210"
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#fffcef] text-[#1a472a] rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call Us
                        </a>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center pt-8">
                    <button
                        onClick={() => window.location.href='/'}
                        className="inline-flex items-center px-6 py-3 bg-green-800 text-[#fffcef] rounded-lg hover:bg-green-900 transition-colors duration-200 shadow-md"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FAQ