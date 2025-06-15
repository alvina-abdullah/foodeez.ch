"use client";

import { Building } from "lucide-react";

interface ContentHeaderProps {
  selectedCity: string;
  searchZipCode: string;
}

export default function ContentHeader({
  selectedCity,
  searchZipCode,
}: ContentHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      <Building className="text-text-light" size={24} />
      <h3 className="text-xl md:text-2xl text-primary font-semibold">
        {selectedCity
          ? `Restaurants in ${selectedCity}`
          : searchZipCode
          ? `Restaurants near ${searchZipCode}`
          : "Popular Restaurants"}
      </h3>
    </div>
  );
} 