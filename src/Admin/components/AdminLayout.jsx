import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import AdminLeftNav from './AdminLeftNav';

const AdminLayout=() =>
{
    const [sidebarOpen, setSidebarOpen]=useState(false);

    return (
        <div className="flex min-h-screen bg-[#fffcef] font-exo">
            {/* Mobile sidebar overlay */}
            {sidebarOpen&&(
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - always rendered */}
            <AdminLeftNav
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <main className="flex-1 min-h-screen w-full lg:ml-64 xl:ml-72">
                {/* Mobile header with menu button */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <h1 className="text-lg font-semibold text-[#1a472a]">Ayurwell Admin</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        aria-label="Open menu"
                    >
                        <svg className="w-6 h-6 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 lg:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;