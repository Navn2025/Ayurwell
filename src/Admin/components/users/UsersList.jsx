import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllUsers, clearError as clearAdminError} from '../../../store/slices/admin.slice';

const UsersList=() =>
{
    const dispatch=useDispatch();
    const {users, loading, error}=useSelector(state => state.admin);

    const [roleFilter, setRoleFilter]=useState('all');
    const [searchQuery, setSearchQuery]=useState('');

    useEffect(() =>
    {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const filteredUsers=users?.filter(user =>
    {
        const roleMatch=roleFilter==='all'||user.role===roleFilter;
        const fullName=`${user.firstName||''} ${user.lastName||''}`.toLowerCase();
        const searchMatch=!searchQuery||
            fullName.includes(searchQuery.toLowerCase())||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())||
            user.phoneNumber?.includes(searchQuery);
        return roleMatch&&searchMatch;
    });

    const formatDate=(dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getRoleBadgeClass=(role) =>
    {
        const classes={
            'ADMIN': 'px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700',
            'USER': 'px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700',
            'SUPER_ADMIN': 'px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700'
        };
        return classes[role]||'px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700';
    };

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading users...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Users Management</h2>
                <div className="flex gap-4">
                    <span className="text-[#1a472a]">Total: {users?.length||0}</span>
                    <span className="text-[#1a472a]">Admins: {users?.filter(u => u.role==='ADMIN').length||0}</span>
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => dispatch(clearAdminError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6 bg-white shadow p-4">
                <div className="flex items-center gap-2">
                    <label className="text-[#1a472a]">Search:</label>
                    <input
                        type="text"
                        placeholder="Name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-3 py-2 border border-[#1a472a] rounded-lg focus:ring-2 focus:ring-[#1a472a] w-64"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-[#1a472a]">Role:</label>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border border-[#1a472a] rounded-lg">
                        <option value="all">All</option>
                        <option value="USER">Users</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            <div className="bg-white  shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Role</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Provider</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Joined</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Orders</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a472a]/10">
                        {filteredUsers&&filteredUsers.length>0? (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-[#1a472a]/5">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {user.avatar? (
                                                    <img src={user.avatar} alt="user" className="w-full h-full object-cover" />
                                                ):(
                                                    <span className="text-[#1a472a] font-medium">{user.firstName?.charAt(0)?.toUpperCase()||user.email?.charAt(0)?.toUpperCase()||'U'}</span>
                                                )}
                                            </div>
                                            <span className="font-medium text-[#1a472a]">
                                                {user.firstName||user.lastName
                                                    ? `${user.firstName||''} ${user.lastName||''}`.trim()
                                                    :'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[#1a472a]">{user.email}</td>
                                    <td className="px-4 py-3 text-[#1a472a]">{user.phoneNumber||'-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={getRoleBadgeClass(user.role)}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-[#1a472a] capitalize">
                                            {user.googleId? 'GOOGLE':'LOCAL'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[#1a472a]">{user.createdAt? formatDate(user.createdAt):'N/A'}</td>
                                    <td className="px-4 py-3 text-[#1a472a]">{user._count?.orders||0}</td>
                                    <td className="px-4 py-3">
                                        <a href={`/admin/users/${user.id}`} className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]">
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="8" className="py-8 text-center text-[#1a472a]">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;
