import React from 'react';
import type { BusinessData } from '../page';

interface ReservationHeroProps {
  business: BusinessData;
}

const ReservationHero: React.FC<ReservationHeroProps> = ({ business }) => {
  return (
    <section className="w-full bg-primary text-white py-20 shadow-md md:mb-8 text-center">
      <h1 className="sub-heading !text-white">Reserve a Table</h1>
      <p className="sub-heading-description !text-white">
        Complete the form below to reserve a table{business.BUSINESS_NAME && (
          <span> at <span className="font-semibold">{business.BUSINESS_NAME}</span></span>
        )}.
      </p>
    </section>
  );
};

export default ReservationHero; 