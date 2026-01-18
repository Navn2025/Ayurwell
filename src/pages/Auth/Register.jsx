import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser, clearError} from '../../store/slices/auth.slice';
import {googleAuth} from '../../api/auth.api';
import './Auth.css';
const Register=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {isAuthenticated, loading, error}=useSelector((state) => state.auth);

    const [formData, setFormData]=useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword]=useState(false);
    const [showConfirmPassword, setShowConfirmPassword]=useState(false);
    const [formErrors, setFormErrors]=useState({});
    const [agreeToTerms, setAgreeToTerms]=useState(false);

    useEffect(() =>
    {
        if (isAuthenticated)
        {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() =>
    {
        return () =>
        {
            dispatch(clearError());
        };
    }, [dispatch]);

    const validateForm=() =>
    {
        const errors={};

        if (!formData.firstName.trim())
        {
            errors.firstName='First name is required';
        } else if (formData.firstName.length<2)
        {
            errors.firstName='First name must be at least 2 characters';
        }

        if (!formData.lastName.trim())
        {
            errors.lastName='Last name is required';
        } else if (formData.lastName.length<2)
        {
            errors.lastName='Last name must be at least 2 characters';
        }

        if (!formData.email.trim())
        {
            errors.email='Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        {
            errors.email='Please enter a valid email address';
        }

        if (!formData.phone.trim())
        {
            errors.phone='Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.trim()))
        {
            errors.phone='Phone number must be 10 digits';
        }

        if (!formData.password)
        {
            errors.password='Password is required';
        } else if (formData.password.length<8)
        {
            errors.password='Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
        {
            errors.password='Password must contain uppercase, lowercase, and number';
        }

        if (!formData.confirmPassword)
        {
            errors.confirmPassword='Please confirm your password';
        } else if (formData.password!==formData.confirmPassword)
        {
            errors.confirmPassword='Passwords do not match';
        }

        if (!agreeToTerms)
        {
            errors.terms='You must agree to the terms and conditions';
        }
        setFormErrors(errors);
        return Object.keys(errors).length===0;
    };
    const handleChange=(e) =>
    {
        const {name, value}=e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear specific error when user types
        if (formErrors[name])
        {
            setFormErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };
    const handleSubmit=async (e) =>
    {
        e.preventDefault();
        if (!validateForm()) return;
        const result=await dispatch(registerUser({
            email: formData.email,
            phoneNumber: formData.phone,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
        }));

        if (registerUser.fulfilled.match(result))
        {
            navigate('/');
        }
    };
    const handleGoogleAuth=() =>
    {
        googleAuth();
    };
    const getPasswordStrength=() =>
    {
        const password=formData.password;
        if (!password) return {strength: 0, label: ''};

        let strength=0;
        if (password.length>=8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

        const labels=['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        return {strength, label: labels[strength]};
    };
    const passwordStrength=getPasswordStrength();
    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <h1 className="brand-logo">Ayurwell</h1>
                        <p className="brand-tagline">Begin Your Wellness Journey</p>
                        <div className="brand-features">
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22,4 12,14.01 9,11.01" />
                                </svg>
                                <span>Personalized Recommendations</span>
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                                <span>Exclusive Member Discounts</span>
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span>Expert Ayurvedic Consultation</span>
                            </div>
                        </div>
                    </div>
                    <div className="branding-decoration">
                        <div className="decoration-circle circle-1"></div>
                        <div className="decoration-circle circle-2"></div>
                        <div className="decoration-circle circle-3"></div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2>Create Account</h2>
                            <p>Join our wellness community today</p>
                        </div>

                        {/* Google Auth Button */}
                        <button
                            type="button"
                            className="google-auth-btn"
                            onClick={handleGoogleAuth}
                        >
                            <svg viewBox="0 0 24 24" className="google-icon">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="auth-divider">
                            <span>or register with email</span>
                        </div>

                        {/* Error Message */}
                        {error&&(
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
                            <div className="form-row">
                                <div className={`form-group ${formErrors.firstName? 'error':''}`}>
                                    <label htmlFor="firstName">First Name</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            autoComplete="given-name"
                                        />
                                    </div>
                                    {formErrors.firstName&&<span className="error-text">{formErrors.firstName}</span>}
                                </div>

                                <div className={`form-group ${formErrors.lastName? 'error':''}`}>
                                    <label htmlFor="lastName">Last Name</label>
                                    <div className="input-wrapper">
                                        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            autoComplete="family-name"
                                        />
                                    </div>
                                    {formErrors.lastName&&<span className="error-text">{formErrors.lastName}</span>}
                                </div>
                            </div>

                            <div className={`form-group ${formErrors.email? 'error':''}`}>
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
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />
                                </div>
                                {formErrors.email&&<span className="error-text">{formErrors.email}</span>}
                            </div>

                            <div className={`form-group ${formErrors.phone? 'error':''}`}>
                                <label htmlFor="phone">Phone Number</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92V19a2 2 0 0 1-2 2A19.72 19.72 0 0 1 3 5a2 2 0 0 1 2-2h2.09a2 2 0 0 1 2 1.72c.13.81.37 1.6.7 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.33 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        autoComplete="tel"
                                        maxLength={10}
                                    />
                                </div>
                                {formErrors.phone&&<span className="error-text">{formErrors.phone}</span>}
                            </div>

                            <div className={`form-group ${formErrors.password? 'error':''}`}>
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showPassword? 'text':'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ):(
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formData.password&&(
                                    <div className="password-strength">
                                        <div className="strength-bar">
                                            <div
                                                className={`strength-fill strength-${passwordStrength.strength}`}
                                                style={{width: `${(passwordStrength.strength/5)*100}%`}}
                                            ></div>
                                        </div>
                                        <span className={`strength-label strength-${passwordStrength.strength}`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                )}
                                {formErrors.password&&<span className="error-text">{formErrors.password}</span>}
                            </div>

                            <div className={`form-group ${formErrors.confirmPassword? 'error':''}`}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showConfirmPassword? 'text':'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ):(
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {formErrors.confirmPassword&&<span className="error-text">{formErrors.confirmPassword}</span>}
                            </div>

                            <div className={`terms-checkbox ${formErrors.terms? 'error':''}`}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={agreeToTerms}
                                        onChange={(e) =>
                                        {
                                            setAgreeToTerms(e.target.checked);
                                            if (formErrors.terms)
                                            {
                                                setFormErrors((prev) => ({...prev, terms: ''}));
                                            }
                                        }}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="checkbox-text">
                                        I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                                    </span>
                                </label>
                                {formErrors.terms&&<span className="error-text">{formErrors.terms}</span>}
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading? (
                                    <span className="loading-spinner"></span>
                                ):(
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account?{' '}
                            <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
