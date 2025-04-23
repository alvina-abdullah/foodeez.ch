import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Mail, Calendar } from 'lucide-react';
import { SocialLinks } from '../../../components/core/SocialLinks';
import { generateSlug } from '@/lib/utils/genSlug';

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
  WEB_ADDRESS?: string | null;
  EMAIL_ADDRESS?: string | null;
  [key: string]: any; // To allow for other properties
}

interface BusinessCardProps {
  business: Business;
  showDescription?: boolean;
  showRating?: boolean;
  showSocial?: boolean;
  className?: string;
}

// Helper to ensure URLs are properly formatted
const formatUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  
  // Return null for empty URLs or placeholder values like "/"
  if (url === "" || url === "/" || url === "0") return null;
  
  // If URL doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  
  return url;
};

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
    WEB_ADDRESS,
    EMAIL_ADDRESS,
  } = business;

  console.log('Debug - Business ID:', BUSINESS_ID, 'Type:', typeof BUSINESS_ID);
  
  // Convert BUSINESS_ID to number if it's a string or ensure it's a valid number
  const businessId = typeof BUSINESS_ID === 'string' ? parseInt(BUSINESS_ID, 10) : 
                    (typeof BUSINESS_ID === 'number' ? BUSINESS_ID : 0);
  
  const slug = generateSlug(BUSINESS_NAME || 'business', businessId);
  console.log('Generated slug:', slug);
  
  const rating = GOOGLE_RATING ? parseFloat(GOOGLE_RATING) : null;

  // Prepare social links for the component with properly formatted URLs
  const socialLinks = {
    facebook: formatUrl(FACEBOOK_LINK),
    instagram: formatUrl(INSTA_LINK),
    twitter: formatUrl(TWITTER_LINK),
    whatsapp: formatUrl(WHATSAPP_LINK),
    website: formatUrl(WEB_ADDRESS),
  };

  // Check if any social links or email exists
  const hasSocialLinks = showSocial && (Object.values(socialLinks).some(link => !!link) || EMAIL_ADDRESS);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <Link href={`/business/${slug || `business-${businessId}`}`} className="block">
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
            <Link href={`/business/${slug || `business-${businessId}`}`} className="block hover:text-primary-600 transition-colors">
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
            <div className="flex flex-wrap gap-2 items-center">
              <SocialLinks 
                {...socialLinks}
                size="sm"
                variant="circle"
                color="colored"
                className="flex-wrap gap-2"
              />
              
              {/* Email Icon (if available) */}
              {EMAIL_ADDRESS && (
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-200 flex items-center justify-center rounded-full border border-blue-500 w-6 h-6 group"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4 text-blue-500" />
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Table Reservation Button - always show this */}
        <div className="mt-4">
          <Link 
            href={`/business/${slug || `business-${businessId}`}/reservation`} 
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors text-sm font-medium shadow-sm"
          >
            <Calendar size={16} />
            <span>Reserve table</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard; 