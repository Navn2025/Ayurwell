import React from 'react'

const CategoryCard=({name, image, onClick}) =>
{
    return (
        <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={onClick}
        >
            {/* Card Container with Border */}
            <div className="w-64 h-48 md:w-72 md:h-52 lg:w-80 lg:h-56  border-2  shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-[#004411] overflow-hidden p-1">
                <div className='border-2 border-dashed border-[#1a472a] h-full w-full overflow-hidden'>

                    <div className="w-full h-full flex items-center justify-center bg-white ">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full group-hover:scale-105 transition-transform duration-300 object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Name Below - Underlined like reference */}
            <p className="mt-4 text-base md:text-lg font-medium text-[#1a472a] text-center group-hover:underline decoration-[#1a472a] hover:decoration-[#004411] group-hover:text-[#004411] transition-colors duration-300">
                {name}
            </p>
        </div>
    )
}

export default CategoryCard
