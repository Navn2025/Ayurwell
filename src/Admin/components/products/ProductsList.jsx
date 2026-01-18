import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {fetchAllProducts, toggleTrending, removeProduct, clearError as clearProductError} from '../../../store/slices/product.slice';

const ProductsList=() =>
{
    const dispatch=useDispatch();
    const {products, loading, error}=useSelector(state => state.product);
    const [deleteConfirm, setDeleteConfirm]=useState(null);
    const [deleting, setDeleting]=useState(false);

    useEffect(() =>
    {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const handleToggleTrending=async (productId) =>
    {
        await dispatch(toggleTrending(productId));
    };

    const handleDeleteProduct=async (productId) =>
    {
        setDeleting(true);
        try
        {
            const result=await dispatch(removeProduct(productId)).unwrap();
            setDeleteConfirm(null);
            // If product was deactivated instead of deleted, refresh the list
            if (result?.deactivated)
            {
                dispatch(fetchAllProducts());
                alert(result.message||'Product has been deactivated instead of deleted.');
            }
        } catch (err)
        {
            console.error('Failed to delete product:', err);
            alert(err?.message||'Failed to delete product');
        } finally
        {
            setDeleting(false);
        }
    };

    if (loading)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading products...</div>;
    }

    if (error)
    {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                <p className="text-red-700">{error}</p>
                <button onClick={() => dispatch(clearProductError())} className="text-red-500 hover:text-red-700">Dismiss</button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1a472a]">Products Management</h2>
                <Link to="/admin/products/add" className="px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#145214] transition">+ Add Product</Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Image</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">SKU</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Price</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Stock</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-[#1a472a]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a472a]/10">
                        {products&&products.length>0? (
                            products.map(product => (
                                <tr key={product.id} className="hover:bg-[#e6f4ea] transition">
                                    <td className="px-4 py-3">
                                        {product.images&&product.images[0]? (
                                            <img
                                                src={product.images[0].imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ):(
                                            <div className="w-12 h-12 bg-[#d6e8d6] rounded flex items-center justify-center text-xs text-[#4a7c59]">No Image</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-[#1a472a]">{product.name}</div>
                                        <div className="text-sm text-[#4a7c59]">{product.category?.name||'-'}</div>
                                    </td>
                                    <td className="px-4 py-3 text-[#4a7c59] font-mono text-sm">{product.sku}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-[#1a472a] font-medium">₹{product.discountPrice||product.price}</div>
                                        {product.discountPrice&&(
                                            <div className="text-sm text-[#4a7c59] line-through">₹{product.price}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-sm ${product.stockQuantity<10? 'bg-red-100 text-red-700':'bg-[#d6e8d6] text-[#155724]'}`}>
                                            {product.stockQuantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-xs ${product.isActive? 'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                                                {product.isActive? 'Active':'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleToggleTrending(product.id)}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition ${product.isTrending? 'bg-orange-100 text-orange-700 hover:bg-orange-200':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                                </svg>
                                                {product.isTrending? 'Trending':'Set Trending'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            <Link to={`/admin/products/edit/${product.id}`} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition">Edit</Link>
                                            <Link to={`/admin/products/${product.id}/images`} className="px-2 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition">Images</Link>
                                            <Link to={`/admin/products/${product.id}/faqs`} className="px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition">FAQ</Link>
                                            <Link to={`/admin/products/${product.id}/directions`} className="px-2 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition">How to</Link>
                                            <Link to={`/admin/products/${product.id}/reviews`} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 transition">Reviews</Link>
                                            <button
                                                onClick={() => setDeleteConfirm(product)}
                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ):(
                            <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm&&(
                <div className="fixed inset-0 bg-[#1a472a] bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#fffcef] rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-[#1a472a] mb-2">Delete Product</h3>
                        <p className="text-[#4a7c59] mb-4">
                            Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="px-4 py-2 bg-[#d6e8d6] text-[#155724] rounded hover:bg-[#c1d7c1] transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(deleteConfirm.id)}
                                disabled={deleting}
                                className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded hover:bg-[#145214] transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Deleting...
                                    </>
                                ):'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsList;
