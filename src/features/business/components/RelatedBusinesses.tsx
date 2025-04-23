import React from 'react';
import { BusinessCard } from './BusinessCardSimple';

interface RelatedBusinessesProps {
  businesses: any[];
  title: string;
  subtitle?: string;
}

const RelatedBusinesses: React.FC<RelatedBusinessesProps> = ({
  businesses,
  title,
  subtitle,
}) => {
  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessCard
            key={business.BUSINESS_ID}
            business={business}
            showDescription={false}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedBusinesses; 