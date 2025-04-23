"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getBusinessCategories, getBusinessesByType } from "@/lib/db";
import Link from "next/link";
import { BusinessDetail } from "@/types/business.types";
import BusinessCard from "../BusinessCard";

// type Business = Awaited<ReturnType<typeof getBusinessesByType>>[number];
type BusinessCategory = Awaited<ReturnType<typeof getBusinessCategories>>[number];

const FOOD_TYPES = ["All", "Halal", "Vegetarian", "Vegan"] as const;
const INITIAL_FOOD_TYPE = "All";

export default function FeaturedBusiness() {
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [selectedFoodType, setSelectedFoodType] =
    useState<string>(INITIAL_FOOD_TYPE);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState({
    businesses: false,
    categories: false,
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading({ businesses: true, categories: true });
        const [businessData, categoryData] = await Promise.all([
          getBusinessesByType({ foodType: INITIAL_FOOD_TYPE, limit: 9 }),
          getBusinessCategories(),
        ]);
        setBusinesses(businessData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Initial data fetch error:", err);
        setError("Failed to load initial data");
      } finally {
        setLoading({ businesses: false, categories: false });
      }
    };
    fetchInitialData();
  }, []);

  // Fetch businesses based on filters
  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, businesses: true }));
      const data = await getBusinessesByType({
        foodType: selectedFoodType,
        category: selectedCategory,
        limit: 9,
      });
      setBusinesses(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Could not load businesses");
    } finally {
      setLoading((prev) => ({ ...prev, businesses: false }));
    }
  }, [selectedFoodType, selectedCategory]);

  // Handle filter changes
  useEffect(() => {
    if (selectedFoodType !== INITIAL_FOOD_TYPE || selectedCategory) {
      fetchBusinesses();
    }
  }, [selectedFoodType, selectedCategory, fetchBusinesses]);

  // Handlers
  const handleFoodTypeSelect = (type: string) => {
    setSelectedFoodType(type);
    setSelectedCategory("");
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory((prev) => (prev === categoryId ? "" : categoryId));
  };

  // Derived state
  const isLoading = loading.businesses || loading.categories;
  const showSkeleton = isLoading && !error;
  const showEmptyState = !isLoading && !error && businesses.length === 0;

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
              "px-4 py-2 rounded-full text-sm md:text-base transition-colors",
              selectedFoodType === type
                ? "bg-primary text-white font-medium"
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category.Business_category_id}
            onClick={() => handleCategorySelect(category.Category_name || "")}
            className={cn(
              "px-4 py-2 rounded-full text-sm md:text-base transition-colors",
              selectedCategory === category.Category_name
                ? "bg-primary text-white font-medium"
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            {category.Category_name}
          </button>
        ))}
      </div>

      {/* Content Section */}
      {showSkeleton && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg h-64 animate-pulse"
              />
            ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {showEmptyState && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No restaurants found matching the selected filters
          </p>
        </div>
      )}

      {!isLoading && !error && businesses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <motion.div
              key={business.BUSINESS_ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BusinessCard key={business.BUSINESS_ID} business={business} />
            </motion.div>
          ))}
        </div>
      )}
      {/* CTA */}
      <div className="text-center mt-12">
          <Link href="/search" className="btn-primary">
            Explore All Restaurants
          </Link>
        </div>
    </section>
  );
}
