import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { generateSlug } from '@/lib/utils/genSlug';

interface Business {
  BUSINESS_ID: number;
  BUSINESS_NAME?: string | null;
  IMAGE_URL?: string | null;
  ADDRESS_TOWN?: string | null;
  DESCRIPTION?: string | null;
  GOOGLE_RATING?: string | null;
  [key: string]: any; // To allow for other properties
}

interface BusinessCardProps {
  business: Business;
  showDescription?: boolean;
  showRating?: boolean;
  className?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  showDescription = true, 
  showRating = true,
  className = '',
}) => {
  // Extract properties
  const {
    BUSINESS_ID,
    BUSINESS_NAME,
    IMAGE_URL,
    ADDRESS_TOWN,
    DESCRIPTION,
    GOOGLE_RATING,
  } = business;

  console.log('BusinessCardSimple - Business ID:', BUSINESS_ID, 'Type:', typeof BUSINESS_ID);
  
  // Convert BUSINESS_ID to number if it's a string or ensure it's a valid number
  const businessId = typeof BUSINESS_ID === 'string' ? parseInt(BUSINESS_ID, 10) : 
                    (typeof BUSINESS_ID === 'number' ? BUSINESS_ID : 0);
  
  const slug = generateSlug(BUSINESS_NAME || 'business', businessId);
  console.log('BusinessCardSimple - Generated slug:', slug);
  
  const rating = GOOGLE_RATING ? parseFloat(GOOGLE_RATING) : null;

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      <Link href={`/business/${slug || `business-${businessId}`}`} className="block">
        <div className="relative h-40 w-full bg-gray-200">
          {IMAGE_URL ? (
            <Image
              src={IMAGE_URL}
              alt={BUSINESS_NAME || 'Business'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500 font-medium">
                {BUSINESS_NAME ? BUSINESS_NAME.charAt(0) : 'B'}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/business/${slug || `business-${businessId}`}`} className="block hover:text-primary-600 transition-colors">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {BUSINESS_NAME || 'Unnamed Business'}
              </h3>
            </Link>
            
            {/* Location */}
            {ADDRESS_TOWN && (
              <div className="mt-1 text-sm text-gray-600 flex items-center">
                <MapPin size={14} className="mr-1 text-gray-400" />
                <span>{ADDRESS_TOWN}</span>
              </div>
            )}
          </div>
          
          {/* Rating */}
          {showRating && rating && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star size={16} className="text-yellow-500" fill="currentColor" />
              <span className="ml-1 text-sm font-medium text-yellow-700">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Description */}
        {showDescription && DESCRIPTION && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {DESCRIPTION}
          </p>
        )}
      </div>
    </div>
  );
}; 