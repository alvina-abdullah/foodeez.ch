"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, ChevronUp, Star, X } from "lucide-react";

interface FiltersProps {
  selectedRating: number;
  onChange: (filterType: string, value: string) => void;
  isLoading: boolean;
}

export default function Filters({
  selectedRating,
  onChange,
  isLoading,
}: FiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
  });

  const hasActiveFilters =  selectedRating > 0;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const clearAllFilters = () => {
    onChange("price", "All");
    onChange("rating", "0");
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating ? "text-accent fill-accent" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const FilterSection = ({
    title,
    section,
    children,
  }: {
    title: string;
    section: keyof typeof expandedSections;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left font-semibold text-text-main mb-2"
      >
        <span>{title}</span>
        {expandedSections[section] ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>
      {expandedSections[section] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-2 space-y-2"
        >
          {children}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center text-text-main">
          <Filter size={18} className="mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary flex items-center hover:text-primary-dark transition-colors"
            disabled={isLoading}
          >
            <X size={14} className="mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Rating */}
      <FilterSection title="Rating" section="rating">
        <div className="space-y-2">
          <div
            className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedRating === 0
                ? "bg-primary/10 text-primary font-medium"
                : ""
            }`}
            onClick={() => onChange("rating", "0")}
          >
            Any Rating
          </div>
          {[5, 4, 3, 2].map((rating) => (
            <div
              key={rating}
              className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 flex items-center ${
                selectedRating === rating
                  ? "bg-primary/10 text-primary font-medium"
                  : ""
              }`}
              onClick={() => onChange("rating", rating.toString())}
            >
              <RatingStars rating={rating} />
              <span className="ml-2">{rating === 5 ? "only" : "& up"}</span>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
