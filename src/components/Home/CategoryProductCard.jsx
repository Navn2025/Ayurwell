import React from 'react'

const CategoryProductCard=({name, image, price, originalPrice, onClick, badgeText}) =>
{
    const discount=originalPrice? Math.round(((originalPrice-price)/originalPrice)*100):0




    return (
        <div
            className="bg-white flex flex-col items-center  shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-2 border-[#1a472a] p-2"
            onClick={onClick}
        >
            {/* Image Container */}
            <div className='h-full w-full border-2 border-dashed border-[#1a472a]'>
                <div className={`relative h-48 md:h-56 lg:h-64  overflow-hidden`}>
                    <img
                        src={image}
                        alt={name}
                        className="w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Category Badge */}
                    {badgeText&&(
                        <div className={`absolute top-3 group-hover:text-[#fff6cf] left-3 bg-linear-to-r from-[#1a472a] to-[#004411] text-[#fffcef] text-xs font-bold px-3 py-1  flex items-center gap-1 shadow-md`}>

                            {badgeText}
                        </div>
                    )}
                    {/* Discount Badge */}
                    {discount>0&&(
                        <div className="absolute top-3 right-3 bg-[#1a472a] group-hover:text-[#fff6cf] text-[#fffcef] text-xs font-bold px-2 py-1 ">
                            {discount}% OFF
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 bg-[#1a472a] border-t-2 border-dashed border-[#fffcef]">
                    <h3 className="font-semibold group-hover:text-[#fff6cf] text-[#fffcef] text-sm md:text-base line-clamp-2 mb-3 transition-colors duration-300">
                        {name}
                    </h3>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold group-hover:text-[#fff6cf] text-[#fffcef]">₹{price}</span>
                        {originalPrice&&originalPrice>price&&(
                            <span className="text-sm text-[#d1cbaf] group-hover:text-[#d1cbaf] line-through">₹{originalPrice}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryProductCard
