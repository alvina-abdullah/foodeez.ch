'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Star, Plus, MapPin, ExternalLink } from 'lucide-react';
import slugify from 'slugify';

interface ReviewImage {
  src: string;
  alt: string;
}

export interface ReviewData {
  id: string;
  userId: string;
  businessId: number;
  rating: number;
  comment: string;
  createdAt: string;
  images?: ReviewImage[];
  user?: {
    NAME: string;
    PROFILE_IMAGE: string;
  };
  business?: {
    BUSINESS_NAME: string;
    IMAGE_URL: string;
    ADDRESS_TOWN: string;
    GOOGLE_RATING: string;
  };
}

interface ReviewCardProps {
  review: ReviewData;
  showBusinessInfo?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}

// Helper function to generate business slug consistent with the rest of the app
const generateBusinessSlug = (name: string, id: number) => {
  return `${slugify(name || '', { lower: true, strict: true })}-${id}`;
};

// Format date to relative time (e.g., "2 months ago")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 1) return 'today';
  if (diffInDays < 2) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export default function ReviewCard({ review, showBusinessInfo = false, className = '' }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // If comment is longer than this, show "Read more" button
  const commentTruncateLength = 120;
  const shouldTruncate = review.comment && review.comment.length > commentTruncateLength;
  
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col ${className}`}>
      {/* Business info if showBusinessInfo is true */}
      {showBusinessInfo && review.business && (
        <Link 
          href={`/businesses/${generateBusinessSlug(review.business.BUSINESS_NAME, review.businessId)}`}
          className="block hover:opacity-90 transition-opacity"
        >
          <div className="relative h-40 w-full bg-background-card">
            {review.business.IMAGE_URL ? (
              <Image
                src={review.business.IMAGE_URL}
                alt={review.business.BUSINESS_NAME}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-bold">
                {review.business.BUSINESS_NAME.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
              <h3 className="font-bold text-white text-lg">{review.business.BUSINESS_NAME}</h3>
              <div className="flex items-center text-sm text-white/90">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>{review.business.ADDRESS_TOWN || 'Location'}</span>
              </div>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < (parseFloat(review.business?.GOOGLE_RATING || '0') || 0) ? "#FFD700" : "none"} 
                    stroke={i < (parseFloat(review.business?.GOOGLE_RATING || '0') || 0) ? "#FFD700" : "#ffffff50"}
                    className="mr-0.5"
                  />
                ))}
                <span className="text-xs text-white ml-1">({review.business?.GOOGLE_RATING || '0'})</span>
              </div>
            </div>
          </div>
        </Link>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Header with user info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
            {review.user?.PROFILE_IMAGE ? (
              <Image 
                src={review.user.PROFILE_IMAGE} 
                alt={review.user?.NAME || 'User'} 
                width={40} 
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-primary bg-primary/10">
                {review.user?.NAME?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium text-text-main">{review.user?.NAME || 'Anonymous User'}</span>
              {/* Verified badge */}
              <div className="ml-1 text-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor" fillOpacity="0.2"/>
                  <path d="M7.75 12.75L10 15.25L16.25 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="flex items-center text-sm text-text-muted">
              <span>{formatRelativeTime(review.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={18} 
              fill={i < review.rating ? "#FFD700" : "none"} 
              stroke={i < review.rating ? "#FFD700" : "#D1D5DB"}
              strokeWidth={1.5}
              className="mr-1"
            />
          ))}
        </div>
        
        {/* Review text */}
        <p className="text-text-muted text-sm mb-4 flex-grow">
          {shouldTruncate && !isExpanded 
            ? `${review.comment.substring(0, commentTruncateLength)}...` 
            : review.comment
          }
          {shouldTruncate && (
            <button 
              onClick={toggleExpand} 
              className="text-primary font-medium ml-1 hover:underline"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </p>
        
        {/* Review images */}
        {review.images && review.images.length > 0 && (
          <div className="flex space-x-2 mb-3">
            {review.images.slice(0, 2).map((image, index) => (
              <div key={index} className="relative h-16 flex-1 rounded-md overflow-hidden bg-background-muted">
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  fill 
                  className="object-cover" 
                />
              </div>
            ))}
            
            {/* Additional images indicator */}
            {review.images.length > 2 && (
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-primary/10">
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <Plus size={16} className="mr-1" /> 
                  <span className="text-sm font-medium">{review.images.length - 2}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-auto">
          <Link 
            href={`/businesses/${generateBusinessSlug(review.business?.BUSINESS_NAME || '', review.businessId)}`}
            className="inline-flex items-center text-xs text-primary font-medium hover:underline"
          >
            View Business
            <ExternalLink size={12} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
} 