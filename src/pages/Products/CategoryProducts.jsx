import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {getProductsByCategorySlug} from '../../api/product.api'

const CategoryProducts=() =>
{
    const {slug}=useParams()
    const navigate=useNavigate()
    const [category, setCategory]=useState(null)
    const [products, setProducts]=useState([])
    const [pagination, setPagination]=useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false
    })
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)

    const fetchProducts=async (page=1) =>
    {
        setLoading(true)
        try
        {
            const response=await getProductsByCategorySlug(slug, 16, page)
            const data=response.data||response
            setCategory(data.category)
            setProducts(data.products||[])
            setPagination(data.pagination||{
                currentPage: 1,
                totalPages: 1,
                totalCount: 0,
                hasNextPage: false,
                hasPrevPage: false
            })
            setError(null)
        } catch (err)
        {
            console.error('Error fetching products:', err)
            setError('Failed to load products. Please try again.')
        } finally
        {
            setLoading(false)
        }
    }

    useEffect(() =>
    {
        if (slug)
        {
            fetchProducts(1)
        }
    }, [slug])

    const handlePageChange=(newPage) =>
    {
        fetchProducts(newPage)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const handleProductClick=(product) =>
    {
        navigate(`/product/${product.slug||product.id}`)
    }

    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fffcef]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
            </div>
        )
    }

    if (error)
    {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fffcef] gap-4">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#1a472a] text-[#fffcef] px-6 py-2 rounded-lg hover:bg-[#004411] transition-colors"
                >
                    Go Back Home
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fffcef]">
            {/* Hero Section with Category Info */}
            <div className="bg-[#fffcef]  text-[#1a472a] py-12 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Category Image */}
                        {category?.imageUrl&&(
                            <div className="w-32 h-32 md:w-40 md:h-40  overflow-hidden border-4 border-dashed border-[#1a472a] shadow-xl flex-shrink-0">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full hover:scale-105 transition-transform duration-300 object-cover"
                                />
                            </div>
                        )}

                        {/* Category Details */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {category?.name}
                            </h1>
                            {category?.description&&(
                                <p className="text-lg text-[#1a472a]/90 leading-relaxed max-w-3xl">
                                    {category.description}
                                </p>
                            )}
                            <p className="mt-4 text-[#1a472a]/70">
                                {pagination.totalCount} {pagination.totalCount===1? 'Product':'Products'} Available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <section className="py-12 px-4 bg-[#1a472a] md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    {products.length>0? (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-10">
                                {products.map((product) =>
                                {
                                    const discount=product.discountPrice
                                        ? Math.round(((product.price-product.discountPrice)/product.price)*100)
                                        :0

                                    return (
                                        <div
                                            key={product.id}
                                            className="bg-[#fffcef] max-w-80  shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all p-2 duration-300 border border-gray-100"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <div className='h-full w-full border-2 border-dashed border-[#1a472a] '>
                                                {/* Image */}
                                                <div className="relative h-64 md:h-56 lg:h-64  bg-[#fffcef] overflow-hidden">
                                                    <img
                                                        src={product.images?.[0]?.imageUrl||'/placeholder.png'}
                                                        alt={product.name}
                                                        className="w-full  object-contain  group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    {/* Discount Badge */}
                                                    {discount>0&&(
                                                        <div className="absolute top-3 right-3 bg-[#004411] text-[#fffcef] text-xs font-bold px-2 py-1 rounded">
                                                            {discount}% OFF
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-4 border-t-2 border-dashed border-[#1a472a]">
                                                    <h3 className="font-semibold text-[#1a472a] text-sm md:text-base line-clamp-2 mb-2 group-hover:text-[#004411] transition-colors duration-300">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-[#1a472a]">
                                                            ₹{product.discountPrice||product.price}
                                                        </span>
                                                        {product.discountPrice&&(
                                                            <span className="text-sm text-[#66a576] line-through">
                                                                ₹{product.price}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages>1&&(
                                <div className="flex justify-center items-center gap-2 mt-12">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage-1)}
                                        disabled={!pagination.hasPrevPage}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${pagination.hasPrevPage
                                            ? 'bg-[#fffcef] text-[#1a472a] hover:bg-[#004411]'
                                            :'bg-gray-200 text-[#a0a0a0] cursor-not-allowed'
                                            }`}
                                    >
                                        ← Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({length: pagination.totalPages}, (_, i) => i+1).map((page) =>
                                        {
                                            // Show first, last, current, and adjacent pages
                                            const showPage=
                                                page===1||
                                                page===pagination.totalPages||
                                                Math.abs(page-pagination.currentPage)<=1

                                            if (!showPage)
                                            {
                                                // Show ellipsis for gaps
                                                if (page===2||page===pagination.totalPages-1)
                                                {
                                                    return (
                                                        <span key={page} className="px-2 text-[#fffcef]">
                                                            ...
                                                        </span>
                                                    )
                                                }
                                                return null
                                            }

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${page===pagination.currentPage
                                                        ? 'bg-[#fffcef] text-[#1a472a]'
                                                        :'bg-gray-100 text-[#1a472a] hover:bg-[#004411]'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage+1)}
                                        disabled={!pagination.hasNextPage}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${pagination.hasNextPage
                                            ? 'bg-[#fffcef] text-[#1a472a] hover:bg-[#004411]'
                                            :'bg-gray-200 text-[#a0a0a0] cursor-not-allowed'
                                            }`}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}

                            {/* Page Info */}
                            <p className="text-center text-[#fffcef] mt-4">
                                Showing page {pagination.currentPage} of {pagination.totalPages}
                            </p>
                        </>
                    ):(
                        <div className="text-center py-16">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-24 w-24 mx-auto text-[#fffcef] mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-[#fffcef] mb-2">
                                No Products Found
                            </h3>
                            <p className="text-[#fffcef]/70 mb-6">
                                There are no products available in this category yet.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#fffcef] text-[#1a472a] px-6 py-3 rounded-lg hover:bg-[#e6e2d3] transition-colors"
                            >
                                Browse All Products
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default CategoryProducts
