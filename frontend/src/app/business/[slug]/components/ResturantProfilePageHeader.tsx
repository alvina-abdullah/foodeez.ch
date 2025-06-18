import Image from 'next/image';
import React from 'react'

interface ResturantProfilePageHeaderProps {
    BUSINESS_NAME: string;
    CITY_NAME?: string;
    HALAL?: number;
    VEGAN?: number;
    VEGETARIAN?: number;
    }

const ResturantProfilePageHeader = ({BUSINESS_NAME , CITY_NAME , HALAL,VEGAN, VEGETARIAN} : ResturantProfilePageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="sub-heading">
            {BUSINESS_NAME}
            {CITY_NAME && (
              <>
                {" "}
                • <span className="text-secondary">{CITY_NAME}</span>
              </>
            )}
          </h1>
         <div className='flex items-center gap-2 mt-2 md:mt-0'>
         {HALAL == 1 && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-lg  font-medium bg-green-100 text-green-800 border border-green-200">
                <Image
                src='/images/foodtypes/halal.png'
                alt='halal'
                width={30}
                height={30}
                />
                Halal 
              </span>
            )}
            {VEGAN == 1 && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-lg font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                 <Image
                src='/images/foodtypes/vegan.png'
                alt='vegan'
                width={30}
                height={30}
                />
                Vegan
              </span>
            )}
            {VEGETARIAN == 1 && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-lg font-medium bg-teal-100 text-teal-800 border border-teal-200">
                <Image
                src='/images/foodtypes/vegetarian.png'
                alt='halal'
                width={30}
                height={30}
                />
                Vegetarian
              </span>
            )}
         </div>
        </div>

  )
}

export default ResturantProfilePageHeader