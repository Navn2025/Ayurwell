import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { forgotUserPassword, clearError } from '../../store/slices/auth.slice'
import './Auth.css'

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, message } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        email: '',
    })
    const [formErrors, setFormErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Clear errors on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    const validateForm = () => {
        const errors = {}

        if (!formData.email.trim()) {
            errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear specific error when user types
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        const result = await dispatch(forgotUserPassword({
            email: formData.email,
        }))

        if (forgotUserPassword.fulfilled.match(result)) {
            setIsSubmitted(true)
        }
    }

    const handleResend = async () => {
        const result = await dispatch(forgotUserPassword({
            email: formData.email,
        }))

        if (forgotPassword.fulfilled.match(result)) {
            // Show success message
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <h1 className="brand-logo">Ayurwell</h1>
                        <p className="brand-tagline">Embrace Natural Wellness</p>
                        <div className="brand-features">
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>100% Authentic Ayurvedic Products</span>
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                                <span>Fast & Secure Delivery</span>
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>Trusted by Thousands</span>
                            </div>
                        </div>
                    </div>
                    <div className="branding-decoration">
                        <div className="decoration-circle circle-1"></div>
                        <div className="decoration-circle circle-2"></div>
                        <div className="decoration-circle circle-3"></div>
                    </div>
                </div>

                {/* Right Side - Forgot Password Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2>Forgot Password?</h2>
                            <p>Enter your email to receive password reset instructions</p>
                        </div>

                        {!isSubmitted ? (
                            <>
                                {/* Error Message */}
                                {error && (
                                    <div className="auth-error">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
                                        <label htmlFor="email">Email Address</label>
                                        <div className="input-wrapper">
                                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your registered email"
                                                autoComplete="email"
                                            />
                                        </div>
                                        {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="auth-submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="loading-spinner"></span>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </button>
                                </form>

                                <div className="auth-switch">
                                    Remember your password?{' '}
                                    <Link to="/login">Back to Login</Link>
                                </div>
                            </>
                        ) : (
                            <div className="success-message">
                                <div className="success-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22,4 12,14.01 9,11.01" />
                                    </svg>
                                </div>
                                <h3>Reset Link Sent!</h3>
                                <p>
                                    We've sent password reset instructions to:<br />
                                    <strong>{formData.email}</strong>
                                </p>
                                <p className="success-subtext">
                                    Please check your email and follow the link to reset your password.
                                    The link will expire in 15 minutes.
                                </p>
                                
                                <div className="success-actions">
                                    <button
                                        onClick={handleResend}
                                        className="resend-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="loading-spinner small"></span>
                                        ) : (
                                            'Resend Email'
                                        )}
                                    </button>
                                    <Link to="/login" className="back-to-login">
                                        Back to Login
                                    </Link>
                                </div>

                                <div className="help-text">
                                    <p>Didn't receive the email?</p>
                                    <ul>
                                        <li>Check your spam/junk folder</li>
                                        <li>Verify the email address is correct</li>
                                        <li>Wait a few minutes and try again</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword