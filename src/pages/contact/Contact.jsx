import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {submitContactForm, clearSuccess, clearError} from '../../store/slices/contact.slice';
import './Contact.css';

const Contact=() =>
{
    const dispatch=useDispatch();
    const {loading, error, submitSuccess}=useSelector((state) => state.contact);

    const [formData, setFormData]=useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [formErrors, setFormErrors]=useState({});
    const [submitted, setSubmitted]=useState(false);

    useEffect(() =>
    {
        if (submitSuccess)
        {
            setSubmitted(true);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTimeout(() =>
            {
                setSubmitted(false);
                dispatch(clearSuccess());
            }, 3000);
        }
    }, [submitSuccess, dispatch]);

    const validateForm=() =>
    {
        const errors={};

        if (!formData.firstName.trim())
            errors.firstName='First name is required';
        else if (formData.firstName.trim().length<2)
            errors.firstName='First name must be at least 2 characters';

        if (!formData.lastName.trim())
            errors.lastName='Last name is required';
        else if (formData.lastName.trim().length<2)
            errors.lastName='Last name must be at least 2 characters';

        if (!formData.email.trim())
            errors.email='Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.email='Invalid email format';

        if (!formData.phone.trim())
            errors.phone='Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
            errors.phone='Phone number must be 10 digits';

        if (!formData.subject.trim())
            errors.subject='Subject is required';
        else if (formData.subject.trim().length<5)
            errors.subject='Subject must be at least 5 characters';

        if (!formData.message.trim())
            errors.message='Message is required';
        else if (formData.message.trim().length<10)
            errors.message='Message must be at least 10 characters';

        setFormErrors(errors);
        return Object.keys(errors).length===0;
    };

    const handleChange=(e) =>
    {
        const {name, value}=e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name])
        {
            setFormErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit=async (e) =>
    {
        e.preventDefault();
        if (!validateForm()) return;

        const result=await dispatch(submitContactForm({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.replace(/\D/g, ''),
            subject: formData.subject.trim(),
            message: formData.message.trim()
        }));

        if (!result.error)
        {
            // Success handled in useEffect
        }
    };

    return (
        <div className="min-h-screen font-exo bg-[#fffcef] py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1a472a] mb-2">Contact Us</h1>
                    <p className="text-[#4a7c59] text-lg">We'd love to hear from you. Get in touch with our team.</p>
                </div>

                {/* Success Message */}
                {submitted&&(
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3 animate-pulse">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <span className="text-green-700 font-medium">Thank you! Your message has been sent successfully.</span>
                    </div>
                )}

                {/* Error Message */}
                {error&&(
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={() => dispatch(clearError())}
                            className="text-red-500 hover:text-red-700 text-2xl"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Contact Form */}
                <div className="bg-white border-2 border-dashed border-[#1a472a] shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-[#1a472a] mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Your first name"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition ${formErrors.firstName? 'border-red-500':'border-[#d6e8d6]'
                                        }`}
                                />
                                {formErrors.firstName&&(
                                    <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-[#1a472a] mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Your last name"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition ${formErrors.lastName? 'border-red-500':'border-[#d6e8d6]'
                                        }`}
                                />
                                {formErrors.lastName&&(
                                    <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#1a472a] mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition ${formErrors.email? 'border-red-500':'border-[#d6e8d6]'
                                        }`}
                                />
                                {formErrors.email&&(
                                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#1a472a] mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone number"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition ${formErrors.phone? 'border-red-500':'border-[#d6e8d6]'
                                        }`}
                                />
                                {formErrors.phone&&(
                                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-[#1a472a] mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What is your inquiry about?"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition ${formErrors.subject? 'border-red-500':'border-[#d6e8d6]'
                                    }`}
                            />
                            {formErrors.subject&&(
                                <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-[#1a472a] mb-2">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Please provide details about your inquiry..."
                                rows="6"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-transparent transition resize-none ${formErrors.message? 'border-red-500':'border-[#d6e8d6]'
                                    }`}
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className={`text-xs ${formData.message.length<10? 'text-red-500':'text-[#4a7c59]'}`}>
                                    {formData.message.length}/500 characters (minimum 10 characters)
                                </p>
                                {formErrors.message&&(
                                    <p className="text-red-500 text-xs">{formErrors.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition flex items-center justify-center gap-2"
                        >
                            {loading? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" opacity="0.2" />
                                        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                    </svg>
                                    Sending...
                                </>
                            ):(
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                    </svg>
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border-2 border-dashed border-[#1a472a] shadow p-6 text-center">
                        <div className="w-12 h-12 bg-[#1a472a] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-[#fffcef]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-2">Call Us</h3>
                        <p className="text-[#4a7c59]">+91 (555) 123-4567</p>
                    </div>

                    <div className="bg-white border-2 border-dashed border-[#1a472a] shadow p-6 text-center">
                        <div className="w-12 h-12 bg-[#1a472a] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-[#fffcef]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-2">Email</h3>
                        <p className="text-[#4a7c59]">support@ayurwell.com</p>
                    </div>

                    <div className="bg-white border-2 border-dashed border-[#1a472a] shadow p-6 text-center">
                        <div className="w-12 h-12 bg-[#1a472a] rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-[#fffcef]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-2">Address</h3>
                        <p className="text-[#4a7c59]">123 Wellness Street, Delhi, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
