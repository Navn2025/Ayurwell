import React from 'react'

const TrendingCard=({name, image, price, originalPrice, onClick}) =>
{
    const discount=originalPrice? Math.round(((originalPrice-price)/originalPrice)*100):0

    return (
        <div
            className="bg-white max-w-80 border-2 border-[#1a472a] shadow-md overflow-hidden cursor-pointer p-2 group hover:shadow-xl transition-all duration-300 "
            onClick={onClick}
        >
            <div className='h-full w-full border-2 border-dashed border-[#1a472a]'>

                {/* Image Container */}
                <div className="relative h-64 md:h-56 lg:h-64  overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className="w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Trending Badge */}
                    <div className="absolute top-3 left-3 bg-gradient-to-r  group-hover:text-[#fff6cf] from-[#1a472a] to-[#004411] text-[#fffcef] text-xs font-bold px-3 py-1  flex items-center gap-1 shadow-md">

                        Trending
                    </div>
                    {/* Discount Badge */}
                    {discount>0&&(
                        <div className="absolute top-3 right-3 group-hover:text-[#fff6cf] bg-[#004411] text-[#fffcef] text-xs font-bold px-2 py-1 ">
                            {discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 bg-[#1a472a]">
                    <h3 className="font-semibold text-[#fffcef] text-sm md:text-base line-clamp-2 mb-2 group-hover:text-[#fff6cf] transition-colors duration-300">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#fffcef] group-hover:text-[#fff6cf]">₹{price}</span>
                        {originalPrice&&originalPrice>price&&(
                            <span className="text-sm text-[#dfddd0] group-hover:text-[#d1cbaf] line-through">₹{originalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendingCard
