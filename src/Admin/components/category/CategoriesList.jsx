import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAllCategories, removeCategory, clearError as clearCategoryError} from '../../../store/slices/category.slice';

const CategoriesList=() =>
{
    const dispatch=useDispatch();
    const {categories, loading, error}=useSelector(state => state.category);

    useEffect(() =>
    {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    const handleDelete=async (categoryId, categoryName) =>
    {
        if (window.confirm(`Are you sure you want to delete "${categoryName}"? This will also delete all subcategories.`))
        {
            await dispatch(removeCategory(categoryId));
            dispatch(fetchAllCategories());
        }
    };

    // Render category tree recursively
    const renderCategoryTree=(cats, level=0) =>
    {
        return cats?.map(category => (
            <React.Fragment key={category.id}>
                <tr className="hover:bg-[#e6f4ea]">
                    <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-[#1a472a]">
                            {category.imageUrl? (
                                <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                            ):(
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-[#1a472a]" style={{paddingLeft: `${level*20+16}px`}}>
                        {level>0&&<span className="text-gray-400">└─ </span>}
                        {category.name}
                    </td>
                    <td className="px-4 py-3 text-[#1a472a]">{category.slug}</td>
                    <td className="px-4 py-3 text-[#1a472a]">{category.description||'-'}</td>
                    <td className="px-4 py-3 text-[#1a472a]">{category.children?.length||0}</td>
                    <td className="px-4 py-3 text-[#1a472a]">{category._count?.products||0}</td>
                    <td className="px-4 py-3 text-[#1a472a]">
                        <div className="flex gap-2">
                            <a href={`/admin/categories/${category.id}/image`} className="px-3 py-1 bg-purple-500 text-[#fffcef] text-sm rounded hover:bg-purple-600">
                                Image
                            </a>
                            <a href={`/admin/categories/edit/${category.id}`} className="px-3 py-1 bg-blue-500 text-[#fffcef] text-sm rounded hover:bg-blue-600">
                                Edit
                            </a>
                            <button
                                onClick={() => handleDelete(category.id, category.name)}
                                className="px-3 py-1 bg-red-500 text-[#fffcef] text-sm rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
                {category.children&&category.children.length>0&&
                    renderCategoryTree(category.children, level+1)
                }
            </React.Fragment>
        ));
    };

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading categories...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Categories Management</h2>
                <a href="/admin/categories/add" className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#145214] transition">+ Add Category</a>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    {error}
                    <button onClick={() => dispatch(clearCategoryError())}>×</button>
                </div>
            )}

            <div className="bg-white  shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#d4edda]">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Image</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Slug</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Subcategories</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Products</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d4edda]">
                        {categories&&categories.length>0? (
                            renderCategoryTree(categories)
                        ):(
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-[#1a472a]">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoriesList;
