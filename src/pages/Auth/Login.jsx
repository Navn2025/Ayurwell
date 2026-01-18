import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser, clearError} from '../../store/slices/auth.slice';
import {googleAuth} from '../../api/auth.api';
import './Auth.css';

const Login=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {isAuthenticated, loading, error}=useSelector((state) => state.auth);

    const [formData, setFormData]=useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword]=useState(false);
    const [formErrors, setFormErrors]=useState({});

    // Redirect if already authenticated
    useEffect(() =>
    {
        if (isAuthenticated)
        {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Clear errors on unmount
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

        if (!formData.email.trim())
        {
            errors.email='Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        {
            errors.email='Please enter a valid email address';
        }

        if (!formData.password)
        {
            errors.password='Password is required';
        } else if (formData.password.length<6)
        {
            errors.password='Password must be at least 6 characters';
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

        const result=await dispatch(loginUser({
            email: formData.email,
            password: formData.password,
        }));

        if (loginUser.fulfilled.match(result))
        {
            navigate('/');
        }
    };

    const handleGoogleAuth=() =>
    {
        googleAuth();
    };

    return (
        <div className="auth-page ">
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

                {/* Right Side - Login Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue your wellness journey</p>
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
                            <span>or sign in with email</span>
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
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
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
                                {formErrors.password&&<span className="error-text">{formErrors.password}</span>}
                            </div>

                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading? (
                                    <span className="loading-spinner"></span>
                                ):(
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <Link to="/register">Create Account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
