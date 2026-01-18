import React from 'react';
import {Link} from 'react-router-dom';

const AboutUs=() =>
{
    const teamMembers=[
        {
            name: 'Dr. Priya Sharma',
            role: 'Founder & Chief Ayurvedic Consultant',
            image: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 sm:w-16 sm:h-16">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M19 8h-2V6h-2v2h-2v2h2v2h2v-2h2z" />
                </svg>
            ),
            description: 'With over 15 years of experience in Ayurvedic medicine, Dr. Priya leads our mission to bring authentic wellness solutions to modern life.'
        },
        {
            name: 'Rahul Verma',
            role: 'CEO & Co-Founder',
            image: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 sm:w-16 sm:h-16">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <rect x="14" y="6" width="6" height="2" rx="1" />
                    <rect x="14" y="10" width="4" height="2" rx="1" />
                </svg>
            ),
            description: 'A passionate entrepreneur dedicated to making traditional Ayurvedic wisdom accessible to everyone through technology and innovation.'
        },
        {
            name: 'Dr. Anjali Patel',
            role: 'Head of Product Development',
            image: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 sm:w-16 sm:h-16">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M18 8l-1.5-1.5L15 8l-1.5-1.5L12 8l-1.5-1.5L9 8l-1.5-1.5L6 8v8h12V8z" />
                    <circle cx="9" cy="11" r="1" />
                    <circle cx="15" cy="11" r="1" />
                </svg>
            ),
            description: 'Expert in herbal formulations and quality assurance, ensuring every product meets the highest standards of purity and efficacy.'
        },
        {
            name: 'Amit Kumar',
            role: 'Head of Operations',
            image: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 sm:w-16 sm:h-16">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path d="M22 8h-2v2h-2v2h2v2h2v-2h2v-2h-2z" opacity="0.7" />
                    <circle cx="19" cy="10" r="1.5" />
                </svg>
            ),
            description: 'Streamlining our supply chain and customer experience to ensure timely delivery and complete satisfaction.'
        }
    ];

    const milestones=[
        {
            year: '2020',
            title: 'Our Beginning',
            description: 'Started with a small team and a big vision to make authentic Ayurvedic products accessible to all.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M9 12c0-1.66 1.34-3 3-3s3 1.34 3 3c0 1.5-.8 2.8-2 3.5V18h-2v-2.5C9.8 14.8 9 13.5 9 12z" />
                </svg>
            )
        },
        {
            year: '2021',
            title: 'First Product Launch',
            description: 'Launched our initial product line with 15 carefully formulated Ayurvedic supplements and skincare products.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2L4 7v4c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5zm0 2.18l6 3.6v3.72c0 4.76-3.27 9.19-6 10.5-2.73-1.31-6-5.74-6-10.5V7.78l6-3.6z" />
                    <path d="M10.5 13l-2-2-1.5 1.5L10.5 16l6-6-1.5-1.5z" />
                </svg>
            )
        },
        {
            year: '2022',
            title: 'Expansion',
            description: 'Expanded our product range to 50+ products and started serving customers across India.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M13 7H8v14h8V7h-3z" />
                    <path d="M16 3H8v4h8V3z" />
                    <path d="M8 7v10" />
                    <path d="M16 7v10" />
                </svg>
            )
        },
        {
            year: '2023',
            title: 'Quality Recognition',
            description: 'Received ISO and GMP certifications, establishing our commitment to quality and safety.',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V7l-8-5z" />
                    <path d="M9 12l2 2 4-4" />
                </svg>
            )
        },
        {
            year: '2024',
            title: 'Digital Innovation',
            description: 'Launched our enhanced online platform with personalized wellness recommendations and expert consultations.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                    <rect x="7" y="9" width="2" height="2" />
                    <rect x="11" y="9" width="2" height="2" />
                    <rect x="15" y="9" width="2" height="2" />
                </svg>
            )
        }
    ];

    const values=[
        {
            title: 'Authenticity',
            description: 'We stay true to traditional Ayurvedic principles while meeting modern quality standards.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    <circle cx="12" cy="12" r="3" opacity="0.5" />
                </svg>
            ),
            color: 'bg-purple-100 text-purple-700'
        },
        {
            title: 'Purity',
            description: 'All our products are made from pure, natural ingredients without harmful chemicals or additives.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M17 8C17 5.24 14.76 3 12 3S7 5.24 7 8c0 2.56 1.93 4.67 4.41 4.95v2.56l-2.12 2.12 1.41 1.41L12 17.76l1.3 1.28 1.41-1.41-2.12-2.12v-2.56C15.07 12.67 17 10.56 17 8z" />
                    <path d="M12 5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" opacity="0.5" />
                </svg>
            ),
            color: 'bg-green-100 text-green-700'
        },
        {
            title: 'Expertise',
            description: 'Our formulations are developed by qualified Ayurvedic practitioners with decades of experience.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
                </svg>
            ),
            color: 'bg-blue-100 text-blue-700'
        },
        {
            title: 'Accessibility',
            description: 'We make authentic Ayurvedic wellness solutions affordable and accessible to everyone.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
            ),
            color: 'bg-orange-100 text-orange-700'
        },
        {
            title: 'Sustainability',
            description: 'We source ingredients responsibly and use eco-friendly packaging to protect our planet.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    <circle cx="12" cy="12" r="7" opacity="0.3" />
                </svg>
            ),
            color: 'bg-emerald-100 text-emerald-700'
        },
        {
            title: 'Customer Care',
            description: 'Your wellness journey is our priority. We provide personalized support and guidance.',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
            ),
            color: 'bg-red-100 text-red-700'
        }
    ];

    const certifications=[
        {
            name: "ISO Certified",
            description: "ISO 9001:2015 certified for quality management systems",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                </svg>
            ),
        },
        {
            name: "GMP Certified",
            description: "Good Manufacturing Practices certified production facility",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M3 21V9l9-6 9 6v12h-6v-6H9v6z" />
                </svg>
            ),
        },
        {
            name: "Ayush Premium",
            description: "Ministry of Ayush recognized premium quality products",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 22c1-5 7-6 8-6s7 1 8 6" />
                </svg>
            ),
        },
        {
            name: "Organic Ingredients",
            description: "Certified organic sourcing for key ingredients",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M12 2C7 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-3-8-8-8z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#fffcef]">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#1a472a] to-[#14532d] text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="h-16 sm:h-20 w-auto bg-white/10 rounded-full px-6 py-3 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-bold">Ayurwell</span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">About Ayurwell</h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-[#e5e7eb] mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                        Bringing ancient Ayurvedic wisdom to modern wellness journeys
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-white text-[#1a472a] rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium text-sm sm:text-base"
                        >
                            Explore Products
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[#4a7c59] text-white rounded-lg hover:bg-[#14532d] transition-colors duration-200 font-medium text-sm sm:text-base"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#1a472a] mb-4 sm:mb-6">Our Story</h2>
                            <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base">
                                <p className="leading-relaxed">
                                    Ayurwell was born from a simple yet powerful belief: that ancient Ayurvedic wisdom holds the key to modern wellness challenges. Our journey began in 2020 when Dr. Priya Sharma and Rahul Verma came together with a shared vision to make authentic Ayurvedic solutions accessible to everyone.
                                </p>
                                <p className="leading-relaxed">
                                    What started as a small operation with just 15 products has grown into a trusted wellness platform serving thousands of customers across India. We've remained committed to our core principles of authenticity, purity, and customer care throughout our journey.
                                </p>
                                <p className="leading-relaxed">
                                    Today, Ayurwell stands as a bridge between traditional Ayurvedic knowledge and modern lifestyle needs, offering carefully formulated products that address contemporary health concerns while staying true to ancient wisdom.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-[#1a472a] to-[#14532d] rounded-2xl p-6 sm:p-8 text-white">
                            <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-[#fffcef] mb-1 sm:mb-2">50K+</div>
                                    <div className="text-xs sm:text-sm text-[#e5e7eb]">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-[#fffcef] mb-1 sm:mb-2">100+</div>
                                    <div className="text-xs sm:text-sm text-[#e5e7eb]">Authentic Products</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-[#fffcef] mb-1 sm:mb-2">20K+</div>
                                    <div className="text-xs sm:text-sm text-[#e5e7eb]">Cities Served</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl sm:text-3xl font-bold text-[#fffcef] mb-1 sm:mb-2">4.8★</div>
                                    <div className="text-xs sm:text-sm text-[#e5e7eb]">Customer Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a472a] mb-3 sm:mb-4">Our Core Values</h2>
                        <p className="text-base sm:text-lg text-gray-600">The principles that guide everything we do</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${value.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-[#1a472a] mb-2 sm:mb-3">{value.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Journey */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a472a] mb-3 sm:mb-4">Our Journey</h2>
                        <p className="text-base sm:text-lg text-gray-600">Key milestones in our growth story</p>
                    </div>
                    <div className="relative">
                        {/* Timeline Line - Hidden on mobile */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#1a472a] hidden md:block"></div>

                        <div className="space-y-8 sm:space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center gap-4 ${index%2===0? 'md:flex-row-reverse':''}`}>
                                    <div className="flex-1 hidden md:block"></div>
                                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#1a472a] rounded-full flex items-center justify-center text-white z-10">
                                        {milestone.icon}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 ${index%2===0? 'md:mr-8':'md:ml-8'}`}>
                                            <div className="text-xs sm:text-sm font-semibold text-[#4a7c59] mb-1 sm:mb-2">{milestone.year}</div>
                                            <h3 className="text-lg sm:text-xl font-semibold text-[#1a472a] mb-2">{milestone.title}</h3>
                                            <p className="text-sm sm:text-base text-gray-600">{milestone.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a472a] mb-3 sm:mb-4">Meet Our Team</h2>
                        <p className="text-base sm:text-lg text-gray-600">The passionate people behind Ayurwell</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#1a472a] to-[#14532d] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white">
                                    {member.image}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-[#1a472a] mb-1 sm:mb-2">{member.name}</h3>
                                <p className="text-xs sm:text-sm font-medium text-[#4a7c59] mb-2 sm:mb-3">{member.role}</p>
                                <p className="text-xs sm:text-sm text-gray-600">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#1a472a] mb-3 sm:mb-4">Quality Certifications</h2>
                        <p className="text-base sm:text-lg text-gray-600">Our commitment to excellence and safety</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {certifications.map((cert, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center hover:shadow-md transition-shadow">
                                <div className="text-[#1a472a] flex justify-center mb-2 sm:mb-3">{cert.icon}</div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#1a472a] mb-1 sm:mb-2">{cert.name}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">{cert.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Promise */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1a472a] to-[#14532d] text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Promise to You</h2>
                    <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-[#e5e7eb]">
                        <p>
                            We promise to always prioritize your health and wellness above everything else.
                            Every product we offer is carefully selected, tested, and formulated to meet the highest standards of quality and efficacy.
                        </p>
                        <p>
                            We're committed to being your trusted partner in your wellness journey, providing not just products,
                            but also the knowledge and support you need to achieve optimal health through Ayurveda.
                        </p>
                    </div>
                    <div className="mt-6 sm:mt-8">
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-white text-[#1a472a] rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium text-sm sm:text-base"
                        >
                            Get in Touch
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1a472a] mb-4 sm:mb-6">Start Your Wellness Journey Today</h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                        Join thousands of customers who have transformed their lives with authentic Ayurvedic solutions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors duration-200 font-medium text-sm sm:text-base"
                        >
                            Shop Now
                        </Link>
                        <Link
                            to="/faqs"
                            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border-2 border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#1a472a] hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;