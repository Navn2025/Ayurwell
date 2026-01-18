import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {completeUserProfile} from '../../store/slices/auth.slice';
import './Auth.css';

const CompleteProfile=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation();
    const {user, loading, error}=useSelector((state) => state.auth);

    const [formData, setFormData]=useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });

    const [formErrors, setFormErrors]=useState({});
    const [success, setSuccess]=useState(false);

    // Redirect if user is already authenticated with complete profile
    useEffect(() =>
    {
        if (user&&user.isProfileComplete)
        {
            const from=location.state?.from?.pathname||'/';
            navigate(from);
        }
    }, [user, navigate, location]);

    // Pre-fill with existing user data
    useEffect(() =>
    {
        if (user)
        {
            setFormData({
                firstName: user.firstName||'',
                lastName: user.lastName||'',
                phoneNumber: user.phoneNumber||'',
            });
        }
    }, [user]);

    const validateForm=() =>
    {
        const errors={};

        if (!formData.firstName.trim())
        {
            errors.firstName='First name is required';
        } else if (formData.firstName.trim().length<2)
        {
            errors.firstName='First name must be at least 2 characters';
        }

        if (!formData.lastName.trim())
        {
            errors.lastName='Last name is required';
        } else if (formData.lastName.trim().length<2)
        {
            errors.lastName='Last name must be at least 2 characters';
        }

        if (!formData.phoneNumber.trim())
        {
            errors.phoneNumber='Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, '')))
        {
            errors.phoneNumber='Phone number must be 10 digits';
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

        // Clear error for this field
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

        const result=await dispatch(completeUserProfile({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneNumber: formData.phoneNumber.trim(),
        }));

        if (completeUserProfile.fulfilled.match(result))
        {
            setSuccess(true);
            setTimeout(() =>
            {
                navigate('/');
            }, 1500);
        }
    };

    // Show loading state if checking authentication
    if (!user)
    {

        return (
            <div className="auth-page">

                <div className="flex w-full  items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
                </div>

            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left Side - Branding */}
                <div className="auth-branding">
                    <div className="branding-content">
                        <h1 className="brand-logo">Ayurwell</h1>
                        <p className="brand-tagline">Complete Your Profile</p>
                        <div className="brand-features">
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Personalized Wellness</span>
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>Secure & Trusted</span>
                            </div>
                            <div className="feature-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span>Expert Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="branding-decoration">
                        <div className="decoration-circle circle-1"></div>
                        <div className="decoration-circle circle-2"></div>
                        <div className="decoration-circle circle-3"></div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="auth-form-container">
                    <div className="auth-form-wrapper">
                        <div className="auth-header">
                            <h2>Complete Your Profile</h2>
                            <p>We need a few more details to get you started</p>
                        </div>

                        {/* Success Message */}
                        {success&&(
                            <div className="auth-success" style={{marginBottom: '20px'}}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Profile completed successfully! Redirecting...</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error&&(
                            <div className="auth-error" style={{marginBottom: '20px'}}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* First Name */}
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
                                        placeholder="Enter your first name"
                                        autoComplete="given-name"
                                    />
                                </div>
                                {formErrors.firstName&&<span className="error-text">{formErrors.firstName}</span>}
                            </div>

                            {/* Last Name */}
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
                                        placeholder="Enter your last name"
                                        autoComplete="family-name"
                                    />
                                </div>
                                {formErrors.lastName&&<span className="error-text">{formErrors.lastName}</span>}
                            </div>

                            {/* Phone Number */}
                            <div className={`form-group ${formErrors.phoneNumber? 'error':''}`}>
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Enter 10-digit phone number"
                                        autoComplete="tel"
                                    />
                                </div>
                                {formErrors.phoneNumber&&<span className="error-text">{formErrors.phoneNumber}</span>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading||success}
                            >
                                {loading? (
                                    <span className="loading-spinner"></span>
                                ):success? (
                                    '✓ Completed'
                                ):(
                                    'Complete Profile'
                                )}
                            </button>
                        </form>

                        {/* Info Message */}
                        <div style={{marginTop: '20px', padding: '12px', backgroundColor: '#e6f4ea', borderRadius: '8px', borderLeft: '4px solid #1a472a'}}>
                            <p style={{fontSize: '13px', color: '#1a472a', margin: 0}}>
                                This information helps us provide you with personalized wellness recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-success {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 16px;
                    background: #e6f4ea;
                    border: 1px solid #a8d5ba;
                    color: #1a472a;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }
                
                .auth-success svg {
                    width: 20px;
                    height: 20px;
                    flex-shrink: 0;
                    color: #1a472a;
                }
            `}</style>
        </div>
    );
};

export default CompleteProfile;
