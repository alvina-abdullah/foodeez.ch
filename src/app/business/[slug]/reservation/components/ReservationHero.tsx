import React from 'react';
import type { BusinessData } from '../page';

interface ReservationHeroProps {
  business: BusinessData;
}

const ReservationHero: React.FC<ReservationHeroProps> = ({ business }) => {
  return (
    <section className="w-full bg-primary text-white py-10 px-4 rounded-xl shadow-md mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Reserve a Table</h1>
      <p className="text-lg md:text-xl font-medium">
        Complete the form below to reserve a table{business.BUSINESS_NAME && (
          <span> at <span className="text-secondary font-semibold">{business.BUSINESS_NAME}</span></span>
        )}.
      </p>
    </section>
  );
};

export default ReservationHero; 