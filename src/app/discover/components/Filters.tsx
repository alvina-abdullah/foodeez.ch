"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown, ChevronUp, Star, X, Search } from "lucide-react";
import Link from "next/link";

interface FiltersProps {
  categories: { id: number; name: string; count: number }[];
  dietaryOptions: { id: number; name: string; count: number }[];
  priceRanges: { id: number; name: string; symbol: string }[];
  selectedCategory: string;
  selectedFoodType: string;
  selectedPriceRange: string;
  selectedRating: number;
  onChange: (filterType: string, value: string) => void;
  isLoading: boolean;
}

export default function Filters({
  categories,
  dietaryOptions,
  priceRanges,
  selectedCategory,
  selectedFoodType,
  selectedPriceRange,
  selectedRating,
  onChange,
  isLoading,
}: FiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    dietary: true,
    price: true,
    rating: true,
  });

  // Get popular categories (top 5 by count)
  const popularCategories = categories.slice(0, 5);
  const otherCategories = categories.slice(5);

  // Check if any filters are active
  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedFoodType !== "All" ||
    selectedPriceRange !== "All" ||
    selectedRating > 0;

  // Toggle section expand/collapse
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onChange("category", "All");
    onChange("foodType", "All");
    onChange("price", "All");
    onChange("rating", "0");
  };

  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating
              ? "text-accent fill-accent"
              : "text-gray-300"
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

      {/* Food Categories */}
      <FilterSection title="Food Categories" section="categories">
        <div className="space-y-2">
          <div
            className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedCategory === "All" ? "bg-primary/10 text-primary font-medium" : ""
            }`}
            onClick={() => onChange("category", "All")}
          >
            All Categories
          </div>
          
          {/* Popular Categories */}
          {popularCategories.map((category) => (
            <div
              key={category.id}
              className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                selectedCategory === category.name ? "bg-primary/10 text-primary font-medium" : ""
              }`}
              onClick={() => onChange("category", category.name)}
            >
              <span>{category.name}</span>
              <span className="text-xs bg-gray-100 px-2 rounded-full">
                {category.count}
              </span>
            </div>
          ))}

          {/* See All Categories Button */}
          {otherCategories.length > 0 && (
            <Link
              href="/categories"
              className="block mt-2 text-sm text-primary hover:text-primary-dark flex items-center"
            >
              <Search size={14} className="mr-1" />
              See all categories
            </Link>
          )}
        </div>
      </FilterSection>

      {/* Dietary Preferences */}
      <FilterSection title="Dietary Preferences" section="dietary">
        <div className="space-y-2">
          <div
            className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedFoodType === "All" ? "bg-primary/10 text-primary font-medium" : ""
            }`}
            onClick={() => onChange("foodType", "All")}
          >
            All Types
          </div>
          {dietaryOptions.map((option) => (
            <div
              key={option.id}
              className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                selectedFoodType === option.name ? "bg-primary/10 text-primary font-medium" : ""
              }`}
              onClick={() => onChange("foodType", option.name)}
            >
              <span>{option.name}</span>
              <span className="text-xs bg-gray-100 px-2 rounded-full">
                {option.count}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <div className="space-y-2">
          <div
            className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedPriceRange === "All" ? "bg-primary/10 text-primary font-medium" : ""
            }`}
            onClick={() => onChange("price", "All")}
          >
            Any Price
          </div>
          {priceRanges.map((price) => (
            <div
              key={price.id}
              className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                selectedPriceRange === price.name ? "bg-primary/10 text-primary font-medium" : ""
              }`}
              onClick={() => onChange("price", price.name)}
            >
              <span>{price.name}</span>
              <span className="text-xs font-medium">{price.symbol}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating" section="rating">
        <div className="space-y-2">
          <div
            className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedRating === 0 ? "bg-primary/10 text-primary font-medium" : ""
            }`}
            onClick={() => onChange("rating", "0")}
          >
            Any Rating
          </div>
          {[5, 4, 3, 2].map((rating) => (
            <div
              key={rating}
              className={`py-1 px-2 rounded cursor-pointer hover:bg-gray-100 flex items-center ${
                selectedRating === rating ? "bg-primary/10 text-primary font-medium" : ""
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