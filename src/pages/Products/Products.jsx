import React, {useState, useEffect, useMemo, useCallback} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {fetchAllProducts} from '../../store/slices/product.slice'
import {fetchAllCategories} from '../../store/slices/category.slice'
import {addItemToCart} from '../../store/slices/cart.slice'

// Constants
const PRICE_RANGE_MAX=5000
const PRODUCTS_PER_PAGE=12
const SEARCH_DEBOUNCE_MS=300

const SORT_OPTIONS=[
    {value: 'featured', label: 'Featured'},
    {value: 'price-low', label: 'Price: Low to High'},
    {value: 'price-high', label: 'Price: High to Low'},
    {value: 'name-asc', label: 'Name: A to Z'},
    {value: 'name-desc', label: 'Name: Z to A'},
    {value: 'rating', label: 'Rating'}
]

// Calculate average rating from reviews array
const calculateAverageRating=(reviews) =>
{
    if (!reviews||reviews.length===0) return 0;
    const totalRating=reviews.reduce((sum, review) => sum+(review.rating||0), 0);
    return totalRating/reviews.length;
};

export const ProductCard=React.memo(({product, categoryName, onAddToCart}) =>
{
    const averageRating=calculateAverageRating(product.reviews);
    const reviewCount=product.reviews?.length||0;

    return (
        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <Link to={`/product/${product.slug}`}>
                <div className="relative">
                    <img
                        src={product.images? product.images[0].imageUrl:'/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                    />
                    {product.isFeatured&&(
                        <span className="absolute top-2 left-2 bg-[#1a472a] text-white text-xs px-2 py-1 rounded">
                            Featured
                        </span>
                    )}
                    {product.stockQuantity<=0&&(
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                        </span>
                    )}
                </div>
            </Link>
            <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-[#1a472a] mb-2 hover:text-[#14532d] transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{categoryName}</p>

                {/* Rating Section */}
                <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`w-4 h-4 ${i<Math.floor(averageRating)? 'fill-current':'fill-gray-300'}`}
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                        {averageRating>0? averageRating.toFixed(1):'0.0'} ({reviewCount})
                    </span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold text-[#1a472a]">₹{product.discountPrice}</span>
                        {product.price&&product.price>product.discountPrice&&(
                            <span className="text-sm text-gray-500 line-through ml-2">
                                ₹{product.price}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stockQuantity<=0}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${product.stockQuantity<=0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            :'bg-[#1a472a] text-white hover:bg-[#14532d]'
                            }`}
                    >
                        {product.stockQuantity<=0? 'Out of Stock':'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName='ProductCard'

// Price Range Filter Component
const PriceRangeFilter=React.memo(({priceRange, onPriceRangeChange}) =>
{
    return (
        <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
            <div className="space-y-3">
                <div>
                    <label className="text-sm text-gray-600">Min: ₹{priceRange[0]}</label>
                    <input
                        type="range"
                        min="0"
                        max={PRICE_RANGE_MAX}
                        value={priceRange[0]}
                        onChange={(e) => onPriceRangeChange('min', parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Max: ₹{priceRange[1]}</label>
                    <input
                        type="range"
                        min="0"
                        max={PRICE_RANGE_MAX}
                        value={priceRange[1]}
                        onChange={(e) => onPriceRangeChange('max', parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
})

PriceRangeFilter.displayName='PriceRangeFilter'

// Filter Sidebar Component
const FilterSidebar=React.memo(({
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    onResetFilters,
    showFilters,
    onToggleFilters
}) =>
{
    return (
        <div className="lg:w-64">
            {/* Mobile Filter Toggle */}
            <button
                onClick={onToggleFilters}
                className="lg:hidden w-full mb-4 px-4 py-2 bg-[#1a472a] text-white rounded-lg flex items-center justify-center"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                {showFilters? 'Hide Filters':'Show Filters'}
            </button>

            <div className={`${showFilters? 'block':'hidden'} lg:block bg-white  border-2 border-[#1a472a] border-dashed shadow-sm p-6`}>
                <h2 className="text-lg font-semibold text-[#1a472a] mb-4">Filters</h2>

                {/* Categories */}
                <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => onCategoryChange('all')}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory==='all'
                                ? 'bg-[#1a472a] text-white'
                                :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Products
                        </button>
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory===category.id
                                    ? 'bg-[#1a472a] text-white'
                                    :'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <PriceRangeFilter
                    priceRange={priceRange}
                    onPriceRangeChange={onPriceRangeChange}
                />

                {/* Reset Filters */}
                <button
                    onClick={onResetFilters}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    )
})

FilterSidebar.displayName='FilterSidebar'

// Loading Skeleton Component
const LoadingSkeleton=React.memo(() =>
{
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    )
})

LoadingSkeleton.displayName='LoadingSkeleton'

// Empty State Component
const EmptyState=React.memo(({onClearFilters}) =>
{
    return (
        <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms
            </p>
            <button
                onClick={onClearFilters}
                className="px-4 py-2 bg-[#1a472a] text-white rounded-lg hover:bg-[#14532d] transition-colors"
            >
                Clear Filters
            </button>
        </div>
    )
})

EmptyState.displayName='EmptyState'

// Pagination Component
const Pagination=React.memo(({currentPage, totalPages, onPageChange}) =>
{
    if (totalPages<=1) return null

    return (
        <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage-1))}
                    disabled={currentPage===1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => onPageChange(index+1)}
                        className={`px-3 py-2 rounded-lg ${currentPage===index+1
                            ? 'bg-[#1a472a] text-white'
                            :'border border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {index+1}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage+1))}
                    disabled={currentPage===totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    )
})

Pagination.displayName='Pagination'

// Main Products Component
const Products=() =>
{
    const [searchParams, setSearchParams]=useSearchParams()
    const dispatch=useDispatch()

    // Redux state
    const {products, loading, error}=useSelector((state) => state.product)
    const {categories}=useSelector((state) => state.category)

    // Local state
    const [selectedCategory, setSelectedCategory]=useState(searchParams.get('category')||'all')
    const [sortBy, setSortBy]=useState(searchParams.get('sort')||'featured')
    const [priceRange, setPriceRange]=useState([0, PRICE_RANGE_MAX])
    const [searchQuery, setSearchQuery]=useState(searchParams.get('search')||'')
    const [searchInput, setSearchInput]=useState(searchParams.get('search')||'')
    const [currentPage, setCurrentPage]=useState(1)
    const [showFilters, setShowFilters]=useState(false)

    // Fetch data on mount - only if not already loaded
    useEffect(() =>
    {
        if (!products?.length)
        {
            dispatch(fetchAllProducts())
        }
        if (!categories?.length)
        {
            dispatch(fetchAllCategories())
        }
    }, [dispatch, products?.length, categories?.length])

    // Debounced search effect
    useEffect(() =>
    {
        const timer=setTimeout(() =>
        {
            setSearchQuery(searchInput)
            setCurrentPage(1)
        }, SEARCH_DEBOUNCE_MS)

        return () => clearTimeout(timer)
    }, [searchInput])

    // Update URL when filters change
    useEffect(() =>
    {
        const params=new URLSearchParams()
        if (selectedCategory!=='all') params.set('category', selectedCategory)
        if (sortBy!=='featured') params.set('sort', sortBy)
        if (searchQuery) params.set('search', searchQuery)
        setSearchParams(params)
    }, [selectedCategory, sortBy, searchQuery, setSearchParams])

    // Memoize category map for O(1) lookup
    const categoryMap=useMemo(() =>
    {
        return categories?.reduce((acc, cat) =>
        {
            acc[cat.id]=cat.name
            return acc
        }, {})||{}
    }, [categories])

    // Filter and sort products
    const filteredAndSortedProducts=useMemo(() =>
    {
        let filtered=products||[]

        // Category filter
        if (selectedCategory!=='all')
        {
            filtered=filtered.filter(product => product.categoryId===selectedCategory)
        }

        // Search filter
        if (searchQuery)
        {
            const query=searchQuery.toLowerCase()
            filtered=filtered.filter(product =>
                product.name.toLowerCase().includes(query)||
                product.description.toLowerCase().includes(query)
            )
        }

        // Price range filter - CHANGED: Now uses discountPrice
        filtered=filtered.filter(product =>
            product.discountPrice>=priceRange[0]&&product.discountPrice<=priceRange[1]
        )

        // Sort products - CHANGED: Now uses discountPrice for price sorting
        const sorted=[...filtered]
        switch (sortBy)
        {
            case 'price-low':
                return sorted.sort((a, b) => a.discountPrice-b.discountPrice)
            case 'price-high':
                return sorted.sort((a, b) => b.discountPrice-a.discountPrice)
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name))
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name))
            case 'rating':
                return sorted.sort((a, b) => (b.rating||0)-(a.rating||0))
            default:
                return sorted.sort((a, b) => (b.isFeatured? 1:0)-(a.isFeatured? 1:0))
        }
    }, [products, selectedCategory, sortBy, priceRange, searchQuery])

    // Pagination
    const totalPages=Math.ceil(filteredAndSortedProducts.length/PRODUCTS_PER_PAGE)
    const currentProducts=useMemo(() =>
    {
        const startIndex=(currentPage-1)*PRODUCTS_PER_PAGE
        const endIndex=startIndex+PRODUCTS_PER_PAGE
        return filteredAndSortedProducts.slice(startIndex, endIndex)
    }, [filteredAndSortedProducts, currentPage])

    // Memoized handlers
    const handleAddToCart=useCallback((product) =>
    {
        dispatch(addItemToCart({
            productId: product.id,
            quantity: 1
        }))
    }, [dispatch])

    const handleCategoryChange=useCallback((categoryId) =>
    {
        setSelectedCategory(categoryId)
        setCurrentPage(1)
    }, [])

    const handleSortChange=useCallback((sort) =>
    {
        setSortBy(sort)
        setCurrentPage(1)
    }, [])

    const handleSearch=useCallback((e) =>
    {
        setSearchInput(e.target.value)
    }, [])

    const handlePriceRangeChange=useCallback((type, value) =>
    {
        if (type==='min')
        {
            setPriceRange([Math.min(value, priceRange[1]), priceRange[1]])
        } else
        {
            setPriceRange([priceRange[0], Math.max(value, priceRange[0])])
        }
        setCurrentPage(1)
    }, [priceRange])

    const handleResetFilters=useCallback(() =>
    {
        setSelectedCategory('all')
        setSortBy('featured')
        setPriceRange([0, PRICE_RANGE_MAX])
        setSearchQuery('')
        setSearchInput('')
        setCurrentPage(1)
    }, [])

    const handleToggleFilters=useCallback(() =>
    {
        setShowFilters(prev => !prev)
    }, [])

    const handlePageChange=useCallback((page) =>
    {
        setCurrentPage(page)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])

    // Get category name using memoized map
    const getCategoryName=useCallback((categoryId) =>
    {
        return categoryMap[categoryId]||'Unknown'
    }, [categoryMap])

    if (error)
    {
        return (
            <div className="min-h-screen bg-[#fffcef] py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Products</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fffcef] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#1a472a] mb-2">All Products</h1>
                    <p className="text-gray-600">Discover our complete range of Ayurvedic wellness products</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 ">
                    <div className="relative border-2 bg-white border-[#1a472a] border-dashed max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={handleSearch}
                            className="w-full px-4 py-3 pr-12  focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                        />
                        <svg
                            className="absolute right-4 top-3.5 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col  lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <FilterSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        priceRange={priceRange}
                        onPriceRangeChange={handlePriceRangeChange}
                        onResetFilters={handleResetFilters}
                        showFilters={showFilters}
                        onToggleFilters={handleToggleFilters}
                    />

                    {/* Products Content */}
                    <div className="flex-1">
                        {/* Sort Bar */}
                        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="text-gray-600">
                                Showing {currentProducts.length} of {filteredAndSortedProducts.length} products
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a472a] focus:border-[#1a472a]"
                                >
                                    {SORT_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading? (
                            <LoadingSkeleton />
                        ):(
                            <>
                                {/* Products Grid */}
                                {currentProducts.length>0? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {currentProducts.map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                categoryName={getCategoryName(product.categoryId)}
                                                onAddToCart={handleAddToCart}
                                            />
                                        ))}
                                    </div>
                                ):(
                                    <EmptyState onClearFilters={handleResetFilters} />
                                )}

                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products