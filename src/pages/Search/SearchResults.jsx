import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams, Link} from 'react-router-dom';
import {globalSearch} from '../../api/search.api';

const SearchResults=() =>
{
    const [searchParams]=useSearchParams();
    const navigate=useNavigate();
    const query=searchParams.get('q')||'';

    const [results, setResults]=useState({
        products: [],
        categories: []
    });
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState(null);

    useEffect(() =>
    {
        if (query.trim().length<2)
        {
            setError('Search query must be at least 2 characters');
            setLoading(false);
            return;
        }

        const fetchResults=async () =>
        {
            setLoading(true);
            setError(null);
            try
            {
                const response=await globalSearch(query);
                const data=response.data||response;

                // Handle the enhanced response structure
                if (data.success===false)
                {
                    throw new Error(data.message||'Search failed');
                }

                setResults({
                    products: data.products||[],
                    categories: data.categories||[]
                });
            } catch (err)
            {
                console.error('Error fetching search results:', err);
                setError(err.response?.data?.message||'Failed to fetch search results');
            } finally
            {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const formatPrice=(price) =>
    {
        if (!price) return 'Price not available';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getProductImage=(product) =>
    {
        if (!product.images||product.images.length===0) return null;

        // Try to find primary image first
        const primaryImage=product.images.find(img => img.isPrimary);
        if (primaryImage) return primaryImage.imageUrl;

        // Return first image if no primary image
        return product.images[0].imageUrl;
    };

    if (loading)
    {
        return (
            <div className="min-h-screen bg-[#fffcef] flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a] mx-auto mb-4"></div>
                    <p className="text-[#1a472a] font-medium">Searching for "{query}"...</p>
                </div>
            </div>
        );
    }

    if (error)
    {
        return (
            <div className="min-h-screen bg-[#fffcef] flex justify-center items-center">
                <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1a472a] mb-2">Search Error</h3>
                    <p className="text-[#1a472a]/70 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#1a472a] text-[#fffcef] px-6 py-3 rounded-lg font-medium hover:bg-[#14532d] transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const totalResults=results.products.length+results.categories.length;

    return (
        <div className="min-h-screen bg-[#fffcef] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1a472a] mb-3">
                        Search Results
                    </h1>
                    <div className="flex items-center gap-2 text-[#1a472a]/70">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>
                            {totalResults>0
                                ? `Found ${totalResults} result${totalResults!==1? 's':''} for "${query}"`
                                :`No results found for "${query}"`}
                        </span>
                    </div>
                </div>

                {totalResults===0? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="w-24 h-24 bg-[#1a472a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#1a472a] mb-3">No results found</h3>
                        <p className="text-[#1a472a]/70 mb-8 max-w-md mx-auto">
                            We couldn't find any products or categories matching "{query}". Try searching with different keywords.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/products')}
                                className="bg-[#1a472a] text-[#fffcef] px-6 py-3 rounded-lg font-medium hover:bg-[#14532d] transition-colors"
                            >
                                Browse All Products
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="border-2 border-[#1a472a] text-[#1a472a] px-6 py-3 rounded-lg font-medium hover:bg-[#1a472a] hover:text-[#fffcef] transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                ):(
                    <div className="space-y-8">
                        {/* Categories Section */}
                        {results.categories.length>0&&(
                            <div>
                                <h2 className="text-2xl font-bold text-[#1a472a] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center text-sm">
                                        {results.categories.length}
                                    </span>
                                    Categories
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            to={`/category/${category.slug}`}
                                            className="group bg-white border-2 border-[#1a472a] border-dashed rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-[#1a472a]"
                                        >
                                            <div className="w-16 h-16 bg-[#1a472a]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#1a472a]/20 transition-colors">
                                                <svg className="w-8 h-8 text-[#1a472a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <rect x="3" y="3" width="7" height="7" strokeWidth={2}></rect>
                                                    <rect x="14" y="3" width="7" height="7" strokeWidth={2}></rect>
                                                    <rect x="14" y="14" width="7" height="7" strokeWidth={2}></rect>
                                                    <rect x="3" y="14" width="7" height="7" strokeWidth={2}></rect>
                                                </svg>
                                            </div>
                                            <h3 className="font-bold text-[#1a472a] mb-2 group-hover:text-[#14532d] transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-[#1a472a]/70 text-sm">Browse category</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products Section */}
                        {results.products.length>0&&(
                            <div>
                                <h2 className="text-2xl font-bold text-[#1a472a] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center text-sm">
                                        {results.products.length}
                                    </span>
                                    Products
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.products.map((product) => (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.slug}`}
                                            className="group bg-white border-2 border-[#1a472a] border-dashed rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#1a472a]"
                                        >
                                            <div className="relative">
                                                <div className="aspect-square bg-[#1a472a]/5 flex items-center justify-center">
                                                    {getProductImage(product)? (
                                                        <img
                                                            src={getProductImage(product)}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        />
                                                    ):(
                                                        <div className="w-20 h-20 bg-[#1a472a]/10 rounded-xl flex items-center justify-center">
                                                            <svg className="w-10 h-10 text-[#1a472a]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                {product.isFeatured&&(
                                                    <span className="absolute top-3 left-3 bg-[#1a472a] text-[#fffcef] text-xs px-2 py-1 rounded-md font-medium">
                                                        Featured
                                                    </span>
                                                )}
                                                {(product.stockQuantity<=0||!product.isActive)&&(
                                                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-[#1a472a] mb-3 line-clamp-2 group-hover:text-[#14532d] transition-colors">
                                                    {product.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {product.discountPrice&&product.discountPrice<product.price? (
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-lg font-bold text-[#1a472a]">
                                                                    {formatPrice(product.discountPrice)}
                                                                </p>
                                                                <p className="text-sm text-[#1a472a]/50 line-through">
                                                                    {formatPrice(product.price)}
                                                                </p>
                                                            </div>
                                                        ):(
                                                            <p className="text-lg font-bold text-[#1a472a]">
                                                                {formatPrice(product.price)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="w-8 h-8 bg-[#1a472a]/10 rounded-full flex items-center justify-center group-hover:bg-[#1a472a] group-hover:text-[#fffcef] transition-colors">
                                                        <svg className="w-4 h-4 text-[#1a472a] group-hover:text-[#fffcef]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
