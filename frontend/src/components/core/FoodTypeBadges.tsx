'use client';

import Image from 'next/image';
import React from 'react';

interface FoodTypeBadgesProps {
  HALAL:  number;
  VEGAN: number;
  VEGETARIAN:  number;
}

const badges = [
  {
    key: 'HALAL',
    label: 'Halal',
    color: 'green',
    img: '/images/foodtypes/halal.png',
  },
  {
    key: 'VEGAN',
    label: 'Vegan',
    color: 'emerald',
    img: '/images/foodtypes/vegan.png',
  },
  {
    key: 'VEGETARIAN',
    label: 'Vegetarian',
    color: 'teal',
    img: '/images/foodtypes/vegetarian.png',
  },
];

const FoodTypeBadges: React.FC<FoodTypeBadgesProps> = ({
  HALAL,
  VEGAN,
  VEGETARIAN,
}) => {
  const types = { HALAL, VEGAN, VEGETARIAN };

  return (
    <div className="flex items-center flex-wrap gap-2 mt-2 md:mt-0">
      {badges.map(
        ({ key, label, color, img }) =>
          types[key as keyof FoodTypeBadgesProps] === 1 && (
            <span
              key={key}
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs md:text-sm font-medium bg-${color}-100 text-${color}-800 border border-${color}-200`}
            >
              <Image src={img} alt={label} width={24} height={24} />
              {label}
            </span>
          )
      )}
    </div>
  );
};

export default FoodTypeBadges;
