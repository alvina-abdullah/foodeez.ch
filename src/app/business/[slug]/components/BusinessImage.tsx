import React from 'react';
import type { BusinessData } from '../page';

interface BusinessImageProps {
  business: BusinessData;
}

const BusinessImage: React.FC<BusinessImageProps> = ({ business }) => {
  if (!business.IMAGE_URL) {
    return (
      <div className="w-full h-72 md:h-full rounded-xl overflow-hidden shadow bg-background-card flex items-center justify-center text-text-light">
        No image available
      </div>
    );
  }
  return (
    <div className="w-full h-72 md:h-full rounded-xl overflow-hidden shadow">
      <img
        src={business.IMAGE_URL}
        alt={business.BUSINESS_NAME || 'Business'}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default BusinessImage; 