import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import
{
    fetchProductById,
    fetchProductFAQs,
    createFAQ,
    editFAQ,
    removeFAQ,
    clearError
} from '../../../store/slices/product.slice';

const ProductFAQs=() =>
{
    const {productId}=useParams();
    const dispatch=useDispatch();
    const {currentProduct, faqs, faqLoading, loading, error}=useSelector(state => state.product);

    const [showForm, setShowForm]=useState(false);
    const [editingFAQ, setEditingFAQ]=useState(null);
    const [formData, setFormData]=useState({
        question: '',
        answer: '',
        position: 0
    });

    useEffect(() =>
    {
        if (productId)
        {
            dispatch(fetchProductById(productId));
            dispatch(fetchProductFAQs(productId));
        }
    }, [dispatch, productId]);

    const handleChange=(e) =>
    {
        const {name, value}=e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name==='position'? parseInt(value)||0:value
        }));
    };

    const handleSubmit=async (e) =>
    {
        e.preventDefault();

        if (editingFAQ)
        {
            const result=await dispatch(editFAQ({faqId: editingFAQ.id, faqData: formData}));
            if (!result.error)
            {
                resetForm();
            }
        }
        else
        {
            const result=await dispatch(createFAQ({productId, faqData: formData}));
            if (!result.error)
            {
                resetForm();
            }
        }
    };

    const handleEdit=(faq) =>
    {
        setEditingFAQ(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            position: faq.position
        });
        setShowForm(true);
    };

    const handleDelete=async (faqId) =>
    {
        if (window.confirm('Are you sure you want to delete this FAQ?'))
        {
            await dispatch(removeFAQ(faqId));
        }
    };

    const resetForm=() =>
    {
        setFormData({question: '', answer: '', position: 0});
        setEditingFAQ(null);
        setShowForm(false);
    };

    if (loading&&!currentProduct)
    {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/products" className="p-2 hover:bg-[#e6f4ea] rounded-lg transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1a472a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-[#1a472a]">Product FAQs</h2>
                    {currentProduct&&<p className="text-[#4a6b3b]">{currentProduct.name}</p>}
                </div>
            </div>

            {error&&(
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <span className="text-red-700">{error}</span>
                    <button onClick={() => dispatch(clearError())} className="text-red-500 hover:text-red-700 text-xl">&times;</button>
                </div>
            )}

            {/* Add FAQ Button */}
            {!showForm&&(
                <button
                    onClick={() => setShowForm(true)}
                    className="mb-6 flex items-center gap-2 px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#16391a] transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add FAQ
                </button>
            )}

            {/* FAQ Form */}
            {showForm&&(
                <div className="bg-white  shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[#1a472a] mb-4">
                        {editingFAQ? 'Edit FAQ':'Add New FAQ'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#1a472a] mb-1">Question *</label>
                            <input
                                type="text"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                                placeholder="e.g., How to use this product?"
                                className="w-full px-3 py-2 border border-[#1a472a]/40 focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1a472a] mb-1">Answer *</label>
                            <textarea
                                name="answer"
                                value={formData.answer}
                                onChange={handleChange}
                                required
                                rows="4"
                                placeholder="Provide a detailed answer..."
                                className="w-full px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1a472a] mb-1">Position (Order)</label>
                            <input
                                type="number"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                min="0"
                                className="w-32 px-3 py-2 border border-[#1a472a]/40  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={faqLoading}
                                className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#145214] transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {faqLoading&&<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                {editingFAQ? 'Update':'Add'} FAQ
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-[#fffcef] text-[#1a472a] border border-[#1a472a] rounded-lg hover:bg-[#e6f4ea] transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* FAQs List */}
            <div className="space-y-4">
                {faqLoading&&faqs.length===0? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a472a]"></div>
                    </div>
                ):faqs&&faqs.length>0? (
                    faqs.map((faq, index) => (
                        <div key={faq.id} className="bg-white rounded-lg shadow p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-[#d1e7dd] text-[#1a472a] text-xs font-semibold px-2 py-1 rounded">
                                            Q{index+1}
                                        </span>
                                        <h4 className="font-semibold text-[#1a472a]">{faq.question}</h4>
                                    </div>
                                    <p className="text-[#4a6b3b] whitespace-pre-wrap">{faq.answer}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="p-2 text-[#1a472a] hover:bg-[#d1e7dd] rounded-lg transition"
                                        title="Edit"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ):(
                    <div className="bg-white  shadow p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#1a472a] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-[#1a472a] mb-2">No FAQs yet</h3>
                        <p className="text-[#1a472a]">Add frequently asked questions to help customers.</p>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <div className="mt-8 flex gap-4">
                <Link
                    to={`/admin/products/${productId}/images`}
                    className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#145214] transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Manage Images
                </Link>
                <Link
                    to={`/admin/products/${productId}/directions`}
                    className="px-4 py-2 bg-[#1a472a] text-[#fffcef] rounded-lg hover:bg-[#145214] transition flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    How to Use
                </Link>
            </div>
        </div>
    );
};

export default ProductFAQs;
