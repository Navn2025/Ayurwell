import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchDashboardStats, clearError as clearAdminError} from '../store/slices/admin.slice';
import {getCODOrders} from '../api/admin.api';

const Dashboard=() =>
{
    const dispatch=useDispatch();
    const {dashboardStats, loading, error}=useSelector(state => state.admin);
    const [codOrders, setCodOrders]=useState(null);
    const [codLoading, setCodLoading]=useState(false);
    const [selectedTab, setSelectedTab]=useState('overview');

    useEffect(() =>
    {
        dispatch(fetchDashboardStats());
        // Load COD orders separately without blocking
        loadCODOrders();
    }, [dispatch]);

    const loadCODOrders=async () =>
    {
        try
        {
            setCodLoading(true);
            const response=await getCODOrders({status: 'pending', limit: 5});
            // Response is already unwrapped by axios interceptor
            if (response&&typeof response==='object')
            {
                setCodOrders(Array.isArray(response.orders)? response.orders:[]);
            } else
            {
                setCodOrders([]);
            }
        } catch (err)
        {
            console.warn('Could not load COD orders (non-critical):', err.message||err);
            setCodOrders([]);
        } finally
        {
            setCodLoading(false);
        }
    };

    const formatCurrency=(amount) =>
    {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount||0);
    };

    const stats=dashboardStats||{};

    return (
        <div className="bg-[#fffcef] min-h-screen">
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-[#1a472a]">Admin Dashboard</h1>
                <p className="text-[#1a472a] mt-1">Welcome to Ayurwell Admin Panel</p>
                <p className="text-[#1a472a] text-xs mt-1">Last updated: {new Date().toLocaleString()}</p>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 flex justify-between items-center">
                    <span className="text-red-700 text-sm lg:text-base">{error}</span>
                    <button onClick={() => dispatch(clearAdminError())} className="text-red-700 hover:text-red-900 text-lg lg:text-xl ml-2">×</button>
                </div>
            )}

            {loading? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="relative w-12 h-12 lg:w-16 lg:h-16">
                        <svg className="animate-spin w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" opacity="0.2" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p className="text-[#1a472a] font-medium text-sm lg:text-base">Loading dashboard...</p>
                </div>
            ):(
                <>
                    {/* Tab Navigation */}
                    <div className="mb-4 lg:mb-6 flex flex-wrap gap-2">
                        <button onClick={() => setSelectedTab('overview')} className={`px-3 py-2 lg:px-4 rounded-lg font-medium transition text-sm lg:text-base ${selectedTab==='overview'? 'bg-[#1a472a] text-[#fffcef]':'bg-white text-[#1a472a] border border-[#d6e8d6]'}`}>
                            Overview
                        </button>
                        <button onClick={() => setSelectedTab('stats')} className={`px-3 py-2 lg:px-4 rounded-lg font-medium transition text-sm lg:text-base ${selectedTab==='stats'? 'bg-[#1a472a] text-[#fffcef]':'bg-white text-[#1a472a] border border-[#d6e8d6]'}`}>
                            Statistics
                        </button>
                        <button onClick={() => setSelectedTab('cod')} className={`px-3 py-2 lg:px-4 rounded-lg font-medium transition text-sm lg:text-base ${selectedTab==='cod'? 'bg-[#1a472a] text-[#fffcef]':'bg-white text-[#1a472a] border border-[#d6e8d6]'}`}>
                            COD Settlement
                        </button>
                    </div>

                    {selectedTab==='overview'&&(
                        <>
                            {/* KPI Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                                <div className="bg-white shadow p-4 lg:p-6 border-l-4 border-[#1a472a] hover:shadow-lg transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl lg:text-3xl font-bold text-[#1a472a]">{stats.totalOrders||0}</p>
                                            <p className="text-[#1a472a] text-sm">Total Orders</p>
                                        </div>
                                    </div>
                                    <a href="/admin/orders" className="text-[#1a472a] text-sm mt-3 lg:mt-4 inline-block hover:underline">View All →</a>
                                </div>

                                <div className="bg-white shadow p-4 lg:p-6 border-l-4 border-[#1a472a] hover:shadow-lg transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl lg:text-3xl font-bold text-[#1a472a]">{formatCurrency(stats.totalRevenue)}</p>
                                            <p className="text-[#1a472a] text-sm">Total Revenue</p>
                                        </div>
                                        <div className="text-3xl lg:text-4xl"></div>
                                    </div>
                                    <p className="text-[#1a472a] text-xs mt-3 lg:mt-4">From completed orders</p>
                                </div>

                                <div className="bg-white shadow p-4 lg:p-6 border-l-4 border-[#1a472a] hover:shadow-lg transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl lg:text-3xl font-bold text-[#1a472a]">{stats.totalUsers||0}</p>
                                            <p className="text-[#1a472a] text-sm">Total Users</p>
                                        </div>
                                    </div>
                                    <a href="/admin/users" className="text-[#1a472a] text-sm mt-3 lg:mt-4 inline-block hover:underline">View All →</a>
                                </div>

                                <div className="bg-white shadow p-4 lg:p-6 border-l-4 border-[#1a472a] hover:shadow-lg transition">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl lg:text-3xl font-bold text-[#1a472a]">{stats.totalProducts||0}</p>
                                            <p className="text-[#1a472a] text-sm">Total Products</p>
                                        </div>
                                    </div>
                                    <a href="/admin/products" className="text-[#1a472a] text-sm mt-3 lg:mt-4 inline-block hover:underline">View All →</a>
                                </div>
                            </div>

                            {/* Order Status & Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                                <div className="bg-white border-l-4 border-[#1a472a] hover:shadow-lg transition shadow p-4 lg:p-6">
                                    <h3 className="text-base lg:text-lg font-semibold text-[#1a472a] mb-3 lg:mb-4">Order Status Overview</h3>
                                    <div className="space-y-3 lg:space-y-4">
                                        <div className="flex items-center gap-2 lg:gap-4">
                                            <span className="w-24 lg:w-32 text-xs lg:text-sm text-[#1a472a] font-medium">Pending</span>
                                            <div className="flex-1 bg-[#d6e8d6] rounded-full h-2">
                                                <div className="bg-[#1a472a] h-2 rounded-full" style={{width: `${(stats.pendingOrders/stats.totalOrders*100)||0}%`}}></div>
                                            </div>
                                            <span className="text-xs lg:text-sm text-[#1a472a] font-medium w-8 lg:w-12 text-right">{stats.pendingOrders||0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-4">
                                            <span className="w-24 lg:w-32 text-xs lg:text-sm text-[#1a472a] font-medium">Paid</span>
                                            <div className="flex-1 bg-[#d6e8d6] rounded-full h-2">
                                                <div className="bg-[#1a472a] h-2 rounded-full" style={{width: `${(stats.paidOrders/stats.totalOrders*100)||0}%`}}></div>
                                            </div>
                                            <span className="text-xs lg:text-sm text-[#1a472a] font-medium w-8 lg:w-12 text-right">{stats.paidOrders||0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-4">
                                            <span className="w-24 lg:w-32 text-xs lg:text-sm text-[#1a472a] font-medium">Confirmed</span>
                                            <div className="flex-1 bg-[#d6e8d6] rounded-full h-2">
                                                <div className="bg-[#1a472a] h-2 rounded-full" style={{width: `${(stats.confirmedOrders/stats.totalOrders*100)||0}%`}}></div>
                                            </div>
                                            <span className="text-xs lg:text-sm text-[#1a472a] font-medium w-8 lg:w-12 text-right">{stats.confirmedOrders||0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-4">
                                            <span className="w-24 lg:w-32 text-xs lg:text-sm text-[#1a472a] font-medium">Shipped</span>
                                            <div className="flex-1 bg-[#d6e8d6] rounded-full h-2">
                                                <div className="bg-[#1a472a] h-2 rounded-full" style={{width: `${(stats.shippedOrders/stats.totalOrders*100)||0}%`}}></div>
                                            </div>
                                            <span className="text-xs lg:text-sm text-[#1a472a] font-medium w-8 lg:w-12 text-right">{stats.shippedOrders||0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-4">
                                            <span className="w-24 lg:w-32 text-xs lg:text-sm text-[#1a472a] font-medium">Delivered</span>
                                            <div className="flex-1 bg-[#d6e8d6] rounded-full h-2">
                                                <div className="bg-[#1a472a] h-2 rounded-full" style={{width: `${(stats.deliveredOrders/stats.totalOrders*100)||0}%`}}></div>
                                            </div>
                                            <span className="text-xs lg:text-sm text-[#1a472a] font-medium w-8 lg:w-12 text-right">{stats.deliveredOrders||0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-4">
                                            <span className="w-24 lg:w-32 text-xs lg:text-sm text-[#1a472a] font-medium">Cancelled</span>
                                            <div className="flex-1 bg-[#d6e8d6] rounded-full h-2">
                                                <div className="bg-[#1a472a] h-2 rounded-full" style={{width: `${(stats.cancelledOrders/stats.totalOrders*100)||0}%`}}></div>
                                            </div>
                                            <span className="text-xs lg:text-sm text-[#1a472a] font-medium w-8 lg:w-12 text-right">{stats.cancelledOrders||0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white shadow p-4 lg:p-6">
                                    <h3 className="text-base lg:text-lg font-semibold text-[#1a472a] mb-3 lg:mb-4">Quick Actions</h3>
                                    <div className="space-y-2 lg:space-y-3">
                                        <a href="/admin/products/add" className="flex items-center gap-3 p-2 lg:p-3 hover:bg-[#e6f4ea] transition border-l-4 border-[#1a472a]">
                                            <span className="text-[#1a472a] font-medium text-sm lg:text-base">Add New Product</span>
                                        </a>
                                        <a href="/admin/categories" className="flex items-center gap-3 p-2 lg:p-3 hover:bg-[#e6f4ea] transition border-l-4 border-[#1a472a]">
                                            <span className="text-[#1a472a] font-medium text-sm lg:text-base">Manage Categories</span>
                                        </a>
                                        <a href="/admin/orders?status=PENDING" className="flex items-center gap-3 p-2 lg:p-3 hover:bg-[#e6f4ea] transition border-l-4 border-[#1a472a]">
                                            <span className="text-[#1a472a] font-medium text-sm lg:text-base">Pending Orders ({stats.pendingOrders||0})</span>
                                        </a>
                                        <a href="/admin/cod" className="flex items-center gap-3 p-2 lg:p-3 hover:bg-[#e6f4ea] transition border-l-4 border-[#1a472a]">
                                            <span className="text-[#1a472a] font-medium text-sm lg:text-base">COD Settlement</span>
                                        </a>
                                        <a href="/admin/shipments" className="flex items-center gap-3 p-2 lg:p-3 hover:bg-[#e6f4ea] transition border-l-4 border-[#1a472a]">
                                            <span className="text-[#1a472a] font-medium text-sm lg:text-base">Manage Shipments</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders & Low Stock Products */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                                {/* Recent Orders */}
                                <div className="bg-white shadow p-4 lg:p-6 border-l-4 border-[#1a472a] hover:shadow-lg transition">
                                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                                        <h3 className="text-base lg:text-lg font-semibold text-[#1a472a]">Recent Orders</h3>
                                        <a href="/admin/orders" className="text-[#1a472a] text-xs hover:underline font-medium">View All →</a>
                                    </div>
                                    <div className="space-y-2 lg:space-y-3">
                                        {stats.recentOrders?.length>0? (
                                            stats.recentOrders.map((order) => (
                                                <a key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between p-2 lg:p-3 rounded-lg hover:bg-[#e6f4ea] transition border">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-[#1a472a] text-sm lg:text-base truncate">{order.orderNumber}</p>
                                                        <p className="text-xs text-[#1a472a] truncate">{order.user?.firstName} {order.user?.lastName}</p>
                                                    </div>
                                                    <span className="font-bold text-[#1a472a] text-sm lg:text-base ml-2">{formatCurrency(order.totalAmount)}</span>
                                                </a>
                                            ))
                                        ):(
                                            <p className="text-[#1a472a] text-sm text-center py-3 lg:py-4">No recent orders</p>
                                        )}
                                    </div>
                                </div>

                                {/* Low Stock Products */}
                                <div className="bg-white shadow p-4 lg:p-6 rounded-lg">
                                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                                        <h3 className="text-base lg:text-lg font-semibold text-[#1a472a]">Low Stock Products</h3>
                                        <a href="/admin/products" className="text-[#1a472a] text-xs hover:underline font-medium">View All →</a>
                                    </div>
                                    <div className="space-y-2 lg:space-y-3">
                                        {stats.lowStockProducts?.length>0? (
                                            stats.lowStockProducts.map((product) => (
                                                <a key={product.id} href={`/admin/products/edit/${product.id}`} className="flex items-center justify-between p-2 lg:p-3 rounded-lg hover:bg-red-50 transition border-b border-red-100">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-medium text-[#1a472a] text-sm lg:text-base truncate">{product.name}</p>
                                                        <p className="text-xs text-[#1a472a]">Stock: {product.stockQuantity}</p>
                                                    </div>
                                                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ml-2 whitespace-nowrap ${product.stockQuantity<=5? 'bg-red-200 text-red-700':'bg-yellow-200 text-yellow-700'}`}>
                                                        {product.stockQuantity} left
                                                    </span>
                                                </a>
                                            ))
                                        ):(
                                            <p className="text-[#1a472a] text-sm text-center py-3 lg:py-4">All products have sufficient stock</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {selectedTab==='stats'&&(
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            <div className="bg-white shadow p-4 lg:p-6 rounded-lg">
                                <h3 className="text-sm font-semibold text-[#1a472a] mb-2">Order Success Rate</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-green-600">{stats.totalOrders>0? Math.round((stats.deliveredOrders/stats.totalOrders)*100):0}%</p>
                                <p className="text-xs text-[#1a472a] mt-2">{stats.deliveredOrders} of {stats.totalOrders} orders delivered</p>
                            </div>
                            <div className="bg-white shadow p-4 lg:p-6 rounded-lg">
                                <h3 className="text-sm font-semibold text-[#1a472a] mb-2">Average Order Value</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-blue-600">{formatCurrency(stats.totalOrders>0? stats.totalRevenue/stats.totalOrders:0)}</p>
                                <p className="text-xs text-[#1a472a] mt-2">Average per order</p>
                            </div>
                            <div className="bg-white shadow p-4 lg:p-6 rounded-lg">
                                <h3 className="text-sm font-semibold text-[#1a472a] mb-2">Cancellation Rate</h3>
                                <p className="text-2xl lg:text-3xl font-bold text-red-600">{stats.totalOrders>0? Math.round((stats.cancelledOrders/stats.totalOrders)*100):0}%</p>
                                <p className="text-xs text-[#1a472a] mt-2">{stats.cancelledOrders} orders cancelled</p>
                            </div>
                        </div>
                    )}

                    {selectedTab==='cod'&&(
                        <div className="bg-white shadow p-4 lg:p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                                <h3 className="text-base lg:text-lg font-semibold text-[#1a472a]">Pending COD Orders</h3>
                                <a href="/admin/cod" className="text-[#1a472a] text-sm hover:underline font-medium">Manage All →</a>
                            </div>
                            {codLoading? (
                                <div className="flex flex-col items-center justify-center h-40 gap-3">
                                    <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                                        <svg className="animate-spin w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" opacity="0.2" />
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <p className="text-[#1a472a] text-sm font-medium">Loading COD orders...</p>
                                </div>
                            ):codOrders?.length>0? (
                                <div className="overflow-x-auto">
                                    <div className="min-w-[600px] lg:min-w-0">
                                        <table className="w-full text-xs lg:text-sm">
                                            <thead>
                                                <tr className="border-b bg-[#f0f5f3]">
                                                    <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-[#1a472a]">Order ID</th>
                                                    <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-[#1a472a]">Customer</th>
                                                    <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-[#1a472a]">Amount</th>
                                                    <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-[#1a472a]">Status</th>
                                                    <th className="text-left py-2 lg:py-3 px-2 lg:px-4 font-medium text-[#1a472a]">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {codOrders.map((order) =>
                                                {
                                                    // Calculate total with COD fee
                                                    const codFee=order.shipment?.codFee||0;
                                                    const totalWithCodFee=order.totalAmount+codFee;
                                                    return (
                                                        <tr key={order.id} className="border-b hover:bg-[#fffcef] transition">
                                                            <td className="py-2 lg:py-3 px-2 lg:px-4 font-medium text-[#1a472a]">
                                                                <span className="text-xs lg:text-sm">{order.orderNumber}</span>
                                                            </td>
                                                            <td className="py-2 lg:py-3 px-2 lg:px-4 text-[#1a472a]">
                                                                <span className="text-xs lg:text-sm">{order.user?.firstName} {order.user?.lastName}</span>
                                                            </td>
                                                            <td className="py-2 lg:py-3 px-2 lg:px-4 font-bold text-[#1a472a]">
                                                                <div className="text-xs lg:text-sm">
                                                                    <div>{formatCurrency(order.totalAmount)}</div>
                                                                    {codFee>0&&(
                                                                        <div className="text-xs text-[#1a472a]">
                                                                            + {formatCurrency(codFee)} (COD fee)
                                                                        </div>
                                                                    )}
                                                                    {codFee>0&&(
                                                                        <div className="text-xs font-bold text-green-600">
                                                                            = {formatCurrency(totalWithCodFee)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 lg:py-3 px-2 lg:px-4">
                                                                <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${order.codCollected? 'bg-green-200 text-green-700':'bg-yellow-200 text-yellow-700'}`}>
                                                                    {order.codCollected? 'Collected':order.status=='CANCELLED'? 'Cancelled':'Pending'}
                                                                </span>
                                                            </td>
                                                            <td className="py-2 lg:py-3 px-2 lg:px-4">
                                                                <a href={`/admin/cod`} className="text-blue-600 hover:underline text-xs font-medium">View →</a>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ):(
                                <p className="text-[#1a472a] text-center py-3 lg:py-4">No pending COD orders</p>
                            )}
                        </div>
                    )}
                </>
            )}

            <style>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
