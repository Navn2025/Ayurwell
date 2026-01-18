import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import logoImg from '../assets/Group.svg'

const Footer=() =>
{
    const currentYear=new Date().getFullYear()

    const quickLinks=[
        {name: 'About Us', path: '/about'},
        {name: 'Contact', path: '/contact'},
        {name: 'FAQs', path: '/faqs'},
    ]

    const shopLinks=[
        {name: 'All Products', path: '/products'},
        {name: 'Categories', path: '/?scroll=categories'},
    ]

    const customerLinks=[
        {name: 'My Account', path: '/profile'},
        {name: 'Orders', path: '/orders'},
        {name: 'Cart', path: '/cart'},
    ]

    const policyLinks=[
        {name: 'Privacy Policy', path: '/privacy'},
        {name: 'Terms & Conditions', path: '/terms'},
        {name: 'Refund Policy', path: '/refund'},
        {name: 'Shipping Policy', path: '/shipping'},
    ]

    const socialLinks=[
        {
            name: 'Facebook',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
            url: '#'
        },
        {
            name: 'Instagram',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
            ),
            url: '#'
        },
        {
            name: 'Twitter',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            ),
            url: '#'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            ),
            url: '#'
        },
    ]



    return (
        <footer className="bg-[#1a472a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center space-x-3 mb-6">
                                <img src={logoImg} alt="Ayurwell" className="h-10 w-auto" />
                                <span className="text-2xl font-bold text-[#fffcef]">Ayurwell</span>
                            </div>
                            <p className="text-[#e5e7eb] mb-6 leading-relaxed">
                                Discover the healing power of Ayurveda with our authentic, natural wellness products.
                                Nurturing your health since 2020.
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        className="w-10 h-10 bg-[#14532d] rounded-full flex items-center justify-center text-white hover:bg-[#fffcef] hover:text-[#1a472a] transition-colors duration-200"
                                        aria-label={social.name}
                                    >
                                        <span className="w-5 h-5">
                                            {social.icon}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#fffcef] mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({isActive}) =>
                                                `text-[#e5e7eb] hover:text-[#fffcef] transition-colors duration-200 ${isActive? 'text-[#fffcef] font-medium':''
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Shop Links */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#fffcef] mb-6">Shop</h3>
                            <ul className="space-y-3">
                                {shopLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({isActive}) =>
                                                `text-[#e5e7eb] hover:text-[#fffcef] transition-colors duration-200 ${isActive? 'text-[#fffcef] font-medium':''
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Service & Policies */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#fffcef] mb-6">Customer Service</h3>
                            <ul className="space-y-3 mb-6">
                                {customerLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({isActive}) =>
                                                `text-[#e5e7eb] hover:text-[#fffcef] transition-colors duration-200 ${isActive? 'text-[#fffcef] font-medium':''
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>

                            <h4 className="text-sm font-semibold text-[#fffcef] mb-3">Policies</h4>
                            <ul className="space-y-2">
                                {policyLinks.map((link) => (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({isActive}) =>
                                                `text-[#e5e7eb] hover:text-[#fffcef] transition-colors duration-200 text-sm ${isActive? 'text-[#fffcef] font-medium':''
                                                }`
                                            }
                                        >
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-12 pt-8 border-t border-[#14532d]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#14532d] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#fffcef]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-[#e5e7eb]">Phone</p>
                                    <p className="text-[#fffcef] font-medium">+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#14532d] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#fffcef]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-[#e5e7eb]">Email</p>
                                    <p className="text-[#fffcef] font-medium">support@ayurwell.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-[#14532d] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-[#fffcef]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-[#e5e7eb]">Address</p>
                                    <p className="text-[#fffcef] font-medium">Mumbai, India</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-[#14532d]">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-[#e5e7eb] text-sm">
                                © {currentYear} Ayurwell. All rights reserved.
                            </p>
                        </div>

                        <div className="flex items-center space-x-6 text-sm">
                            <span className="text-[#e5e7eb]">Made with ❤️ in India</span>
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-[#4a7c59]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[#4a7c59]">Secure Shopping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer