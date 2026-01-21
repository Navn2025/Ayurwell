import React, {useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {getAllConcerns} from '../../api/concern.api'
import {getAllCategories} from '../../api/category.api'
import {getTrendingProducts, getBestSellingProducts, getProductsByCategorySlug} from '../../api/product.api'
import ConcernCard from '../../components/Home/ConcernCard'
import CategoryCard from '../../components/Home/CategoryCard'
import TrendingCard from '../../components/Home/TrendingCard'
import BestSellingCard from '../../components/Home/BestSellingCard'
import CategoryProductCard from '../../components/Home/CategoryProductCard'
import heroImage from '../../assets/herobg.png'
import heroVideo from '../../assets/farmer-video.mp4'
import img from '../../assets/hero-middle.png'
const Home=() =>
{
    const [concerns, setConcerns]=useState([])
    const [categories, setCategories]=useState([])
    const [trendingProducts, setTrendingProducts]=useState([])
    const [bestSellingProducts, setBestSellingProducts]=useState([])
    const [pujanSamagriProducts, setPujanSamagriProducts]=useState([])
    const [loadingConcerns, setLoadingConcerns]=useState(true)
    const [loadingCategories, setLoadingCategories]=useState(true)
    const [loadingTrending, setLoadingTrending]=useState(true)
    const [loadingBestSelling, setLoadingBestSelling]=useState(true)
    const [loadingPujanSamagri, setLoadingPujanSamagri]=useState(true)
    const navigate=useNavigate()
    const location=useLocation();
    const videoRef=useRef(null);
    const [isPlaying, setIsPlaying]=useState(false);

    const togglePlay=() =>
    {
        const video=videoRef.current;
        if (!video) return;

        if (video.paused)
        {
            video.play();
            setIsPlaying(true);
        } else
        {
            video.pause();
            setIsPlaying(false);
        }
    };

    useEffect(() =>
    {
        const params=new URLSearchParams(location.search);
        const scrollTarget=params.get("scroll");

        if (scrollTarget==="categories")
        {
            const el=document.getElementById("categories-section");
            if (el)
            {
                setTimeout(() =>
                {
                    el.scrollIntoView({behavior: "smooth", block: "start"});
                }, 100); // wait for render
            }
        }
    }, [location]);

    useEffect(() =>
    {
        const fetchConcerns=async () =>
        {
            try
            {
                const response=await getAllConcerns()
                console.log(response)
                setConcerns(response.concerns||response.data||[])
            } catch (error)
            {
                console.error('Error fetching concerns:', error)
            } finally
            {
                setLoadingConcerns(false)
            }
        }

        // Only fetch if concerns are not already loaded and not currently loading
        if (!concerns.length && loadingConcerns) {
            fetchConcerns()
        } else if (concerns.length) {
            setLoadingConcerns(false)
        }

        const fetchCategories=async () =>
        {
            try
            {
                const response=await getAllCategories()
                // Flatten the category tree for display
                const flattenCategories=(cats) =>
                {
                    let result=[]
                    cats?.forEach(cat =>
                    {
                        result.push(cat)
                        if (cat.children&&cat.children.length>0)
                        {
                            result=[...result, ...flattenCategories(cat.children)]
                        }
                    })
                    return result
                }
                const allCategories=flattenCategories(response.categories||response||[])
                setCategories(allCategories)
            } catch (error)
            {
                console.error('Error fetching categories:', error)
            } finally
            {
                setLoadingCategories(false)
            }
        }

        const fetchTrendingProducts=async () =>
        {
            try
            {
                const response=await getTrendingProducts()
                const products=response.products||response.data||response||[]
                setTrendingProducts(products)
            } catch (error)
            {
                console.error('Error fetching trending products:', error)
            } finally
            {
                setLoadingTrending(false)
            }
        }

        const fetchBestSellingProducts=async () =>
        {
            try
            {
                const response=await getBestSellingProducts()
                const products=response.products||response.data||response||[]
                setBestSellingProducts(products)
            } catch (error)
            {
                console.error('Error fetching best selling products:', error)
            } finally
            {
                setLoadingBestSelling(false)
            }
        }

        const fetchPujanSamagriProducts=async () =>
        {
            try
            {
                const response=await getProductsByCategorySlug('pujan-samagri', 4)
                const products=response.products||response.data||response||[]
                setPujanSamagriProducts(products)
            } catch (error)
            {
                // Category might not exist - this is expected, just set empty array
                if (error.response?.status===404)
                {
                    setPujanSamagriProducts([])
                } else
                {
                    console.error('Error fetching pujan samagri products:', error)
                }
            } finally
            {
                setLoadingPujanSamagri(false)
            }
        }

        fetchConcerns()
        if (!categories.length && loadingCategories) fetchCategories()
        if (!trendingProducts.length && loadingTrending) fetchTrendingProducts()
        if (!bestSellingProducts.length && loadingBestSelling) fetchBestSellingProducts()
        if (!pujanSamagriProducts.length && loadingPujanSamagri) fetchPujanSamagriProducts()
    }, [])

    const handleConcernClick=(concern) =>
    {
        navigate(`/concern/${concern.slug||concern.id}`)
    }

    const handleCategoryClick=(category) =>
    {
        navigate(`/category/${category.slug||category.id}`)
    }

    const handleProductClick=(product) =>
    {
        navigate(`/product/${product.slug||product.id}`)
    }

    return (
        <div className="min-h-screen bg-[#fffcef]">
            <section className='h-fit w-full bg-home-hero bg-cover bg-center flex items-center justify-center'>
                <img className='w-full object-cover' src={heroImage} alt="Hero" />

            </section>
            {/* Concerns Section */}
            <section className="py-12 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-exo md:text-3xl font-bold text-[#1a472a] mb-8">
                        Shop by Health Concern
                    </h2>

                    {loadingConcerns? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
                        </div>
                    ):(
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-10">
                                {concerns.map((concern) => (
                                    <ConcernCard
                                        key={concern.id}
                                        name={concern.name}
                                        image={concern.imageUrl||'/placeholder.png'}
                                        onClick={() => handleConcernClick(concern)}
                                    />
                                ))}
                            </div>

                        </>
                    )}

                    {!loadingConcerns&&concerns.length===0&&(
                        <p className="text-center text-[#1a472a] py-8">
                            No concerns available at the moment.
                        </p>
                    )}
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories-section" className="py-12 px-4 font-exo md:px-8 lg:px-16 bg-[#fffcef]">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-exo md:text-3xl font-bold text-[#1a472a] mb-8">
                        Shop by Category
                    </h2>

                    {loadingCategories? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
                        </div>
                    ):(
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                                {categories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        name={category.name}
                                        image={category.imageUrl||'/placeholder.png'}
                                        onClick={() => handleCategoryClick(category)}
                                    />
                                ))}
                            </div>

                        </>
                    )}

                    {!loadingCategories&&categories.length===0&&(
                        <p className="text-center text-[#1a472a] py-8">
                            No categories available at the moment.
                        </p>
                    )}
                </div>
            </section>

            {/* Trending Products Section */}
            <section className="py-12 px-4 font-exo md:px-8 lg:px-16 bg-[#fffcef]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-8">

                        <h2 className="text-2xl font-exo md:text-3xl w-full font-bold text-left text-[#1a472a]">
                            Trending Now
                        </h2>
                    </div>

                    {loadingTrending? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
                        </div>
                    ):(
                        <>
                            <div className="grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-10">
                                {trendingProducts.map((product) =>
                                {

                                    return (
                                        <TrendingCard
                                            key={product.id}
                                            name={product.name}
                                            image={product.images?.[0]?.imageUrl||'/placeholder.png'}
                                            price={product.discountPrice}
                                            originalPrice={product.price}
                                            onClick={() => handleProductClick(product)}
                                        />
                                    )
                                })
                                }
                            </div>

                        </>
                    )}

                    {!loadingTrending&&trendingProducts.length===0&&(
                        <p className="text-center text-[#1a472a] py-8">
                            No trending products at the moment.
                        </p>
                    )}
                </div>
            </section>


            <section className=' font-exo flex items-center justify-center bg-[#1a472a]'>
                <div className='h-full flex flex-col gap-2 relative w-full'>
                    <h1 className='text-3xl px-6 pt-6 text-[#fffcef]'>Powered By Farmers</h1>

                    <div className="relative p-6 h-full w-full">
                        <video
                            ref={videoRef}
                            className="h-full w-full  object-cover"
                            src={heroVideo}
                            loop
                            muted
                            playsInline
                        />

                        {/* Center Play/Pause Button */}
                        <button
                            onClick={togglePlay}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="bg-black/50 text-white p-6 rounded-full text-2xl hover:scale-110 transition">
                                {isPlaying? "❚❚":"▶"}
                            </div>
                        </button>
                    </div>
                </div>
            </section>



            {/* Best Selling Herbs Section */}
            <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#fffcef] font-exo">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-8">

                        <h2 className="text-2xl md:text-3xl font-bold w-full  text-[#1a472a]">
                            Best Selling Herbs
                        </h2>
                    </div>

                    {loadingBestSelling? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
                        </div>
                    ):(
                        <>
                            <div className="grid grid-cols-1 place-items-center justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-10">
                                {bestSellingProducts.map((product) => (
                                    <BestSellingCard
                                        key={product.id}
                                        name={product.name}
                                        image={product.images?.[0]?.imageUrl||'/placeholder.png'}
                                        price={product.discountPrice||product.price}
                                        originalPrice={product.discountPrice? product.price:null}
                                        soldCount={product.soldCount||0}
                                        onClick={() => handleProductClick(product)}
                                    />
                                ))}
                            </div>

                        </>
                    )}

                    {!loadingBestSelling&&bestSellingProducts.length===0&&(
                        <p className="text-center text-[#1a472a] py-8">
                            No best selling products at the moment.
                        </p>
                    )}
                </div>
            </section>
            <section className='h-fit '>
                <img className='w-full  h-full object-cover' src={img} alt="Hero" />
            </section>

            {/* Pujan Samagri Section */}
            <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#fffcef] font-exo">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-8">

                        <h2 className="text-2xl md:text-3xl font-bold w-full text-[#1a472a]">
                            Pujan Samagri
                        </h2>
                    </div>

                    {loadingPujanSamagri? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a472a]"></div>
                        </div>
                    ):(
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8 md:gap-10">
                            {pujanSamagriProducts.map((product) => (
                                <CategoryProductCard
                                    key={product.id}
                                    name={product.name}
                                    image={product.images?.[0]?.imageUrl||'/placeholder.png'}
                                    price={product.discountPrice||product.price}
                                    originalPrice={product.discountPrice? product.price:null}
                                    badgeText="Pujan Samagri"

                                    onClick={() => handleProductClick(product)}
                                />
                            ))}
                        </div>
                    )}

                    {!loadingPujanSamagri&&pujanSamagriProducts.length===0&&(
                        <p className="text-center text-[#1a472a] py-8">
                            No pujan samagri products available at the moment.
                        </p>
                    )}

                    {/* View All Button */}
                    {pujanSamagriProducts.length>0&&(
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => navigate('/category/pujan-samagri')}
                                className="bg-[#1a472a] text-[#fffcef] px-8 py-3 rounded-lg font-semibold hover:bg-[#004411] transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                View All Pujan Samagri →
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Home