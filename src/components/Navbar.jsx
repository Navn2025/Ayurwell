import {useState, useEffect, useRef} from "react";
import {Link, NavLink, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {logoutUser} from "../store/slices/auth.slice";
import {fetchAllCategories} from "../store/slices/category.slice";
import {searchSuggestions} from "../api/search.api";
import "./Navbar.css";
import logoImg from "../assets/Group.svg";

const Navbar=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const {isAuthenticated, user}=useSelector((state) => state.auth);
    const {categories}=useSelector((state) => state.category);
    const {totalItems}=useSelector((state) => state.cart);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen]=useState(false);
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen]=useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen]=useState(false);
    const [searchQuery, setSearchQuery]=useState("");
    const [searchSuggestionsList, setSearchSuggestionsList]=useState([]);
    const [showSuggestions, setShowSuggestions]=useState(false);
    const [isSearching, setIsSearching]=useState(false);

    const categoryDropdownRef=useRef(null);
    const settingsDropdownRef=useRef(null);
    const searchRef=useRef(null);
    const suggestionsRef=useRef(null);

    // Fetch categories on mount
    useEffect(() =>
    {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    // Fetch search suggestions
    useEffect(() =>
    {
        const fetchSuggestions=async () =>
        {
            if (searchQuery.trim().length>=1)
            {
                try
                {
                    setIsSearching(true);
                    const response=await searchSuggestions(searchQuery);
                    setSearchSuggestionsList(response.data?.suggestions||response.suggestions||[]);
                    setShowSuggestions(true);
                } catch (error)
                {
                    console.error("Error fetching suggestions:", error);
                    setSearchSuggestionsList([]);
                } finally
                {
                    setIsSearching(false);
                }
            } else
            {
                setSearchSuggestionsList([]);
                setShowSuggestions(false);
            }
        };

        const debounceTimer=setTimeout(() =>
        {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Close dropdowns when clicking outside or pressing Escape
    useEffect(() =>
    {
        const handleInteraction=(event) =>
        {
            const isClickOutside=event.type==="mousedown"||event.type==="touchstart";
            const isEscapeKey=event.type==="keydown"&&event.key==="Escape";

            if (categoryDropdownRef.current&&!categoryDropdownRef.current.contains(event.target))
            {
                setIsCategoryDropdownOpen(false);
            }
            if (settingsDropdownRef.current&&!settingsDropdownRef.current.contains(event.target))
            {
                setIsSettingsDropdownOpen(false);
            }
            if (searchRef.current&&!searchRef.current.contains(event.target)&&
                suggestionsRef.current&&!suggestionsRef.current.contains(event.target))
            {
                setShowSuggestions(false);
            }

            // Close mobile menu on Escape key
            if (isEscapeKey&&isMobileMenuOpen)
            {
                closeMobileMenu();
            }
        };

        document.addEventListener("mousedown", handleInteraction);
        document.addEventListener("touchstart", handleInteraction);
        document.addEventListener("keydown", handleInteraction);
        return () =>
        {
            document.removeEventListener("mousedown", handleInteraction);
            document.removeEventListener("touchstart", handleInteraction);
            document.removeEventListener("keydown", handleInteraction);
        };
    }, [isMobileMenuOpen]);

    // Prevent background scroll when mobile menu is open
    useEffect(() =>
    {
        if (isMobileMenuOpen)
        {
            const scrollY=window.scrollY;
            document.body.style.position='fixed';
            document.body.style.top=`-${scrollY}px`;
            document.body.style.width='100%';
            document.body.style.overflow='hidden';

            return () =>
            {
                const scrollY=document.body.style.top;
                document.body.style.position='';
                document.body.style.top='';
                document.body.style.width='';
                document.body.style.overflow='';
                window.scrollTo(0, parseInt(scrollY||'0')*-1);
            };
        }
    }, [isMobileMenuOpen]);

    const handleLogout=async () =>
    {
        await dispatch(logoutUser());
        navigate("/login");
    };

    const toggleCategoryDropdown=() =>
    {
        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
        setIsSettingsDropdownOpen(false);
    };

    const toggleSettingsDropdown=() =>
    {
        setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
        setIsCategoryDropdownOpen(false);
    };

    const toggleMobileMenu=() =>
    {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsCategoryDropdownOpen(false);
        setIsSettingsDropdownOpen(false);
        setShowSuggestions(false);

        // Focus management for accessibility
        if (!isMobileMenuOpen)
        {
            setTimeout(() =>
            {
                const firstNavLink=document.querySelector('.navbar-menu.active .nav-link');
                if (firstNavLink) firstNavLink.focus();
            }, 100);
        }
    };

    const closeMobileMenu=() =>
    {
        setIsMobileMenuOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsSettingsDropdownOpen(false);
        setShowSuggestions(false);
    };

    const handleSearchSubmit=(e) =>
    {
        e.preventDefault();
        if (searchQuery.trim().length>=2)
        {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
            setSearchQuery("");
            closeMobileMenu();
        }
    };

    const handleSuggestionClick=(item) =>
    {
        if (item.type==="product")
        {
            navigate(`/product/${item.slug}`);
        } else if (item.type==="category")
        {
            navigate(`/category/${item.slug}`);
        }
        setShowSuggestions(false);
        setSearchQuery("");
        closeMobileMenu();
    };

    return (
        <>
            <div className="promo-banner">
                FREE Shipping on Orders Above ₹699
            </div>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen&&(
                        <div
                            className="mobile-overlay   "
                            onClick={closeMobileMenu}
                        />
                    )}

                    {/* Logo */}
                    <NavLink to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        <img src={logoImg} alt="Logo" />
                    </NavLink>

                    {/* Desktop Search Bar */}
                    <div className="navbar-search desktop-search" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products, categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() =>
                                {
                                    if (searchQuery.trim().length>=1&&!showSuggestions)
                                    {
                                        setShowSuggestions(true);
                                    }
                                }}
                            />
                            <button type="submit" className="search-button" aria-label="Search">
                                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                            </button>
                        </form>

                        {/* Search Suggestions */}
                        {showSuggestions&&(searchSuggestionsList.length>0||isSearching)&&(
                            <div className="search-suggestions" ref={suggestionsRef}>
                                {isSearching? (
                                    <div className="suggestion-item">
                                        <span>Searching...</span>
                                    </div>
                                ):(
                                    searchSuggestionsList.map((item, index) => (
                                        <div
                                            key={`${item.type}-${item.id}-${index}`}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(item)}
                                        >
                                            <svg className="suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                {item.type==="product"? (
                                                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                                ):(
                                                    <><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></>
                                                )}
                                            </svg>
                                            <div className="suggestion-content">
                                                <span className="suggestion-name">{item.name}</span>
                                                <span className="suggestion-type">{item.type}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className={`hamburger ${isMobileMenuOpen? "active":""}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>

                    {/* Navigation Menu */}
                    <div className={`navbar-menu ${isMobileMenuOpen? "active":""}`}>
                        {/* Mobile Search Bar */}
                        <div className="mobile-search-container">
                            <form onSubmit={handleSearchSubmit} className="search-form">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search products, categories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="search-button" aria-label="Search">
                                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </button>
                            </form>
                        </div>

                        <ul className="navbar-links">
                            {/* Home */}
                            <li className="nav-item">
                                <NavLink
                                    to="/"
                                    onClick={closeMobileMenu}
                                    className={({isActive}) =>
                                        `nav-link ${isActive? "active":""}`
                                    }
                                >
                                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9,22 9,12 15,12 15,22" />
                                    </svg>
                                    <span>Home</span>
                                </NavLink>
                            </li>

                            {/* Products */}
                            <li className="nav-item">
                                <NavLink
                                    to="/products"
                                    onClick={closeMobileMenu}
                                    className={({isActive}) =>
                                        `nav-link ${isActive? "active":""}`
                                    }
                                >
                                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    <span>Products</span>
                                </NavLink>
                            </li>

                            {/* Shop by Category */}
                            <li className="nav-item dropdown" ref={categoryDropdownRef}>
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={toggleCategoryDropdown}
                                >
                                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                    <span>Categories</span>
                                    <svg
                                        className={`dropdown-arrow ${isCategoryDropdownOpen? "rotate":""}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6,9 12,15 18,9"></polyline>
                                    </svg>
                                </button>

                                {isCategoryDropdownOpen&&(
                                    <div className="dropdown-menu">
                                        {categories&&categories.length>0? (
                                            categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/category/${category.slug}`}
                                                    className="dropdown-item"
                                                    onClick={closeMobileMenu}
                                                >
                                                    {category.name}
                                                    {category.children&&category.children.length>0&&(
                                                        <span className="subcategory-indicator">→</span>
                                                    )}
                                                </Link>
                                            ))
                                        ):(
                                            <div className="dropdown-item disabled">No categories available</div>
                                        )}
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            to="/products"
                                            className="dropdown-item view-all text-[#fffcef]"
                                            onClick={closeMobileMenu}
                                        >
                                            View All Products
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <Link
                                            to="/?scroll=categories"
                                            className="dropdown-item text-[#fffcef]"
                                            onClick={closeMobileMenu}
                                        >
                                            View All Categories
                                        </Link>
                                    </div>
                                )}
                            </li>

                            {/* Orders */}
                            {isAuthenticated&&(
                                <li className="nav-item">
                                    <NavLink
                                        to="/orders"
                                        onClick={closeMobileMenu}
                                        className={({isActive}) => `nav-link ${isActive? "active":""}`}
                                    >
                                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14,2 14,8 20,8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10,9 9,9 8,9"></polyline>
                                        </svg>
                                        <span>Orders</span>
                                    </NavLink>
                                </li>
                            )}

                            {/* Admin Dashboard */}
                            {isAuthenticated&&user?.role==='ADMIN'&&(
                                <li className="nav-item">
                                    <NavLink
                                        to="/admin"
                                        onClick={closeMobileMenu}
                                        className={({isActive}) => `nav-link ${isActive? "active":""}`}
                                    >
                                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="9"></rect>
                                            <rect x="14" y="3" width="7" height="5"></rect>
                                            <rect x="14" y="12" width="7" height="9"></rect>
                                            <rect x="3" y="16" width="7" height="5"></rect>
                                        </svg>
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>
                            )}

                            {/* Cart */}
                            {isAuthenticated&&(
                                <li className="nav-item">
                                    <NavLink
                                        to="/cart"
                                        onClick={closeMobileMenu}
                                        className={({isActive}) => `nav-link cart-link ${isActive? "active":""}`}
                                    >
                                        <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="9" cy="21" r="1"></circle>
                                            <circle cx="20" cy="21" r="1"></circle>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        <span>Cart</span>
                                        {totalItems>0&&(
                                            <span className="cart-badge">{totalItems>99? "99+":totalItems}</span>
                                        )}
                                    </NavLink>
                                </li>
                            )}

                            {/* Contact */}
                            <li className="nav-item">
                                <NavLink
                                    to="/contact"
                                    onClick={closeMobileMenu}
                                    className={({isActive}) => `nav-link ${isActive? "active":""}`}
                                >
                                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                    <span>Contact</span>
                                </NavLink>
                            </li>

                            {/* Settings */}
                            <li className="nav-item dropdown" ref={settingsDropdownRef}>
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={toggleSettingsDropdown}
                                >
                                    <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                    </svg>
                                    <span>Settings</span>
                                    <svg
                                        className={`dropdown-arrow ${isSettingsDropdownOpen? "rotate":""}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6,9 12,15 18,9"></polyline>
                                    </svg>
                                </button>

                                {isSettingsDropdownOpen&&(
                                    <div className="dropdown-menu">
                                        {isAuthenticated&&(
                                            <>
                                                <div className="dropdown-header">
                                                    <span className="user-greeting">Hello, {user?.firstName||"User"}</span>
                                                </div>
                                                <div className="dropdown-divider"></div>
                                                <NavLink to="/profile" className={({isActive}) => `dropdown-item${isActive? " active":""}`} onClick={closeMobileMenu}>
                                                    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="12" cy="7" r="4"></circle>
                                                    </svg>
                                                    Profile
                                                </NavLink>
                                                <NavLink to="/addresses" className={({isActive}) => `dropdown-item${isActive? " active":""}`} onClick={closeMobileMenu}>
                                                    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                    My Addresses
                                                </NavLink>
                                                <div className="dropdown-divider"></div>
                                            </>
                                        )}
                                        <NavLink to="/about" className={({isActive}) => `dropdown-item${isActive? " active":""}`} onClick={closeMobileMenu}>
                                            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            About Us
                                        </NavLink>
                                        <NavLink to="/contact" className={({isActive}) => `dropdown-item${isActive? " active":""}`} onClick={closeMobileMenu}>
                                            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                            </svg>
                                            Help & Support
                                        </NavLink>
                                        <NavLink to="/privacy" className={({isActive}) => `dropdown-item${isActive? " active":""}`} onClick={closeMobileMenu}>
                                            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                            Privacy Policy
                                        </NavLink>
                                        <NavLink to="/terms" className={({isActive}) => `dropdown-item${isActive? " active":""}`} onClick={closeMobileMenu}>
                                            <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14,2 14,8 20,8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10,9 9,9 8,9"></polyline>
                                            </svg>
                                            Terms & Conditions
                                        </NavLink>
                                        {isAuthenticated&&(
                                            <>
                                                <div className="dropdown-divider"></div>
                                                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                                    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                        <polyline points="16,17 21,12 16,7"></polyline>
                                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                                    </svg>
                                                    Logout
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        </ul>

                        {/* Login Button */}
                        {!isAuthenticated&&(
                            <div className="navbar-auth">
                                <NavLink to="/login" className={({isActive}) => `login-btn${isActive? " active":""}`} onClick={closeMobileMenu}>
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10,17 15,12 10,7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                    <span>Login</span>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;