import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import
{
    fetchAllReturns,
    fetchReturnStatistics,
    updateReturnStatus,
    scheduleReturnPickup,
    clearError,
    clearSuccessMessage,
    setFilters
} from '../../../store/slices/return.slice';

const ReturnsList=() =>
{
    const dispatch=useDispatch();
    const {
        allReturns,
        returnStatistics,
        loading,
        updating,
        error,
        successMessage,
        pagination,
        filters
    }=useSelector(state => state.return);

    const [currentPage, setCurrentPage]=useState(1);
    const [showStatusModal, setShowStatusModal]=useState(false);
    const [showPickupModal, setShowPickupModal]=useState(false);
    const [selectedReturn, setSelectedReturn]=useState(null);
    const [statusForm, setStatusForm]=useState({status: '', notes: ''});
    const [pickupForm, setPickupForm]=useState({pickupDate: '', notes: ''});

    useEffect(() =>
    {
        // Only include 'status' if it is truthy
        const params={page: currentPage, limit: 20};
        if (filters.status)
        {
            params.status=filters.status;
        }
        dispatch(fetchAllReturns(params));
        dispatch(fetchReturnStatistics());
    }, [dispatch, currentPage, filters.status]);


    useEffect(() =>
    {
        if (successMessage)
        {
            const timer=setTimeout(() =>
            {
                dispatch(clearSuccessMessage());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, dispatch]);

    const handleFilterChange=(newFilters) =>
    {
        // Prevent unnecessary dispatch if filter value hasn't changed
        if (filters.status===newFilters.status) return;
        dispatch(setFilters(newFilters));
        setCurrentPage(1);
    };

    const handleStatusUpdate=async () =>
    {
        if (!selectedReturn||!statusForm.status) return;

        const result=await dispatch(updateReturnStatus({
            returnId: selectedReturn.id,
            status: statusForm.status,
            notes: statusForm.notes
        }));

        if (!result.error)
        {
            setShowStatusModal(false);
            setSelectedReturn(null);
            setStatusForm({status: '', notes: ''});
        }
    };

    const handlePickupSchedule=async () =>
    {
        if (!selectedReturn||!pickupForm.pickupDate) return;

        const result=await dispatch(scheduleReturnPickup({
            returnId: selectedReturn.id,
            pickupDate: pickupForm.pickupDate,
            pickupAddress: selectedReturn.order.address,
            notes: pickupForm.notes
        }));

        if (!result.error)
        {
            setShowPickupModal(false);
            setSelectedReturn(null);
            setPickupForm({pickupDate: '', notes: ''});
        }
    };

    const openStatusModal=(returnRequest) =>
    {
        setSelectedReturn(returnRequest);
        setStatusForm({
            status: returnRequest.status,
            notes: ''
        });
        setShowStatusModal(true);
    };

    const openPickupModal=(returnRequest) =>
    {
        setSelectedReturn(returnRequest);
        setPickupForm({
            pickupDate: '',
            notes: ''
        });
        setShowPickupModal(true);
    };

    const getStatusBadgeClass=(status) =>
    {
        const statusClasses={
            'REQUESTED': 'bg-yellow-100 text-yellow-700',
            'APPROVED': 'bg-blue-100 text-blue-700',
            'PICKUP_SCHEDULED': 'bg-purple-100 text-purple-700',
            'PICKED_UP': 'bg-indigo-100 text-indigo-700',
            'RECEIVED': 'bg-orange-100 text-orange-700',
            'COMPLETED': 'bg-green-100 text-green-700',
            'REJECTED': 'bg-red-100 text-red-700',
            'CANCELLED': 'bg-gray-100 text-gray-700'
        };
        return statusClasses[status]||'bg-gray-100 text-gray-700';
    };

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

    const getStatusOptions=(currentStatus) =>
    {
        const options={
            'REQUESTED': ['APPROVED', 'REJECTED', 'CANCELLED'],
            'APPROVED': ['PICKUP_SCHEDULED', 'CANCELLED'],
            'PICKUP_SCHEDULED': ['PICKED_UP', 'CANCELLED'],
            'PICKED_UP': ['RECEIVED', 'CANCELLED'],
            'RECEIVED': ['COMPLETED', 'REJECTED'],
            'REJECTED': [],
            'COMPLETED': [],
            'CANCELLED': []
        };
        // Only show options that are different from the current status
        return (options[currentStatus]||[]).filter(opt => opt!==currentStatus);
    };

    return (
        <div className="p-6 bg-[#fffcef]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Returns Management</h2>
            </div>

            {/* Statistics Cards */}
            {returnStatistics&&(
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-[#1a472a]/70 mb-1">Total Returns</h3>
                        <p className="text-2xl font-bold text-[#1a472a]">{returnStatistics.totalReturns}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-[#1a472a]/70 mb-1">Pending</h3>
                        <p className="text-2xl font-bold text-yellow-600">{returnStatistics.pendingReturns}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-[#1a472a]/70 mb-1">Approved</h3>
                        <p className="text-2xl font-bold text-blue-600">{returnStatistics.approvedReturns}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-sm font-medium text-[#1a472a]/70 mb-1">Completed</h3>
                        <p className="text-2xl font-bold text-green-600">{returnStatistics.completedReturns}</p>
                    </div>
                </div>
            )}

            {successMessage&&(
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span className="text-green-700">{successMessage}</span>
                    <button
                        onClick={() => dispatch(clearSuccessMessage())}
                        className="text-green-500 hover:text-green-700 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => dispatch(clearError())}
                        className="text-red-500 hover:text-red-700 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white shadow p-4 rounded-lg mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-[#1a472a]">Status:</label>
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                            value={filters.status||''}
                            onChange={(e) => handleFilterChange({status: e.target.value||null})}
                        >
                            <option value="">All</option>
                            <option value="REQUESTED">Requested</option>
                            <option value="APPROVED">Approved</option>
                            <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
                            <option value="PICKED_UP">Picked Up</option>
                            <option value="RECEIVED">Received</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Returns Table */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
                <table className="w-full">
                    <thead className="bg-[#1a472a]/10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Return ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Order ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Customer</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a472a]/20">
                        {loading? (
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-[#1a472a]">
                                    Loading returns...
                                </td>
                            </tr>
                        ):allReturns&&allReturns.length>0? (
                            allReturns.map(returnRequest => (
                                <tr key={returnRequest.id} className="hover:bg-[#1a472a]/5">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-[#1a472a]">
                                            #{returnRequest.id.slice(-8)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`/admin/orders/${returnRequest.order.id}`} className="text-[#1a472a] hover:underline">
                                            #{returnRequest.order.orderNumber||returnRequest.order.id?.slice(-8)}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-[#1a472a]">
                                                {returnRequest.order.user
                                                    ? `${returnRequest.order.user.firstName||''} ${returnRequest.order.user.lastName||''}`.trim()
                                                    :'N/A'}
                                            </span>
                                            <span className="text-xs text-[#1a472a]/70">
                                                {returnRequest.order.user?.email||''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-[#1a472a]">
                                            {returnRequest.isPartial? 'Partial':'Full'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadgeClass(returnRequest.status)}`}>
                                            {returnRequest.status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-[#1a472a]">
                                        {formatDate(returnRequest.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => window.location.href=`/admin/returns/${returnRequest.id}`}
                                                className="px-3 py-1 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#14532d]"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => openStatusModal(returnRequest)}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                                            >
                                                Update
                                            </button>
                                            {returnRequest.status==='APPROVED'&&(
                                                <button
                                                    onClick={() => openPickupModal(returnRequest)}
                                                    className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                                                >
                                                    Pickup
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-[#1a472a]">
                                    No returns found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination&&pagination.pages>1&&(
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev-1))}
                        disabled={currentPage===1}
                        className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded hover:bg-[#14532d] disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-[#1a472a]">
                        Page {currentPage} of {pagination.pages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev+1))}
                        disabled={currentPage===pagination.pages}
                        className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded hover:bg-[#14532d] disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Status Update Modal */}
            {showStatusModal&&selectedReturn&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                            Update Return Status
                        </h3>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">New Status:</label>
                            <select
                                value={statusForm.status}
                                onChange={(e) => setStatusForm(prev => ({...prev, status: e.target.value}))}
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            >
                                <option value="">Select Status</option>
                                {getStatusOptions(selectedReturn.status).map(status => (
                                    <option key={status} value={status}>
                                        {status.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">Notes (Optional):</label>
                            <textarea
                                value={statusForm.notes}
                                onChange={(e) => setStatusForm(prev => ({...prev, notes: e.target.value}))}
                                rows="3"
                                placeholder="Add any notes about this status update..."
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleStatusUpdate}
                                disabled={updating||!statusForm.status}
                                className="flex-1 px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50"
                            >
                                {updating? 'Updating...':'Update Status'}
                            </button>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-[#1a472a] rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pickup Schedule Modal */}
            {showPickupModal&&selectedReturn&&(
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                            Schedule Return Pickup
                        </h3>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">Pickup Date:</label>
                            <input
                                type="date"
                                value={pickupForm.pickupDate}
                                onChange={(e) => setPickupForm(prev => ({...prev, pickupDate: e.target.value}))}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-[#1a472a] text-sm block mb-2">Notes (Optional):</label>
                            <textarea
                                value={pickupForm.notes}
                                onChange={(e) => setPickupForm(prev => ({...prev, notes: e.target.value}))}
                                rows="3"
                                placeholder="Add pickup instructions..."
                                className="w-full px-3 py-2 border border-[#1a472a] rounded-lg"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handlePickupSchedule}
                                disabled={updating||!pickupForm.pickupDate}
                                className="flex-1 px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#14532d] disabled:opacity-50"
                            >
                                {updating? 'Scheduling...':'Schedule Pickup'}
                            </button>
                            <button
                                onClick={() => setShowPickupModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-[#1a472a] rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsList;