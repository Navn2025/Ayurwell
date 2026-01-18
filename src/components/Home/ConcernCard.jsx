import React from 'react'

const ConcernCard=({name, image, onClick}) =>
{
    return (
        <div
            className="flex font-exo flex-col items-center cursor-pointer group"
            onClick={onClick}
        >
            {/* Spherical Image Container - Bigger */}
            <div className="w-40 h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 p-1 rounded-full overflow-hidden shadow-lg border-4 border-white hover:border-[#1a472a] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl bg-gray-100">
                <div className='w-full h-full flex items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#1a472a] '>

                    <img
                        src={image}
                        alt={name}
                        className="w-full  object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* Name Below */}
            <p className="mt-4 text-base md:text-lg font-medium text-[#007120] text-center group-hover:text-[#004411] transition-colors duration-300">
                {name}
            </p>
        </div>
    )
}

export default ConcernCard