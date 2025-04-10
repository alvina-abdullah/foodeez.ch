import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import slugify from 'slugify';
import { Star, MapPin } from 'lucide-react';
import { SocialLinks } from '../../../components/core/SocialLinks';

// Helper function to generate slug for business URLs
const generateSlug = (name: string, id: number) => {
  return `${slugify(name || '', { lower: true, strict: true })}-${id}`;
};

interface Business {
  BUSINESS_ID: number;
  BUSINESS_NAME?: string | null;
  IMAGE_URL?: string | null;
  ADDRESS_TOWN?: string | null;
  DESCRIPTION?: string | null;
  GOOGLE_RATING?: string | null;
  FACEBOOK_LINK?: string | null;
  INSTA_LINK?: string | null;
  WHATSAPP_LINK?: string | null;
  TWITTER_LINK?: string | null;
  [key: string]: any; // To allow for other properties
}

interface BusinessCardProps {
  business: Business;
  showDescription?: boolean;
  showRating?: boolean;
  showSocial?: boolean;
  className?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  showDescription = true, 
  showRating = true,
  showSocial = true,
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
    FACEBOOK_LINK,
    INSTA_LINK,
    WHATSAPP_LINK,
    TWITTER_LINK,
  } = business;

  const slug = generateSlug(BUSINESS_NAME || 'business', BUSINESS_ID);
  const rating = GOOGLE_RATING ? parseFloat(GOOGLE_RATING) : null;

  // Prepare social links for the component
  const socialLinks = {
    facebook: FACEBOOK_LINK || null,
    instagram: INSTA_LINK || null,
    twitter: TWITTER_LINK || null,
    whatsapp: WHATSAPP_LINK || null,
  };

  // Check if any social links exist
  const hasSocialLinks = showSocial && Object.values(socialLinks).some(link => !!link);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/businesses/${slug}`} className="block">
        <div className="relative h-48 w-full bg-gray-200">
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
            <Link href={`/businesses/${slug}`} className="block hover:text-primary-600 transition-colors">
              <h3 className="text-lg font-bold text-secondary-900 truncate">
                {BUSINESS_NAME || 'Unnamed Business'}
              </h3>
            </Link>
            
            {/* Location */}
            {ADDRESS_TOWN && (
              <div className="mt-1 text-sm text-secondary-600 flex items-center">
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
          <p className="mt-2 text-sm text-secondary-600 line-clamp-2">
            {DESCRIPTION}
          </p>
        )}
        
        {/* Social Links */}
        {hasSocialLinks && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <SocialLinks 
              {...socialLinks}
              size="sm"
              variant="default"
              color="default"
              className="flex-wrap gap-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCard; 