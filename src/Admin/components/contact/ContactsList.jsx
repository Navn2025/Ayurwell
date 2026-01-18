import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import {fetchAllContacts, clearError} from '../../../store/slices/contact.slice';

const ContactsList=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {contacts=[], pagination, loading, error}=useSelector(state => state.contact||{});
    const [searchQuery, setSearchQuery]=useState('');
    const [statusFilter, setStatusFilter]=useState('');
    const [currentPage, setCurrentPage]=useState(1);

    useEffect(() =>
    {
        dispatch(fetchAllContacts({
            status: statusFilter,
            search: searchQuery,
            page: currentPage,
            limit: 10
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, searchQuery, currentPage]);

    const handleViewContact=(contactId) =>
    {
        navigate(`/admin/contacts/${contactId}`);
    };

    const getStatusBadgeClass=(status) =>
    {
        const baseClass="px-3 py-1 rounded-full text-xs font-bold";
        switch (status)
        {
            case "NEW":
                return `${baseClass} bg-blue-100 text-blue-700`;
            case "IN_PROGRESS":
                return `${baseClass} bg-yellow-100 text-yellow-700`;
            case "RESOLVED":
                return `${baseClass} bg-green-100 text-green-700`;
            case "CLOSED":
                return `${baseClass} bg-gray-100 text-gray-700`;
            default:
                return baseClass;
        }
    };

    const formatDate=(dateString) =>
    {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin" className="text-[#1a472a] hover:text-[#14532d]">
                    ← Back to Dashboard
                </Link>
                <h2 className="text-2xl font-bold text-[#1a472a]">Contact Messages</h2>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => dispatch(clearError())} className="text-red-500 hover:text-red-700">×</button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-[#1a472a] font-medium mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Name, email, subject..."
                            value={searchQuery}
                            onChange={(e) =>
                            {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-[#d6e8d6] rounded-lg focus:ring-2 focus:ring-[#1a472a]"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <label className="block text-[#1a472a] font-medium mb-2">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                            {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 border border-[#d6e8d6] rounded-lg focus:ring-2 focus:ring-[#1a472a]"
                        >
                            <option value="">All Status</option>
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Contacts Table */}
            <div className="bg-white shadow overflow-hidden ">
                {loading? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="relative w-12 h-12 mx-auto mb-4">
                                <svg className="w-full h-full animate-spin" viewBox="0 0 24 24" fill="none" stroke="#1a472a" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" opacity="0.2" />
                                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                </svg>
                            </div>
                            <p className="text-[#4a7c59]">Loading contacts...</p>
                        </div>
                    </div>
                ):contacts.length>0? (
                    <>
                        <table className="w-full">
                            <thead className="bg-[#1a472a]/10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-[#1a472a]">From</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-[#1a472a]">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-[#1a472a]">Subject</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-[#1a472a]">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-[#1a472a]">Date</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-[#1a472a]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a472a]/10">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-[#1a472a]/5 transition">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-[#1a472a]">
                                                    {contact.firstName} {contact.lastName}
                                                </p>
                                                <p className="text-xs text-[#4a7c59]">
                                                    {contact.phone}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-[#4a7c59] text-sm">{contact.email}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-[#1a472a] font-medium truncate max-w-xs">{contact.subject}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadgeClass(contact.status)}>
                                                {contact.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[#4a7c59] text-sm">{formatDate(contact.createdAt)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewContact(contact.id)}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {pagination&&pagination.pages>1&&(
                            <div className="px-6 py-4 border-t border-[#d6e8d6] flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage-1))}
                                    disabled={currentPage===1}
                                    className="px-3 py-1 border border-[#d6e8d6] rounded disabled:opacity-50"
                                >
                                    ← Prev
                                </button>
                                <span className="text-[#4a7c59] text-sm">
                                    Page {currentPage} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage+1))}
                                    disabled={currentPage===pagination.pages}
                                    className="px-3 py-1 border border-[#d6e8d6] rounded disabled:opacity-50"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </>
                ):(
                    <div className="p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-[#1a472a]/20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <p className="text-[#4a7c59]">No contacts found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactsList;
