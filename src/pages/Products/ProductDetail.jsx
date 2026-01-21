import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {getProductBySlug} from '../../api/product.api'
import {addToCart} from '../../api/cart.api'
import {getProductReviews, getUserReviewForProduct} from '../../store/slices/review.slice'
import ReviewForm from '../../components/Reviews/ReviewForm'
import ReviewList from '../../components/Reviews/ReviewList'

const ProductDetail=() =>
{
    const {slug}=useParams()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {user}=useSelector((state) => state.auth)
    const {reviews, userReview}=useSelector((state) => state.review)

    const [product, setProduct]=useState(null)
    const [loading, setLoading]=useState(true)
    const [error, setError]=useState(null)
    const [selectedImage, setSelectedImage]=useState(0)
    const [quantity, setQuantity]=useState(1)
    const [addingToCart, setAddingToCart]=useState(false)
    const [cartMessage, setCartMessage]=useState('')
    const [activeTab, setActiveTab]=useState('description')
    const [showReviewForm, setShowReviewForm]=useState(false)
    const [isMobile, setIsMobile]=useState(false)

    useEffect(() =>
    {
        const fetchProduct=async () =>
        {
            try
            {
                const response=await getProductBySlug(slug)
                const data=response.data||response
                setProduct(data)
                setError(null)

                // Fetch reviews for this product
                if (data.id)
                {
                    dispatch(getProductReviews(data.id))
                }
            } catch (err)
            {
                console.error('Error fetching product:', err)
                setError('Product not found')
            } finally
            {
                setLoading(false)
            }
        }

        if (slug)
        {
            fetchProduct()
        }
    }, [slug, dispatch])

    // Detect mobile view
    useEffect(() =>
    {
        const checkMobile=() =>
        {
            setIsMobile(window.innerWidth<768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Fetch user's review separately when product and user are available
    useEffect(() =>
    {
        if (product?.id && user)
        {
            dispatch(getUserReviewForProduct(product.id))
        }
    }, [product?.id, user, dispatch])

    const handleAddToCart=async () =>
    {
        setAddingToCart(true)
        setCartMessage('')
        try
        {
            await addToCart(product.id, quantity)
            setCartMessage('Added to cart successfully!')
            setTimeout(() => setCartMessage(''), 3000)
        } catch (err)
        {
            console.error('Error adding to cart:', err)
            if (err.response?.status===401)
            {
                setCartMessage('Please login to add items to cart')
                setTimeout(() => navigate('/login'), 2000)
            } else
            {
                setCartMessage('Failed to add to cart. Please try again.')
            }
        } finally
        {
            setAddingToCart(false)
        }
    }

    const handleBuyNow=async () =>
    {
        // Navigate directly to checkout with product info (no cart)
        navigate('/checkout', {
            state: {
                buyNow: true,
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    discountPrice: product.discountPrice,
                    images: product.images,
                    sku: product.sku,
                    weight: product.weight,
                    length: product.length,
                    breadth: product.breadth,
                    height: product.height
                },
                quantity: quantity
            }
        })
    }

    const handleQuantityChange=(delta) =>
    {
        const newQty=quantity+delta
        if (newQty>=1&&newQty<=product.stockQuantity)
        {
            setQuantity(newQty)
        }
    }

    const handleReviewUpdated=() =>
    {
        // Refresh reviews and user review
        if (product?.id)
        {
            dispatch(getProductReviews(product.id))
            if (user)
            {
                dispatch(getUserReviewForProduct(product.id))
            }
        }
        setShowReviewForm(false)
    }

    const handleWriteReview=() =>
    {
        setShowReviewForm(true)
    }

    const handleCancelReview=() =>
    {
        setShowReviewForm(false)
    }



    if (loading)
    {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#fffcef]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#1a472a]"></div>
            </div>
        )
    }

    if (error||!product)
    {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#fffcef] gap-4">
                <p className="text-red-500 text-lg">{error||'Product not found'}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-[#1a472a] text-white px-6 py-2 rounded-lg hover:bg-[#004411] transition-colors"
                >
                    Go Back Home
                </button>
            </div>
        )
    }

    const discount=product.discountPrice
        ? Math.round(((product.price-product.discountPrice)/product.price)*100)
        :0
    const finalPrice=product.discountPrice||product.price
    const images=product.images||[]

    return (
        <div className="min-h-screen font-exo bg-[#fffcef] py-8 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <ol className="flex items-center gap-2 text-[#1a472a]/70">
                        <li><button onClick={() => navigate('/')} className="hover:text-[#004411]">Home</button></li>
                        <li>/</li>
                        {product.category&&(
                            <>
                                <li>
                                    <button
                                        onClick={() => navigate(`/category/${product.category.slug}`)}
                                        className="hover:text-[#004411]"
                                    >
                                        {product.category.name}
                                    </button>
                                </li>
                                <li>/</li>
                            </>
                        )}
                        <li className="text-[#1a472a] font-medium">{product.name}</li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative aspect-square bg-[#fffcef] border-2 border-dashed border-[#1a472a] overflow-hidden">
                                <img
                                    src={images[selectedImage]?.imageUrl||'/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8"
                                />
                                {discount>0&&(
                                    <div className="absolute top-4 left-4 bg-[#1a472a] text-[#fffcef] text-sm font-bold px-3 py-1 rounded-full">
                                        {discount}% OFF
                                    </div>
                                )}
                                {product.isTrending&&(
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-[#004411] to-[#006622] text-[#fffcef] text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        Trending
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Images */}
                            {images.length>1&&(
                                <div className="flex gap-3 overflow-x-auto p-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`shrink-0 w-20 h-20 overflow-hidden border-2 border-dashed transition-all ${selectedImage===idx? 'border-[#1a472a] ring-2 ring-[#1a472a]/80':'border-gray-200 hover:border-[#1a472a]'
                                                }`}
                                        >
                                            <img
                                                src={img.imageUrl}
                                                alt={`${product.name} ${idx+1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Category Badge */}
                            {product.category&&(
                                <span className="inline-block bg-[#1a472a] text-[#fffcef] text-sm font-medium px-3 py-1 rounded-full">
                                    {product.category.name}
                                </span>
                            )}

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-[#1a472a]">
                                {product.name}
                            </h1>

                            {/* Rating */}
                            {product.avgRating>0&&(
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 ${star<=Math.round(product.avgRating)? 'text-[#1a472a]':'text-[#ccc]'}`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-[#1a472a] text-sm">
                                        {product.avgRating.toFixed(1)} ({product.reviews?.length||0} reviews)
                                    </span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-[#1a472a]">
                                    ₹{finalPrice}
                                </span>
                                {product.discountPrice&&(
                                    <span className="text-xl text-[#66a576] line-through">
                                        ₹{product.price}
                                    </span>
                                )}
                                {discount>0&&(
                                    <span className="bg-[#1a472a] text-[#fffcef] text-sm font-semibold px-2 py-1 rounded">
                                        Save ₹{product.price-product.discountPrice}
                                    </span>
                                )}
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                {product.stockQuantity>0? (
                                    <>
                                        <span className="w-3 h-3 bg-[#1a472a] rounded-full"></span>
                                        <span className="text-[#1a472a] font-medium">In Stock</span>
                                        <span className="text-[#1a472a] text-sm">({product.stockQuantity} available)</span>
                                    </>
                                ):(
                                    <>
                                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                        <span className="text-red-600 font-medium">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {product.stockQuantity>0&&(
                                <div className="flex items-center gap-4">
                                    <span className="text-[#1a472a] font-medium">Quantity:</span>
                                    <div className="flex items-center overflow-hidden border border-[#1a472a] rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity<=1}
                                            className="px-4 py-2 text-lg hover:text-[#fffcef] font-medium hover:bg-[#1a472a] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-2 text-lg font-medium border-x border-[#1a472a]">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity>=product.stockQuantity}
                                            className="px-4 py-2 text-lg font-medium hover:text-[#fffcef] hover:bg-[#1a472a] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart & Buy Now Buttons */}
                            <div className="flex flex-col gap-3">
                                <div className={`grid gap-3 ${isMobile? 'grid-cols-1':'grid-cols-2'}`}>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart||product.stockQuantity===0}
                                        className={`py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${product.stockQuantity>0
                                            ? 'bg-gradient-to-r from-[#1a472a] to-[#1a472a] text-white hover:from-[#163d23] hover:to-[#163d23] shadow-lg hover:shadow-xl'
                                            :'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {addingToCart? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Adding...
                                            </span>
                                        ):product.stockQuantity>0? (
                                            <span className="flex items-center text-[#fffcef] justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add to Cart
                                            </span>
                                        ):'Out of Stock'}
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={addingToCart||product.stockQuantity===0}
                                        className={`py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${product.stockQuantity>0
                                            ? 'bg-gradient-to-r from-[#1a472a] to-[#1a472a] text-[#fffcef] hover:from-[#163d23] hover:to-[#163d23] shadow-lg hover:shadow-xl'
                                            :'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {product.stockQuantity>0? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Buy Now
                                            </span>
                                        ):'Out of Stock'}
                                    </button>
                                </div>

                                {/* Cart Message */}
                                {cartMessage&&(
                                    <p className={`text-center font-medium ${cartMessage.includes('success')? 'text-[#1a472a]':'text-[#ff0000]'}`}>
                                        {cartMessage}
                                    </p>
                                )}
                            </div>

                            {/* SKU & Category Info */}
                            <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-[#1a472a]">
                                <p><span className="font-medium">SKU:</span> {product.sku}</p>
                                {product.category&&(
                                    <p><span className="font-medium">Category:</span> {product.category.name}</p>
                                )}
                                {product.concern&&(
                                    <p><span className="font-medium">Health Concern:</span> {product.concern.name}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section - Desktop View with Tabs, Mobile View with All Sections */}
                {!isMobile? (
                    // Desktop: Show tabs
                    <div className="mt-8 bg-white border-2 border-[#1a472a] border-dashed shadow-lg overflow-hidden">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200 overflow-x-auto">
                            {[
                                {id: 'description', label: 'Description'},
                                {id: 'directions', label: 'How to Use'},
                                {id: 'faqs', label: 'FAQs'},
                                {
                                    id: 'reviews', label: `Reviews (${product.reviews?.filter(r => r.isApproved).length||0})`
                                }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`shrink-0 px-6 py-4 font-medium transition-colors ${activeTab===tab.id
                                        ? 'text-[#1a472a] border-b-2  border-[#1a472a] bg-[#1a472a]/10'
                                        :'text-[#1a472a] hover:text-[#1a472a] hover:bg-[#1a472a]/10'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 lg:p-8">
                            {/* Description Tab */}
                            {activeTab==='description'&&(
                                <div className="prose max-w-none">
                                    <p className="text-[#1a472a] leading-relaxed whitespace-pre-line">
                                        {product.description||'No description available.'}
                                    </p>
                                </div>
                            )}

                            {/* How to Use Tab */}
                            {activeTab==='directions'&&(
                                <div className="space-y-4">
                                    {product.directions?.length>0? (
                                        product.directions.map((direction, idx) => (
                                            <div key={direction.id} className="flex items-center gap-4 p-4 bg-[#1a472a]/10 ">
                                                <div className="shrink-0 w-10 h-10 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center font-bold">
                                                    {direction.stepNumber||idx+1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#1a472a]">{direction.title}</h4>
                                                    <p className="text-[#1a472a] mt-1">{direction.instruction}</p>
                                                </div>
                                            </div>
                                        ))
                                    ):(
                                        <p className="text-[#1a472a] text-center py-8">No usage directions available.</p>
                                    )}
                                </div>
                            )}

                            {/* FAQs Tab */}
                            {activeTab==='faqs'&&(
                                <div className="space-y-4">
                                    {product.faqs?.length>0? (
                                        product.faqs.map((faq) => (
                                            <details key={faq.id} className="group bg-[#1a472a]/10 ">
                                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                                    <span className="font-medium text-[#1a472a]">{faq.question}</span>
                                                    <svg
                                                        className="h-5 w-5 text-[#1a472a] group-open:rotate-180 transition-transform"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </summary>
                                                <div className="px-4 pb-4 text-[#1a472a]">
                                                    {faq.answer}
                                                </div>
                                            </details>
                                        ))
                                    ):(
                                        <p className="text-[#1a472a] text-center py-8">No FAQs available.</p>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab==='reviews'&&(
                                <div className="space-y-6">
                                    {/* Review Form Section */}
                                    {user&&(
                                        <div className="space-y-4">
                                            {!showReviewForm&&!userReview?.id&&(
                                                <div className="text-center">
                                                    <button
                                                        onClick={handleWriteReview}
                                                        className="bg-[#1a472a] text-[#fffcef] px-6 py-3 rounded-lg hover:bg-[#004411] transition-colors font-medium"
                                                    >
                                                        Write a Review
                                                    </button>
                                                    <p className="text-sm text-[#1a472a]/70 mt-2">
                                                        Share your experience with this product
                                                    </p>
                                                </div>
                                            )}

                                            {showReviewForm&&(
                                                <ReviewForm
                                                    productId={product.id}
                                                    existingReview={userReview}
                                                    onSuccess={handleReviewUpdated}
                                                    onCancel={handleCancelReview}
                                                />
                                            )}

                                            {userReview?.id&&!showReviewForm&&(
                                                <div className="bg-[#1a472a]/10 border border-[#1a472a] rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <svg
                                                                        key={star}
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={`h-4 w-4 ${star<=userReview.rating? 'text-yellow-400':'text-gray-300'}`}
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-[#1a472a] font-medium">
                                                                Your Review
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-[#1a472a]/70">
                                                            {new Date(userReview.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#1a472a]">{userReview.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Login Prompt for Non-Users */}
                                    {!user&&(
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                            <p className="text-gray-600 mb-4">Please login to write a review</p>
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="bg-[#1a472a] text-white px-6 py-2 rounded-lg hover:bg-[#004411] transition-colors font-medium"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <ReviewList
                                        productId={product.id}
                                        reviews={Array.isArray(reviews)? reviews:[]}
                                        currentUser={user}
                                        onReviewUpdated={handleReviewUpdated}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ):(
                    // Mobile: Show all sections one by one
                    <div className="mt-8 space-y-8">
                        {/* Description Section */}
                        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#1a472a] mb-4">Description</h2>
                                <div className="prose max-w-none">
                                    <p className="text-[#1a472a] leading-relaxed whitespace-pre-line">
                                        {product.description||'No description available.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How to Use Section */}
                        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#1a472a] mb-4">How to Use</h2>
                                <div className="space-y-4">
                                    {product.directions?.length>0? (
                                        product.directions.map((direction, idx) => (
                                            <div key={direction.id} className="flex items-center gap-4 p-4 bg-[#1a472a]/10 ">
                                                <div className="shrink-0 w-10 h-10 bg-[#1a472a] text-[#fffcef] rounded-full flex items-center justify-center font-bold">
                                                    {direction.stepNumber||idx+1}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[#1a472a]">{direction.title}</h4>
                                                    <p className="text-[#1a472a] mt-1">{direction.instruction}</p>
                                                </div>
                                            </div>
                                        ))
                                    ):(
                                        <p className="text-[#1a472a] text-center py-8">No usage directions available.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* FAQs Section */}
                        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#1a472a] mb-4">FAQs</h2>
                                <div className="space-y-4">
                                    {product.faqs?.length>0? (
                                        product.faqs.map((faq) => (
                                            <details key={faq.id} className="group bg-[#1a472a]/10 ">
                                                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                                                    <span className="font-medium text-[#1a472a]">{faq.question}</span>
                                                    <svg
                                                        className="h-5 w-5 text-[#1a472a] group-open:rotate-180 transition-transform"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </summary>
                                                <div className="px-4 pb-4 text-[#1a472a]">
                                                    {faq.answer}
                                                </div>
                                            </details>
                                        ))
                                    ):(
                                        <p className="text-[#1a472a] text-center py-8">No FAQs available.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white border-2 border-[#1a472a] border-dashed shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#1a472a] mb-4">
                                    Reviews ({product.reviews?.filter(r => r.isApproved).length||0})
                                </h2>
                                <div className="space-y-6">
                                    {/* Review Form Section */}
                                    {user&&(
                                        <div className="space-y-4">
                                            {!showReviewForm&&!userReview?.id&&(
                                                <div className="text-center">
                                                    <button
                                                        onClick={handleWriteReview}
                                                        className="bg-[#1a472a] text-[#fffcef] px-6 py-3 rounded-lg hover:bg-[#004411] transition-colors font-medium"
                                                    >
                                                        Write a Review
                                                    </button>
                                                    <p className="text-sm text-[#1a472a]/70 mt-2">
                                                        Share your experience with this product
                                                    </p>
                                                </div>
                                            )}

                                            {showReviewForm&&(
                                                <ReviewForm
                                                    productId={product.id}
                                                    existingReview={userReview}
                                                    onSuccess={handleReviewUpdated}
                                                    onCancel={handleCancelReview}
                                                />
                                            )}

                                            {userReview?.id&&!showReviewForm&&(
                                                <div className="bg-[#1a472a]/10 border border-[#1a472a] rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <svg
                                                                        key={star}
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className={`h-4 w-4 ${star<=userReview.rating? 'text-yellow-400':'text-gray-300'}`}
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-[#1a472a] font-medium">
                                                                Your Review
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-[#1a472a]/70">
                                                            {new Date(userReview.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-[#1a472a]">{userReview.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Login Prompt for Non-Users */}
                                    {!user&&(
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                            <p className="text-gray-600 mb-4">Please login to write a review</p>
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="bg-[#1a472a] text-white px-6 py-2 rounded-lg hover:bg-[#004411] transition-colors font-medium"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    )}

                                    {/* Reviews List */}
                                    <ReviewList
                                        productId={product.id}
                                        reviews={Array.isArray(reviews)? reviews:[]}
                                        currentUser={user}
                                        onReviewUpdated={handleReviewUpdated}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDetail