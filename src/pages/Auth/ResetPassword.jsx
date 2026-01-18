import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetUserPassword, clearError } from '../../store/slices/auth.slice'
import './Auth.css'

const ResetPassword = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { loading, error, message } = useSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })
    const [formErrors, setFormErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [tokenValid, setTokenValid] = useState(true)

    const token = searchParams.get('token')

    // Check if token exists
    useEffect(() => {
        if (!token) {
            setTokenValid(false)
        }
    }, [token])

    // Clear errors on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    const validateForm = () => {
        const errors = {}

        if (!formData.password) {
            errors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
        } else if (formData.password.length > 20) {
            errors.password = 'Password must not exceed 20 characters'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match'
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const calculatePasswordStrength = (password) => {
        if (!password) return 0
        
        let strength = 0
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^a-zA-Z\d]/.test(password)) strength++
        
        return Math.min(strength, 5)
    }

    const getPasswordStrengthLabel = (strength) => {
        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
        return labels[strength] || 'Very Weak'
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

        const result = await dispatch(resetUserPassword({
            token,
            newPassword: formData.password,
        }))

        if (resetUserPassword.fulfilled.match(result)) {
            setIsSuccess(true)
        }
    }

    if (!tokenValid) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-branding">
                        <div className="branding-content">
                            <h1 className="brand-logo">Ayurwell</h1>
                            <p className="brand-tagline">Embrace Natural Wellness</p>
                        </div>
                    </div>
                    <div className="auth-form-container">
                        <div className="auth-form-wrapper">
                            <div className="auth-header">
                                <h2>Invalid Reset Link</h2>
                                <p>This password reset link is invalid or has expired.</p>
                            </div>
                            <div className="error-message">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                <p>Please request a new password reset link.</p>
                            </div>
                            <div className="auth-switch">
                                <Link to="/forgot-password">Request New Reset Link</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-branding">
                        <div className="branding-content">
                            <h1 className="brand-logo">Ayurwell</h1>
                            <p className="brand-tagline">Embrace Natural Wellness</p>
                        </div>
                    </div>
                    <div className="auth-form-container">
                        <div className="auth-form-wrapper">
                            <div className="success-message">
                                <div className="success-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22,4 12,14.01 9,11.01" />
                                    </svg>
                                </div>
                                <h3>Password Reset Successful!</h3>
                                <p>Your password has been successfully updated.</p>
                                <p className="success-subtext">
                                    You can now use your new password to sign in to your account.
                                </p>
                                <Link to="/login" className="auth-submit-btn">
                                    Sign In Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const passwordStrength = calculatePasswordStrength(formData.password)

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

                {/* Right Side - Reset Password Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2>Reset Password</h2>
                            <p>Create a new password for your account</p>
                        </div>

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
                            <div className={`form-group ${formErrors.password ? 'error' : ''}`}>
                                <label htmlFor="password">New Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                                
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div 
                                                className={`strength-fill strength-${passwordStrength}`}
                                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className={`strength-label strength-${passwordStrength}`}>
                                            {getPasswordStrengthLabel(passwordStrength)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className={`form-group ${formErrors.confirmPassword ? 'error' : ''}`}>
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
                            </div>

                            {/* Password Requirements */}
                            <div className="password-requirements">
                                <h4>Password Requirements:</h4>
                                <ul>
                                    <li className={formData.password.length >= 6 ? 'met' : ''}>
                                        At least 6 characters
                                    </li>
                                    <li className={/[a-z]/.test(formData.password) ? 'met' : ''}>
                                        One lowercase letter
                                    </li>
                                    <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>
                                        One uppercase letter
                                    </li>
                                    <li className={/\d/.test(formData.password) ? 'met' : ''}>
                                        One number
                                    </li>
                                </ul>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>

                        <div className="auth-switch">
                            Remember your password?{' '}
                            <Link to="/login">Back to Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword