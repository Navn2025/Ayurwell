import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate} from 'react-router-dom';
import
{
    fetchCategoryById,
    editCategory,
    fetchAllCategories,
    clearError as clearCategoryError
} from '../../../store/slices/category.slice';

const EditCategory=() =>
{
    const {categoryId}=useParams();
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentCategory, categories, loading, error}=useSelector(state => state.category);

    const [formData, setFormData]=useState({
        name: '',
        slug: '',
        description: '',
        parentId: ''
    });

    const [success, setSuccess]=useState(false);

    useEffect(() =>
    {
        dispatch(fetchAllCategories());
        if (categoryId)
        {
            dispatch(fetchCategoryById(categoryId));
        }
    }, [dispatch, categoryId]);

    useEffect(() =>
    {
        if (currentCategory)
        {
            setFormData({
                name: currentCategory.name||'',
                slug: currentCategory.slug||'',
                description: currentCategory.description||'',
                parentId: currentCategory.parentId||''
            });
        }
    }, [currentCategory]);

    const handleChange=(e) =>
    {
        const {name, value}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit=async (e) =>
    {
        e.preventDefault();

        const categoryData={
            name: formData.name,
            slug: formData.slug,
            description: formData.description||null,
            parentId: formData.parentId||null
        };

        const result=await dispatch(editCategory({id: categoryId, categoryData}));

        if (!result.error)
        {
            setSuccess(true);
            setTimeout(() => navigate('/admin/categories'), 1500);
        }
    };

    // Flatten categories for parent dropdown (exclude current and its children)
    const flattenCategories=(cats, prefix='', excludeId=null) =>
    {
        let result=[];
        cats?.forEach(cat =>
        {
            if (cat.id!==excludeId)
            {
                result.push({id: cat.id, name: prefix+cat.name});
                if (cat.children&&cat.children.length>0)
                {
                    result=[...result, ...flattenCategories(cat.children, prefix+'— ', excludeId)];
                }
            }
        });
        return result;
    };

    const flatCategories=flattenCategories(categories, '', categoryId);

    if (loading&&!currentCategory)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading category...</div>;
    }

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-[#1a472a] mb-6">Edit Category</h2>

            {success&&(
                <div className="bg-[#d4edda] border border-[#c3e6cb] rounded-lg p-4 mb-6">
                    Category updated successfully! Redirecting...
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    {error}
                    <button onClick={() => dispatch(clearCategoryError())}>×</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow p-6 space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1a472a] mb-1">Category Name *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-[#1a472a] mb-1">Slug *</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#1a472a] mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                </div>

                <div>
                    <label htmlFor="parentId" className="block text-sm font-medium text-[#1a472a] mb-1">Parent Category</label>
                    <select
                        id="parentId"
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    >
                        <option value="">None (Top Level)</option>
                        {flatCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4 mt-6">
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#153d1f] transition disabled:opacity-50">
                        {loading? 'Updating...':'Update Category'}
                    </button>
                    <a href="/admin/categories" className="px-6 py-2 bg-[#fffcef] border-2 border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#d4edda] transition">Cancel</a>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
