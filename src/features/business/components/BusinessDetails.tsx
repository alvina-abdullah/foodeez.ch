// components/BusinessDetails.tsx

import { business } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Globe, MapPin, Star } from 'lucide-react';
import Badge from '../../../components/core/Badge';
import { SocialLinks } from '../../../components/core/SocialLinks';
import { ReviewsSection } from './ReviewsSection';

interface BusinessDetailsProps {
  business: business;
}

export function BusinessDetails({ business }: BusinessDetailsProps) {
  const {
    BUSINESS_ID,
    BUSINESS_NAME,
    IMAGE_URL,
    DESCRIPTION,
    ADDRESS_STREET,
    ADDRESS_TOWN,
    ADDRESS_COUNTRY,
    PHONE_NUMBER,
    WEB_ADDRESS,
    FACEBOOK_LINK,
    INSTA_LINK,
    GOOGLE_RATING,
    WHATSAPP_LINK,
    TWITTER_LINK,
    LINKEDIN_LINK,
    YOUTUBE_LINK,
    TIKTOK_LINK,
  } = business;

  // Prepare social links for the component
  const socialLinks = {
    facebook: FACEBOOK_LINK,
    instagram: INSTA_LINK,
    whatsapp: WHATSAPP_LINK,
    twitter: TWITTER_LINK,
    linkedin: LINKEDIN_LINK,
    youtube: YOUTUBE_LINK,
    tiktok: TIKTOK_LINK,
    website: WEB_ADDRESS,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24"> {/* Added pt-24 for navbar spacing */}
      <div className="mb-6">
        <Link 
          href="/businesses" 
          className="inline-flex items-center text-primary-600 hover:text-primary-800 transition-colors group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1 transform transition-transform group-hover:-translate-x-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Businesses
        </Link>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-[99%]">
        {IMAGE_URL ? (
          <Image
            src={IMAGE_URL}
            alt={BUSINESS_NAME || 'Business Image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image Available</span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="mt-8">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            {BUSINESS_NAME || 'Unnamed Business'}
          </h1>
          {GOOGLE_RATING && (
            <Badge variant="accent" className="flex items-center gap-1.5 px-4 py-2 rounded-full">
              <Star className="w-5 h-5" fill="currentColor" />
              <span className="font-semibold">
                {parseFloat(GOOGLE_RATING).toFixed(1)}
              </span>
            </Badge>
          )}
        </div>

        {/* Description */}
        {DESCRIPTION && (
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {DESCRIPTION}
          </p>
        )}

        {/* Contact Info */}
        <div className="space-y-4 mb-8">
          {(ADDRESS_STREET || ADDRESS_TOWN) && (
            <div className="flex items-start gap-3 text-gray-700">
              <MapPin className="w-6 h-6 flex-shrink-0 text-primary-600" />
              <p className="text-lg">
                {[ADDRESS_STREET, ADDRESS_TOWN, ADDRESS_COUNTRY]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {PHONE_NUMBER && (
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-6 h-6 flex-shrink-0 text-primary-600" />
              <a 
                href={`tel:${PHONE_NUMBER}`} 
                className="text-lg hover:text-primary-600 transition-colors"
              >
                {PHONE_NUMBER}
              </a>
            </div>
          )}

          {WEB_ADDRESS && (
            <div className="flex items-center gap-3 text-gray-700">
              <Globe className="w-6 h-6 flex-shrink-0 text-primary-600" />
              <a
                href={WEB_ADDRESS}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:text-primary-600 transition-colors"
              >
                {WEB_ADDRESS.replace(/^(https?:\/\/)?(www\.)?/, '')}
              </a>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-secondary-800 mb-3">Connect with {BUSINESS_NAME}</h3>
          <SocialLinks
            {...socialLinks}
            variant="circle"
            color="colored"
            size="md"
            className="flex-wrap"
          />
        </div>

        {/* Reviews Section */}
        <div className="pt-8 border-t border-gray-200">
          <ReviewsSection businessId={BUSINESS_ID} />
        </div>
      </div>
    </div>
  );
}