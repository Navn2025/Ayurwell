import React from 'react'

const BestSellingCard=({name, image, price, originalPrice, soldCount, onClick}) =>
{
    const discount=originalPrice? Math.round(((originalPrice-price)/originalPrice)*100):0

    return (
        <div
            className="bg-white max-w-80 flex  shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300  border-[#1a472a] border-2  p-2"
            onClick={onClick}
        >
            <div className='h-full w-full  border-2 border-dashed border-[#1a472a]'>

                {/* Image Container */}
                <div className="relative h-64 md:h-56 lg:h-64  overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        className=" w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Best Seller Badge */}
                    <div className="absolute top-3 left-3 group-hover:text-[#fff6cf] bg-gradient-to-r from-[#1a472a] to-[#004411] text-[#fffcef] text-xs font-bold px-3 py-1  flex items-center gap-1 shadow-md">

                        Best Seller
                    </div>
                    {/* Discount Badge */}
                    {discount>0&&(
                        <div className="absolute top-3 right-3 group-hover:text-[#fff6cf] bg-[#1a472a] text-[#fffcef] text-xs font-bold px-2 py-1 ">
                            {discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 border-t-2 border-dashed border-[#fffcef] bg-[#1a472a]">
                    <h3 className="font-semibold text-[#fffcef] text-sm md:text-base line-clamp-2 mb-2 group-hover:text-[#fff6cf] transition-colors duration-300">
                        {name}
                    </h3>

                    {/* Sold Count */}
                    {soldCount>0&&(
                        <div className="flex items-center gap-1 text-xs text-[#fffcef] group-hover:text-[#fff6cf] mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#fffcef] group-hover:text-[#fff6cf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span>{soldCount}+ sold</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#fffcef] group-hover:text-[#fff6cf]">₹{price}</span>
                        {originalPrice&&originalPrice>price&&(
                            <span className="text-sm text-[#d1cbaf] group-hover:text-[#d1cbaf] line-through">₹{originalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BestSellingCard
