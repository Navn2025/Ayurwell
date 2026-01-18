import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, useNavigate, Link} from 'react-router-dom';
import
{
    fetchProductById,
    editProduct,
    clearError as clearProductError,
    clearCurrentProduct
} from '../../../store/slices/product.slice';
import {fetchAllCategories} from '../../../store/slices/category.slice';
import {fetchAllConcerns} from '../../../store/slices/concern.slice';

const EditProduct=() =>
{
    const params=useParams();
    const productId=params.productId;
    console.log('EditProduct.jsx productId:', productId);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {currentProduct, loading, error}=useSelector(state => state.product);
    const {categories}=useSelector(state => state.category);
    const {concerns}=useSelector(state => state.concern);

    const [formData, setFormData]=useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        discountPrice: '',
        categoryId: '',
        concernId: '',
        currency: 'INR',
        stockQuantity: '',
        sku: '',
        weight: '',
        length: '',
        breadth: '',
        height: '',
        isTrending: false,
        isActive: true
    });

    const [success, setSuccess]=useState(false);


    useEffect(() =>
    {
        dispatch(fetchAllCategories());
        dispatch(fetchAllConcerns(true));
        if (productId)
        {
            dispatch(fetchProductById(productId));
        }
        return () =>
        {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, productId]);



    useEffect(() =>
    {
        if (currentProduct&&currentProduct.id===productId)
        {
            setFormData({
                name: currentProduct.name||'',
                slug: currentProduct.slug||'',
                description: currentProduct.description||'',
                price: currentProduct.price||'',
                discountPrice: currentProduct.discountPrice||'',
                categoryId: currentProduct.categoryId||'',
                concernId: currentProduct.concernId||'',
                currency: currentProduct.currency||'INR',
                stockQuantity: currentProduct.stockQuantity||'',
                sku: currentProduct.sku||'',
                weight: currentProduct.weight||'',
                length: currentProduct.length||'',
                breadth: currentProduct.breadth||'',
                height: currentProduct.height||'',
                isTrending: currentProduct.isTrending||false,
                isActive: currentProduct.isActive!==undefined? currentProduct.isActive:true
            });
        }
    }, [currentProduct]);

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

        const productData={
            ...formData,
            price: parseFloat(formData.price),
            discountPrice: formData.discountPrice? parseFloat(formData.discountPrice):null,
            stockQuantity: parseInt(formData.stockQuantity),
            weight: parseFloat(formData.weight),
            length: parseFloat(formData.length),
            breadth: parseFloat(formData.breadth),
            height: parseFloat(formData.height),
            concernId: formData.concernId||null,
            isTrending: formData.isTrending,
            isActive: formData.isActive
        };

        const result=await dispatch(editProduct({productId, productData}));

        if (!result.error)
        {
            setSuccess(true);
            setTimeout(() => navigate('/admin/products'), 1500);
        }
    };

    if (loading&&!currentProduct)
    {
        return <div className="flex items-center justify-center h-64 text-[#1a472a]">Loading product...</div>;
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to="/admin/products"
                    className="p-2 hover:bg-[#e6f4ea] rounded-lg transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <h2 className="text-2xl font-bold text-[#1a472a]">Edit Product</h2>
            </div>

            {success&&(
                <div className="bg-[#d6e8d6] border border-[#a3c293] rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-[#155724]">Product updated successfully! Redirecting...</span>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button
                        onClick={() => dispatch(clearProductError())}
                        className="text-red-500 hover:text-red-700 text-xl font-bold"
                    >×</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Basic Information</h3>

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-[#1a472a] mb-1">Product Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="slug" className="block text-sm font-medium text-[#1a472a] mb-1">Slug *</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-[#1a472a] mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sku" className="block text-sm font-medium text-[#1a472a] mb-1">SKU *</label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="categoryId" className="block text-sm font-medium text-[#1a472a] mb-1">Category *</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        >
                            <option value="">Select Category</option>
                            {categories&&categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="concernId" className="block text-sm font-medium text-[#1a472a] mb-1">Health Concern (Optional)</label>
                        <select
                            id="concernId"
                            name="concernId"
                            value={formData.concernId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        >
                            <option value="">Select Concern</option>
                            {concerns&&concerns.map(concern => (
                                <option key={concern.id} value={concern.id}>{concern.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isTrending"
                                name="isTrending"
                                checked={formData.isTrending}
                                onChange={handleChange}
                                className="w-5 h-5 text-orange-500 border-[#1a472a]/40 focus:ring-[#1a472a]"
                            />
                            <label htmlFor="isTrending" className="text-sm font-medium text-[#1a472a] flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                </svg>
                                Trending
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#1a472a] border-[#1a472a]/40 focus:ring-[#1a472a]"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-[#1a472a]">
                                Active
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Pricing & Stock</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-[#1a472a] mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>

                        <div>
                            <label htmlFor="discountPrice" className="block text-sm font-medium text-[#1a472a] mb-1">Discount Price (₹)</label>
                            <input
                                type="number"
                                id="discountPrice"
                                name="discountPrice"
                                value={formData.discountPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="stockQuantity" className="block text-sm font-medium text-[#1a472a] mb-1">Stock Quantity *</label>
                        <input
                            type="number"
                            id="stockQuantity"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            min="0"
                            required
                            className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        />
                    </div>
                </div>

                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Shipping Dimensions</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-[#1a472a] mb-1">Weight (kg) *</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>

                        <div>
                            <label htmlFor="length" className="block text-sm font-medium text-[#1a472a] mb-1">Length (cm) *</label>
                            <input
                                type="number"
                                id="length"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="breadth" className="block text-sm font-medium text-[#1a472a] mb-1">Breadth (cm) *</label>
                            <input
                                type="number"
                                id="breadth"
                                name="breadth"
                                value={formData.breadth}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>

                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-[#1a472a] mb-1">Height (cm) *</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                min="0"
                                step="0.1"
                                required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d1f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ):(
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Update Product
                            </>
                        )}
                    </button>
                    <Link
                        to={`/admin/products/${productId}/images`}
                        className="px-6 py-2.5 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#163d1f] transition flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Manage Images
                    </Link>
                    <Link
                        to="/admin/products"
                        className="px-6 py-2.5 border-2 border-[#1a472a] bg-[#fffcef] text-[#1a472a] rounded-lg hover:bg-[#f0f0d8] transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
