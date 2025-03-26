'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { ExternalLink, Calendar, Star, MessageSquare } from 'lucide-react';
import { business } from '@prisma/client';
import Badge from '../core/Badge';
import slugify from 'slugify';

// Helper function to generate slug
const generateSlug = (name: string, id: number) => {
  return `${slugify(name || '', { lower: true, strict: true })}-${id}`;
};

// BusinessCard variants
const businessCardVariants = cva(
  'overflow-hidden transition-all duration-300 bg-white',
  {
    variants: {
      size: {
        sm: 'max-w-xs',
        md: 'max-w-sm',
        lg: 'max-w-md',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        grow: 'hover:scale-[1.02] hover:shadow-lg',
      },
    },
    defaultVariants: {
      size: 'md',
      shadow: 'md',
      rounded: 'xl',
      hover: 'lift',
    },
  }
);

export interface BusinessCardProps extends VariantProps<typeof businessCardVariants> {
  business: business;
  isOpen?: boolean;
  hasNfcMenu?: boolean;
  className?: string;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ 
  business, 
  size, 
  shadow, 
  rounded, 
  hover, 
  className, 
  isOpen, 
  hasNfcMenu 
}) => {
  const { 
    BUSINESS_ID,
    BUSINESS_NAME,
    IMAGE_URL,
    DESCRIPTION,
    GOOGLE_RATING,
    ADDRESS_TOWN,
    WEB_ADDRESS,
    PHONE_NUMBER,
    FACEBOOK_LINK,
    INSTA_LINK
  } = business;

  const slug = generateSlug(BUSINESS_NAME || '', BUSINESS_ID);
  const hasWebsite = !!WEB_ADDRESS;
  const rating = GOOGLE_RATING ? parseFloat(GOOGLE_RATING).toFixed(1) : null;

  const handleChildClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Link 
      href={`/businesses/${slug}`}
      className={businessCardVariants({ size, shadow, rounded, hover, className })}
    >
      {/* Business Image */}
      <div className="relative h-48 w-full">
        {IMAGE_URL ? (
          <Image
            src={IMAGE_URL}
            alt={BUSINESS_NAME || 'Business Image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
        
        {/* Status Badge */}
        {isOpen !== undefined && (
          <div className="absolute top-2 left-2">
            <Badge variant={isOpen ? "success" : "error"} size="sm">
              {isOpen ? 'Open Now' : 'Closed'}
            </Badge>
          </div>
        )}
        
        {/* NFC Badge */}
        {hasNfcMenu && (
          <div className="absolute top-2 right-2">
            <Badge variant="primary" size="sm">
              <span className="flex items-center">
                <svg 
                  className="w-3 h-3 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
                NFC Menu
              </span>
            </Badge>
          </div>
        )}
      </div>
      
      {/* Business Details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-secondary-900 truncate">
              {BUSINESS_NAME || 'Unnamed Business'}
            </h3>
            
            {/* Location */}
            {ADDRESS_TOWN && (
              <div className="mt-1 text-sm text-secondary-600">
                <span>{ADDRESS_TOWN}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        {DESCRIPTION && (
          <p className="mt-2 text-sm text-secondary-600 line-clamp-2">
            {DESCRIPTION}
          </p>
        )}
        
        {/* Rating and Contact */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            {rating && (
              <>
                <svg
                  className="w-4 h-4 text-accent-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-secondary-600">
                  {rating}
                </span>
              </>
            )}
          </div>
          
          {PHONE_NUMBER && (
            <a 
              href={`tel:${PHONE_NUMBER}`}
              onClick={handleChildClick}
              className="text-sm text-secondary-600 hover:text-primary-600"
            >
              📞 Call
            </a>
          )}
        </div>
        
        {/* Social Links */}
        <div className="mt-4 flex flex-wrap gap-4">
          {hasWebsite && WEB_ADDRESS && (
            <a 
              href={WEB_ADDRESS} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleChildClick}
              className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <ExternalLink size={16} className="mr-1" />
              Website
            </a>
          )}
          
          {FACEBOOK_LINK && (
            <a 
              href={FACEBOOK_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleChildClick}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Facebook
            </a>
          )}
          
          {INSTA_LINK && (
            <a 
              href={INSTA_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleChildClick}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Instagram
            </a>
          )}
          
          {BUSINESS_ID && (
            <Link 
              href={`/businesses/${slug}/reviews`}
              onClick={handleChildClick}
              className="text-sm text-secondary-600 hover:text-secondary-700"
            >
              <MessageSquare size={16} className="inline mr-1" />
              Reviews
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;