"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getBusinessCategories,
  getBusinessesByTypeAndCategories,
} from "@/lib/db";
import Link from "next/link";
import { BusinessCategory, BusinessDetail } from "@/types/business.types";
import BusinessCard from "../BusinessCard";
import { useTransition } from "react";
import { RefreshCw, Loader2 } from "lucide-react";

const FOOD_TYPES = ["All", "Halal", "Vegetarian", "Vegan"] as const;
const INITIAL_FOOD_TYPE = "All";
const VISIBLE_CATEGORIES_LIMIT = 5;

export default function FeaturedBusiness() {
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [initialLoading, setInitialLoading] = useState(true);

  const [selectedFoodType, setSelectedFoodType] =
    useState<string>(INITIAL_FOOD_TYPE);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const visibleCategories = categories.slice(0, VISIBLE_CATEGORIES_LIMIT);
  const hiddenCategories = categories.slice(VISIBLE_CATEGORIES_LIMIT);

  // Fetch categories from the businessCategory table
  const fetchCategories = useCallback(async () => {
    try {
      setCategoryError(null);
      const categoryData = await getBusinessCategories();
      if (Array.isArray(categoryData) && categoryData.length > 0) {
        setCategories(categoryData);
      } else {
        console.error("Invalid or empty category data:", categoryData);
        setCategoryError("Could not load categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryError("Could not load categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Update selected category ID when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(
        (cat) => cat.Category_name === selectedCategory
      );
      if (category) {
        console.log(
          `Selected category: ${selectedCategory}, ID: ${category.Business_category_id}`
        );
        setSelectedCategoryId(category.Business_category_id);
      } else {
        setSelectedCategoryId(undefined);
      }
    } else {
      setSelectedCategoryId(undefined);
    }
  }, [selectedCategory, categories]);

  // Fetch businesses based on filters
  const fetchBusinesses = useCallback(async () => {
    try {
      setError(null);
      startTransition(async () => {
        // Log the filtering criteria
        console.log(
          `Fetching businesses with food type: ${selectedFoodType}, categoryId: ${selectedCategoryId}`
        );

        const data = await getBusinessesByTypeAndCategories({
          foodType: selectedFoodType,
          categoryId: selectedCategoryId,
          limit: 12,
        });

        if (Array.isArray(data)) {
          console.log(`Received ${data.length} businesses`);
          setBusinesses(data);
        } else {
          console.error("Invalid business data format:", data);
          setError("Could not load businesses");
        }

        // Set initial loading to false after first load
        setInitialLoading(false);
      });
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Could not load businesses");
      setInitialLoading(false);
    }
  }, [selectedFoodType, selectedCategoryId, startTransition]);

  // Handle filter changes
  useEffect(() => {
    fetchBusinesses();
  }, [selectedFoodType, selectedCategoryId, fetchBusinesses]);

  // Handlers
  const handleFoodTypeSelect = (type: string) => {
    setSelectedFoodType(type);

    // Only reset category selection when switching to "All"
    if (type === "All") {
      setSelectedCategory("");
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? "" : categoryName));
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    setSelectedFoodType(INITIAL_FOOD_TYPE);
    setSelectedCategory("");
  };

  // For debugging - Log when businesses change
  useEffect(() => {
    console.log(`Businesses updated: ${businesses.length}`);
  }, [businesses]);

  // Derived state
  const showSkeleton = isPending || initialLoading;
  const showEmptyState =
    !isPending && !initialLoading && !error && businesses.length === 0;

  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Featured Restaurants
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover restaurants by dietary preferences and food categories
        </p>
      </div>

      {/* Food Type Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {FOOD_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => handleFoodTypeSelect(type)}
            className={cn(
              "px-4 py-2 rounded-full text-sm md:text-base transition-colors relative",
              selectedFoodType === type
                ? "bg-primary text-white font-medium"
                : "bg-gray-100 hover:bg-gray-200"
            )}
            disabled={isPending}
          >
            {type}
            {isPending && selectedFoodType === type && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </button>
        ))}
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        {categoryError ? (
          <div className="text-center py-2">
            <p className="text-red-500 text-sm">{categoryError}</p>
            <button
              onClick={fetchCategories}
              className="mt-2 inline-flex items-center text-sm text-primary hover:text-primary/80"
            >
              <RefreshCw size={14} className="mr-1" /> Reload Categories
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-2 flex justify-center">
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-full mx-1"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-full mx-1"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-full mx-1"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-full mx-1"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded-full mx-1"></div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 relative">
            {visibleCategories.map((category) => {
              const isSelected = selectedCategory === category.Category_name;
              return (
                <button
                  key={category.Business_category_id}
                  onClick={() =>
                    handleCategorySelect(category.Category_name || "")
                  }
                  className={cn(
                    "px-4 py-2 rounded-full text-sm md:text-base transition-colors relative",
                    isSelected
                      ? "bg-primary text-white font-medium"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                  disabled={isPending}
                >
                  {category.Category_name}
                  {isPending && isSelected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              );
            })}
            {hiddenCategories.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm md:text-base transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary/50",
                    isDropdownOpen
                      ? "bg-primary text-white font-semibold"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                  disabled={isPending}
                >
                  More Categories
                  {isPending &&
                    hiddenCategories.some(
                      (cat) => cat.Category_name === selectedCategory
                    ) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse" />
                    )}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 max-h-64 overflow-y-auto rounded-xl shadow-lg border border-primary z-50 bg-white scrollbar-thin scrollbar-thumb-accent scrollbar-track-gray-100"
                    >
                      <div className="p-2 space-y-1">
                        {hiddenCategories.map((category) => {
                          const isSelected =
                            selectedCategory === category.Category_name;
                          return (
                            <button
                              key={category.Business_category_id}
                              onClick={() => {
                                handleCategorySelect(
                                  category.Category_name || ""
                                );
                                setIsDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2 rounded-md text-sm transition-colors relative",
                                isSelected
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-accent/10 text-slate-700"
                              )}
                              disabled={isPending}
                            >
                              {category.Category_name}
                              {isPending && isSelected && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      <div className="text-center mb-6">
        {(selectedFoodType !== "All" || selectedCategory) && (
          <>
            <div className="text-sm text-gray-500 mb-2">
              <span className="text-gray-600 font-medium mr-2">Filters:</span>
              {selectedFoodType !== "All" && (
                <span className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-1 mr-2 mb-2">
                  {selectedFoodType}
                </span>
              )}
              {selectedCategory && (
                <span className="inline-block bg-green-50 text-green-700 rounded-full px-2 py-1 mr-2 mb-2">
                  {selectedCategory}
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center"
              disabled={isPending}
            >
              <RefreshCw size={12} className="mr-1" />
              {isPending ? "Updating..." : "Clear All Filters"}
            </button>
          </>
        )}
      </div>

      {/* Initial Loading */}
      {initialLoading && !showSkeleton && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      )}

      {/* Content Section */}
      {showSkeleton && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(12)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg overflow-hidden border border-gray-100"
              >
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
                </div>
              </div>
            ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={fetchBusinesses}
            className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center"
          >
            <RefreshCw size={16} className="mr-2" /> Try Again
          </button>
        </div>
      )}

      {showEmptyState && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-500 mb-2">
            No restaurants found matching the selected filters
          </p>
          <button
            onClick={clearAllFilters}
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isPending && !error && businesses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {businesses.map((business, index) => (
              <motion.div
                key={business.BUSINESS_ID || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <BusinessCard business={business} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link
          href="/discover"
          className={cn(
            "inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors shadow-sm",
            isPending && "pointer-events-none opacity-50"
          )}
        >
          Explore All Restaurants
        </Link>
      </div>
    </section>
  );
}
