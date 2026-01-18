import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {logoutUser} from '../../store/slices/auth.slice';

const AdminLeftNav=({isOpen, onClose}) =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {user}=useSelector(state => state.auth);

    const handleLogout=async () =>
    {
        await dispatch(logoutUser());
        navigate('/login');
        onClose?.();
    };

    const handleNavClick=() =>
    {
        if (isOpen&&window.innerWidth<1024)
        {
            onClose?.();
        }
    };

    const navItems=[
        {path: '/admin/dashboard', label: 'Dashboard', exact: true},
        {path: '/admin/products', label: 'Products'},
        {path: '/admin/categories', label: 'Categories'},
        {path: '/admin/concerns', label: 'Concerns'},
        {path: '/admin/orders', label: 'Orders'},
        {path: '/admin/users', label: 'Users'},
        {path: '/admin/contacts', label: 'Contacts'},
        {path: '/admin/payments', label: 'Payments'},
        {path: '/admin/refunds', label: 'Refunds'},
        {path: '/admin/returns', label: 'Returns'},
        {path: '/admin/shipments', label: 'Shipments'},
        {path: '/admin/cod', label: 'COD Settlement'},
    ];

    return (
        <aside
            className={`
                fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1a472a] to-[#0d2415] z-50
                transition-transform duration-300 ease-in-out
                w-72 sm:w-80 lg:w-64 xl:w-72
                ${isOpen? 'translate-x-0':'-translate-x-full'}
                lg:translate-x-0
                flex flex-col
                shadow-2xl lg:shadow-none
                overflow-hidden
            `}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex-shrink-0">
                <div className="flex flex-col">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Ayurwell</h1>
                    <span className="text-xs sm:text-sm text-white/60 font-medium">Admin</span>
                </div>

                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close menu"
                >
                    <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2 sm:px-3">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.exact}
                                onClick={handleNavClick}
                                className={({isActive}) =>
                                    `flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${isActive
                                        ? 'bg-[#fffcef] text-[#1a472a] font-semibold shadow-md'
                                        :'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer with user info and actions */}
            <div className="border-t border-white/10 p-3 sm:p-4 space-y-3 flex-shrink-0">
                {/* User Info */}
                <div className="flex items-center gap-3 px-2 sm:px-3 py-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#fffcef] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#1a472a] font-bold text-sm sm:text-base">
                            {user?.firstName?.charAt(0)?.toUpperCase()||'A'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm sm:text-base truncate">
                            {user?.firstName||'Admin'}
                        </p>
                        <p className="text-white/60 text-xs sm:text-sm truncate">
                            {user?.role||'ADMIN'}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 px-2 sm:px-3">
                    <button
                        onClick={() =>
                        {
                            navigate('/');
                            handleNavClick();
                        }}
                        className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                        View Store
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-3 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminLeftNav;