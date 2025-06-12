import { CheckCircle2, Leaf, Sprout } from 'lucide-react';
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
          {HALAL == 1 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <CheckCircle2 size={12} className="mr-1" />
                Halal 
              </span>
            )}
            {VEGAN == 1 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Leaf size={12} className="mr-1" />
                Vegan
              </span>
            )}
            {VEGETARIAN == 1 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                <Sprout size={12} className="mr-1" />
                Vegetarian
              </span>
            )}
        </div>

  )
}

export default ResturantProfilePageHeader