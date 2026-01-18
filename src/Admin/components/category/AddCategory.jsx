import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addCategory, fetchAllCategories, clearError as clearCategoryError} from '../../../store/slices/category.slice';

const AddCategory=() =>
{
    const dispatch=useDispatch();
    const {categories, loading, error}=useSelector(state => state.category);

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
    }, [dispatch]);

    const handleChange=(e) =>
    {
        const {name, value}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from name
        if (name==='name')
        {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            }));
        }
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

        const result=await dispatch(addCategory(categoryData));

        if (!result.error)
        {
            setSuccess(true);
            setFormData({name: '', slug: '', description: '', parentId: ''});
            dispatch(fetchAllCategories()); // Refresh list
        }
    };

    // Flatten categories for parent dropdown
    const flattenCategories=(cats, prefix='') =>
    {
        let result=[];
        cats?.forEach(cat =>
        {
            result.push({id: cat.id, name: prefix+cat.name});
            if (cat.children&&cat.children.length>0)
            {
                result=[...result, ...flattenCategories(cat.children, prefix+'— ')];
            }
        });
        return result;
    };

    const flatCategories=flattenCategories(categories);

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-[#1a472a] mb-6">Add New Category</h2>

            {success&&(
                <div className="bg-[#d4edda] border border-[#c3e6cb] rounded-lg p-4 mb-6 flex items-center justify-between">
                    Category added successfully!
                    <button onClick={() => setSuccess(false)}>×</button>
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
                        placeholder="e.g., Herbal Supplements"
                        className="w-full px-3 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
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
                        placeholder="e.g., herbal-supplements"
                        className="w-full px-3 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                    <small className="text-xs text-[#1a472a] mt-1">URL-friendly identifier (auto-generated from name)</small>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#1a472a] mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Optional category description"
                        className="w-full px-3 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    />
                </div>

                <div>
                    <label htmlFor="parentId" className="block text-sm font-medium text-[#1a472a] mb-1">Parent Category (Optional)</label>
                    <select
                        id="parentId"
                        name="parentId"
                        value={formData.parentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#1a472a] focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                    >
                        <option value="">None (Top Level)</option>
                        {flatCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <small className="text-xs text-[#1a472a] mt-1">Leave empty for top-level category</small>
                </div>

                <div className="flex gap-4 mt-6">
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#145214] transition disabled:opacity-50">
                        {loading? 'Adding...':'Add Category'}
                    </button>
                    <a href="/admin/categories" className="px-6 py-2 bg-[#fffcef] border border-[#1a472a] text-[#1a472a] rounded-lg hover:bg-[#cde6cd] transition">Cancel</a>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
