import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, Link} from 'react-router-dom';
import {addProduct, clearError as clearProductError} from '../../../store/slices/product.slice';
import {fetchAllCategories} from '../../../store/slices/category.slice';
import {fetchAllConcerns} from '../../../store/slices/concern.slice';

const AddProduct=() =>
{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {loading, error}=useSelector(state => state.product);
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
        isTrending: false
    });

    const [success, setSuccess]=useState(false);
    const [newProductId, setNewProductId]=useState(null);

    useEffect(() =>
    {
        dispatch(fetchAllCategories());
        dispatch(fetchAllConcerns(true));
    }, [dispatch]);

    const handleChange=(e) =>
    {
        const {name, value, type, checked}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type==='checkbox'? checked:value
        }));

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
            isTrending: formData.isTrending
        };

        const result=await dispatch(addProduct(productData));

        if (!result.error)
        {
            setSuccess(true);
            const productId=result.payload?.product?.id||result.payload?.id;
            setNewProductId(productId);
            setFormData({
                name: '', slug: '', description: '', price: '', discountPrice: '',
                categoryId: '', concernId: '', currency: 'INR', stockQuantity: '', sku: '',
                weight: '', length: '', breadth: '', height: '', isTrending: false
            });
            // Redirect to images page after a short delay
            if (productId)
            {
                setTimeout(() =>
                {
                    navigate(`/admin/products/${productId}/images`);
                }, 2000);
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to="/admin/products"
                    className="p-2 hover:bg-[#e6f4ea] transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <h2 className="text-2xl font-bold text-[#1a472a]">Add New Product</h2>
            </div>

            {success&&(
                <div className="bg-[#d6e8d6] border border-[#a3c293] rounded-lg p-4 mb-6 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#155724]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#155724]">Product added successfully! Redirecting to add images...</span>
                </div>
            )}

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => dispatch(clearProductError())} className="text-red-500 hover:text-red-700 text-xl">&times;</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Basic Information</h3>

                    <div className="grid gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#1a472a] mb-1">Product Name *</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-[#1a472a] mb-1">Slug *</label>
                            <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleChange} required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-[#1a472a] mb-1">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4"
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="sku" className="block text-sm font-medium text-[#1a472a] mb-1">SKU *</label>
                            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-[#1a472a] mb-1">Category *</label>
                            <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required
                                className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]">
                                <option value="">Select Category</option>
                                {categories&&categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="concernId" className="block text-sm font-medium text-[#1a472a] mb-1">Health Concern (Optional)</label>
                            <select id="concernId" name="concernId" value={formData.concernId} onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]">
                                <option value="">Select Concern</option>
                                {concerns&&concerns.map(concern => (
                                    <option key={concern.id} value={concern.id}>{concern.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="isTrending"
                                name="isTrending"
                                checked={formData.isTrending}
                                onChange={handleChange}
                                className="w-5 h-5 text-[#1a472a] border-[#1a472a]/40  focus:ring-[#1a472a]"
                            />
                            <label htmlFor="isTrending" className="text-sm font-medium text-[#1a472a] flex items-center gap-2">

                                Mark as Trending
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Pricing</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-[#1a472a] mb-1">Price (₹) *</label>
                            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="discountPrice" className="block text-sm font-medium text-[#1a472a] mb-1">Discount Price (₹)</label>
                            <input type="number" id="discountPrice" name="discountPrice" value={formData.discountPrice} onChange={handleChange} min="0" step="0.01"
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="stockQuantity" className="block text-sm font-medium text-[#1a472a] mb-1">Stock Quantity *</label>
                        <input type="number" id="stockQuantity" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} min="0" required
                            className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                    </div>
                </div>

                <div className="bg-white  shadow p-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">Shipping Dimensions (Required for delivery)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weight" className="block text-sm font-medium text-[#1a472a] mb-1">Weight (kg) *</label>
                            <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} min="0" step="0.01" required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="length" className="block text-sm font-medium text-[#1a472a] mb-1">Length (cm) *</label>
                            <input type="number" id="length" name="length" value={formData.length} onChange={handleChange} min="0" step="0.1" required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="breadth" className="block text-sm font-medium text-[#1a472a] mb-1">Breadth (cm) *</label>
                            <input type="number" id="breadth" name="breadth" value={formData.breadth} onChange={handleChange} min="0" step="0.1" required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>

                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-[#1a472a] mb-1">Height (cm) *</label>
                            <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} min="0" step="0.1" required
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="submit" disabled={loading}
                        className="px-6 py-2.5 bg-[#1a472a] cursor-pointer text-[#fffcef] rounded-lg  hover:bg-[#15391f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {loading? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#1a472a] border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ):(
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Product
                            </>
                        )}
                    </button>
                    <Link to="/admin/products" className="px-6 py-2.5 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#15391f] transition">Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
