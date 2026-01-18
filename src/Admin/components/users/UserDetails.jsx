import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import {fetchUserById, clearError as clearAdminError} from '../../../store/slices/admin.slice';

const UserDetails=() =>
{
    const {userId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentUser, loading, error}=useSelector(state => state.admin);


    const [success, setSuccess]=useState('');

    useEffect(() =>
    {
        if (userId)
        {
            dispatch(fetchUserById(userId));
        }
    }, [dispatch, userId]);





    const formatDate=(dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency=(amount) =>
    {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getRoleBadgeClasses=(role) =>
    {
        const baseClasses='px-3 py-1 rounded-full text-sm font-medium';
        switch (role?.toUpperCase())
        {
            case 'ADMIN':
                return `${baseClasses} bg-purple-100 text-purple-700`;
            case 'USER':
                return `${baseClasses} bg-blue-100 text-blue-700`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-700`;
        }
    };

    const getStatusBadgeClasses=(status) =>
    {
        const baseClasses='px-2 py-1 rounded-full text-xs font-medium';
        switch (status?.toUpperCase())
        {
            case 'DELIVERED':
                return `${baseClasses} bg-green-100 text-green-700`;
            case 'PENDING':
                return `${baseClasses} bg-yellow-100 text-yellow-700`;
            case 'PROCESSING':
                return `${baseClasses} bg-blue-100 text-blue-700`;
            case 'SHIPPED':
                return `${baseClasses} bg-indigo-100 text-indigo-700`;
            case 'CANCELLED':
                return `${baseClasses} bg-red-100 text-red-700`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-700`;
        }
    };

    const getPaymentBadgeClasses=(status) =>
    {
        const baseClasses='px-2 py-1 rounded-full text-xs font-medium';
        switch (status?.toUpperCase())
        {
            case 'PAID':
                return `${baseClasses} bg-green-100 text-green-700`;
            case 'PENDING':
                return `${baseClasses} bg-yellow-100 text-yellow-700`;
            case 'FAILED':
                return `${baseClasses} bg-red-100 text-red-700`;
            case 'REFUNDED':
                return `${baseClasses} bg-purple-100 text-purple-700`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-700`;
        }
    };

    if (loading&&!currentUser)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading user details...</div>;
    }

    if (!currentUser)
    {
        return <div className="flex items-center justify-center h-64 text-red-500">User not found</div>;
    }

    const user=currentUser;
    const totalSpent=user.orders?.reduce((sum, order) =>
        (order.payment?.status==='CAPTURED'||order.payment?.status==='SUCCESS')? sum+order.totalAmount:sum, 0)||0;

    return (
        <div className="p-6 ">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/users')} className="text-[#1a472a] hover:text-[#14532d]">
                    ← Back to Users
                </button>
                <h2 className="text-2xl font-bold text-[#1a472a]">User Details</h2>
            </div>

            {success&&(
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span className="text-green-700">{success}</span>
                    <button onClick={() => setSuccess('')} className="text-[#1a472a] hover:text-[#14532d] text-xl">×</button>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => dispatch(clearAdminError())} className="text-red-700 hover:text-red-900 text-xl">×</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* User Profile */}
                <div className="bg-white shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">User Profile</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-[#1a472a]/20 flex items-center justify-center text-2xl overflow-hidden">
                            {user.avatar? (
                                <img src={user.avatar} alt="user" className="w-full h-full object-cover" />
                            ):(
                                <span className="text-[#1a472a]">{user.firstName?.charAt(0)?.toUpperCase()||user.email?.charAt(0)?.toUpperCase()||'U'}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[#1a472a]">
                                {user.firstName||user.lastName
                                    ? `${user.firstName||''} ${user.lastName||''}`.trim()
                                    :'N/A'}
                            </h3>
                            <span className={getRoleBadgeClasses(user.role)}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Email:</span>
                        <span className="text-[#1a472a]">{user.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Phone:</span>
                        <span className="text-[#1a472a]">{user.phoneNumber||'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Provider:</span>
                        <span className="text-[#1a472a]">{user.googleId? 'GOOGLE':'LOCAL'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Joined:</span>
                        <span className="text-[#1a472a]">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Last Updated:</span>
                        <span className="text-[#1a472a]">{formatDate(user.updatedAt)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Email Verified:</span>
                        <span className={user.isEmailVerified? 'text-green-600':'text-red-600'}>
                            {user.isEmailVerified? 'Yes':'No'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Profile Complete:</span>
                        <span className={user.isProfileComplete? 'text-green-600':'text-yellow-600'}>
                            {user.isProfileComplete? 'Yes':'No'}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#1a472a]/10">
                        <span className="text-[#1a472a]">Account Status:</span>
                        <span className={user.isActive? 'text-green-600':'text-red-600'}>
                            {user.isActive? 'Active':'Inactive'}
                        </span>
                    </div>
                </div>

                {/* User Stats */}
                <div className="bg-white shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-[#1a472a]/10 ">
                            <span className="text-2xl font-bold text-[#1a472a] block">{user._count?.orders||user.orders?.length||0}</span>
                            <span className="text-sm text-[#1a472a]">Total Orders</span>
                        </div>
                        <div className="text-center p-4 bg-[#1a472a]/10 ">
                            <span className="text-2xl font-bold text-[#1a472a] block">{formatCurrency(totalSpent)}</span>
                            <span className="text-sm text-[#1a472a]">Total Spent</span>
                        </div>
                        <div className="text-center p-4 bg-[#1a472a]/10 ">
                            <span className="text-2xl font-bold text-[#1a472a] block">{user.addresses?.length||0}</span>
                            <span className="text-sm text-[#1a472a]">Saved Addresses</span>
                        </div>
                        <div className="text-center p-4 bg-[#1a472a]/10 ">
                            <span className="text-2xl font-bold text-[#1a472a] block">{user.cart?.items?.length||0}</span>
                            <span className="text-sm text-[#1a472a]">Cart Items</span>
                        </div>
                        <div className="text-center p-4 bg-[#1a472a]/10 ">
                            <span className="text-2xl font-bold text-[#1a472a] block">{user._count?.reviews||user.reviews?.length||0}</span>
                            <span className="text-sm text-[#1a472a]">Reviews</span>
                        </div>
                    </div>
                </div>

                {/* Addresses */}
                {user.addresses&&user.addresses.length>0&&(
                    <div className="bg-white shadow p-6 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Saved Addresses ({user.addresses.length})</h3>
                        <div className="space-y-4">
                            {user.addresses.map(address => (
                                <div key={address.id} className="p-4 bg-[#1a472a]/10  relative">
                                    {address.isDefault&&(
                                        <span className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-[#1a472a] text-xs rounded">Default</span>
                                    )}
                                    <p className="font-semibold text-[#1a472a]">{address.fullName}</p>
                                    <p className="text-[#1a472a]">{address.addressLine1}</p>
                                    {address.addressLine2&&<p className="text-[#1a472a]">{address.addressLine2}</p>}
                                    <p className="text-[#1a472a]">{address.city}, {address.state} - {address.postalCode}</p>
                                    <p className="text-[#1a472a]">Phone: {address.phoneNumber}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Recent Orders */}
            {user.orders&&user.orders.length>0&&(
                <div className="bg-white shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4 border-b pb-2">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className='bg-[#1a472a]/10'>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a472a]">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a472a]">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a472a]">Items</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a472a]">Total</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a472a]">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a472a]">Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.orders.slice(0, 10).map(order => (
                                    <tr key={order.id} className="border-b border-[#1a472a]/10 hover:bg-[#1a472a]/10">
                                        <td className="py-3 px-4">
                                            <a href={`/admin/orders/${order.id}`} className="text-[#1a472a] hover:text-[#14532d] font-medium">
                                                #{order.id.slice(-8)}
                                            </a>
                                        </td>
                                        <td className="py-3 px-4 text-[#1a472a]">{formatDate(order.createdAt)}</td>
                                        <td className="py-3 px-4 text-[#1a472a]">{order.orderItems?.length||0}</td>
                                        <td className="py-3 px-4 text-[#1a472a] font-medium">{formatCurrency(order.totalAmount)}</td>
                                        <td className="py-3 px-4">
                                            <span className={getStatusBadgeClasses(order.status)}>
                                                {order.status}
                                            </span>
                                        </td>
                                        {console.log(order)}
                                        <td className="py-3 px-4">
                                            <span className={getPaymentBadgeClasses(order.payment?.status)}>
                                                {order.payment?.status||order.paymentMethod}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


        </div>
    );
};

export default UserDetails;
