import React from 'react';
import type { BusinessData } from '../page';

interface ReservationImageProps {
  business: BusinessData;
}

const ReservationImage: React.FC<ReservationImageProps> = ({ business }) => {
  if (!business.IMAGE_URL) {
    return (
      <div className="w-full h-64 md:h-full rounded-xl overflow-hidden shadow mb-6 md:mb-0 bg-background-card flex items-center justify-center text-text-light">
        No image available
      </div>
    );
  }
  return (
    <div className="w-full h-64 md:h-full rounded-xl overflow-hidden shadow mb-6 md:mb-0">
      <img
        src={business.IMAGE_URL}
        alt={business.BUSINESS_NAME || 'Reservation'}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default ReservationImage; 