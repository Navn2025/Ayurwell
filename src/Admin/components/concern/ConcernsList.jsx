import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchAllConcerns, removeConcern, clearError} from '../../../store/slices/concern.slice';

const ConcernsList=() =>
{
    const dispatch=useDispatch();
    const {concerns, loading, error}=useSelector(state => state.concern);

    useEffect(() =>
    {
        dispatch(fetchAllConcerns());
    }, [dispatch]);

    const handleDelete=async (concernId, concernName) =>
    {
        if (window.confirm(`Are you sure you want to delete "${concernName}"? This will also delete the associated image.`))
        {
            await dispatch(removeConcern(concernId));
        }
    };

    if (loading)
    {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#1a472a] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#1a472a]">Loading concerns...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Concerns Management</h2>
                <Link
                    to="/admin/concerns/add"
                    className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153d1f] transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Concern
                </Link>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => dispatch(clearError())}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {concerns&&concerns.length>0? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {concerns.map(concern => (
                        <div
                            key={concern.id}
                            className="bg-white  shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            {/* Image */}
                            <div className="h-40 bg-gray-100 relative">
                                {concern.imageUrl? (
                                    <img
                                        src={concern.imageUrl}
                                        alt={concern.name}
                                        className="w-full h-full object-cover"
                                    />
                                ):(
                                    <div className="w-full h-full flex items-center justify-center text-[#1a472a]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Status Badge */}
                                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${concern.isActive? 'bg-[#1a472a] text-[#fffcef]':'bg-[#153d1f] text-[#fffcef]'}`}>
                                    {concern.isActive? 'Active':'Inactive'}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-[#1a472a] text-lg mb-1">{concern.name}</h3>
                                <p className="text-sm text-[#1a472a] mb-2">{concern.slug}</p>
                                {concern.description&&(
                                    <p className="text-sm text-[#1a472a] line-clamp-2 mb-3">{concern.description}</p>
                                )}
                                <div className="flex items-center gap-2 text-xs text-[#1a472a] mb-4">
                                    <span className={`px-2 py-1 rounded ${concern.imageUrl? 'bg-[#d4edda] text-[#1a472a]':'bg-[#fffcef] text-[#1a472a]'}`}>
                                        {concern.imageUrl? 'Has Image':'No Image'}
                                    </span>
                                    <span className="bg-[#fffcef] border border-[#1a472a] px-2 py-1 rounded">
                                        {concern._count?.products||concern.products?.length||0} Products
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/concerns/edit/${concern.id}`}
                                        className="flex-1 text-center px-3 py-2 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#153d1f] transition"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        to={`/admin/concerns/${concern.id}/images`}
                                        className="flex-1 text-center px-3 py-2 bg-[#1a472a] text-[#fffcef] text-sm rounded hover:bg-[#153d1f] transition"
                                    >
                                        Image
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(concern.id, concern.name)}
                                        className="px-3 py-2 bg-red-500 text-[#fffcef] text-sm rounded hover:bg-red-600 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ):(
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#1a472a] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="text-lg font-medium text-[#1a472a] mb-2">No concerns found</h3>
                    <p className="text-[#1a472a] mb-4">Get started by creating your first health concern.</p>
                    <Link
                        to="/admin/concerns/add"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153d1f] transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Your First Concern
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ConcernsList;
