import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams, Link} from 'react-router-dom';
import {fetchConcernById, editConcern, clearError, clearCurrentConcern} from '../../../store/slices/concern.slice';

const EditConcern=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {concernId}=useParams();
    const {currentConcern, loading, error}=useSelector(state => state.concern);

    const [formData, setFormData]=useState({
        name: '',
        slug: '',
        description: '',
        link: '',
        isActive: true
    });

    const [success, setSuccess]=useState(false);

    useEffect(() =>
    {
        dispatch(fetchConcernById(concernId));

        return () =>
        {
            dispatch(clearCurrentConcern());
        };
    }, [dispatch, concernId]);

    useEffect(() =>
    {
        if (currentConcern)
        {
            setFormData({
                name: currentConcern.name||'',
                slug: currentConcern.slug||'',
                description: currentConcern.description||'',
                link: currentConcern.link||'',
                isActive: currentConcern.isActive??true
            });
        }
    }, [currentConcern]);

    const handleChange=(e) =>
    {
        const {name, value, type, checked}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type==='checkbox'? checked:value
        }));
    };

    const handleSubmit=async (e) =>
    {
        e.preventDefault();

        const concernData={
            name: formData.name,
            slug: formData.slug,
            description: formData.description||null,
            link: formData.link||null,
            isActive: formData.isActive
        };

        const result=await dispatch(editConcern({id: concernId, concernData}));

        if (!result.error)
        {
            setSuccess(true);
            setTimeout(() =>
            {
                navigate('/admin/concerns');
            }, 1500);
        }
    };

    if (loading&&!currentConcern)
    {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#1a472a] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#1a472a]">Loading concern...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to="/admin/concerns"
                    className="p-2 hover:bg-[#e6e4d9] rounded-lg transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <h2 className="text-2xl font-bold text-[#1a472a]">Edit Concern</h2>
            </div>

            {success&&(
                <div className="bg-[#d4edda] border border-[#c3e6cb] rounded-lg p-4 mb-6 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#1a472a]">Concern updated successfully! Redirecting...</span>
                </div>
            )}

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

            <form onSubmit={handleSubmit} className="bg-white shadow p-6 space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1a472a] mb-1">
                        Concern Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Digestive Health"
                        className="w-full px-4 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a] transition"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-[#1a472a] mb-1">
                        Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        placeholder="e.g., digestive-health"
                        className="w-full px-4 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a] transition"
                    />
                    <p className="text-xs text-[#1a472a] mt-1">URL-friendly identifier</p>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#1a472a] mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe this health concern..."
                        className="w-full px-4 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a] transition resize-none"
                    />
                </div>



                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#1a472a] border-[#1a472a] focus:ring-[#1a472a]"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-[#1a472a]">
                        Active (visible on storefront)
                    </label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 px-4 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153d1f] disabled:bg-[#7a9a6d] transition flex items-center justify-center gap-2"
                    >
                        {loading? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ):(
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                    <Link
                        to={`/admin/concerns/${concernId}/images`}
                        className="px-6 py-2.5 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#153d1f] transition flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Manage Images
                    </Link>
                    <Link
                        to="/admin/concerns"
                        className="px-6 py-2.5 bg-[#fffcef] border border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#d1e7c2] transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditConcern;
