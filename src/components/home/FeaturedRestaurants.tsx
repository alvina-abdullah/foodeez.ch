'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Utensils, TrendingUp, Search, Filter, X } from 'lucide-react';
import BusinessCard from '../../features/business/components/BusinessCard';
import { getFeaturedBusiness, getFoodTypes } from '@/services/database/featuredBusinessService';
import { cn } from '@/lib/utils';
import { debounce } from 'lodash';
import { BusinessData } from '@/types/database';

type FoodType = {
  id: number;
  name: string;
  count: number;
};

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState<BusinessData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodTypeOptions, setFoodTypeOptions] = useState<FoodType[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const categories = ['All', 'HALAL', 'Vegetarian', 'Vegan'];
  const foodTypes = ['Pizza & Pasta', 'Fast Food', 'Kebab & Donner', 'Combo Box'];

  // Fetch food types for dropdown
  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const types = await getFoodTypes();
        setFoodTypeOptions(types as FoodType[]);
      } catch (err) {
        console.error('Error fetching food types:', err);
      }
    };

    fetchFoodTypes();
  }, []);

  // Create a debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async (category: string, type: string | null, search: string) => {
      setIsFetching(true);
      try {
        const data = await getFeaturedBusiness(
          category as any, // Type assertion to avoid the type error
          (type || 'All') as any,
          search
        );
        setRestaurants(data as BusinessData[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants');
      } finally {
        setIsFetching(false);
      }
    }, 500),
    []
  );

  // Fetch restaurants whenever filters change
  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await getFeaturedBusiness(
          activeCategory as any, // Type assertion to avoid the type error
          (activeType || 'All') as any,
          searchTerm
        );
        setRestaurants(data as BusinessData[]);
        setError(null);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

  // Update results when filters change (without initial loading state)
  useEffect(() => {
    debouncedFetch(activeCategory, activeType, searchTerm);
    return () => {
      debouncedFetch.cancel();
    };
  }, [activeCategory, activeType, searchTerm, debouncedFetch]);

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('All');
    setActiveType(null);
    setSearchTerm('');
  };

  // Show all restaurants without filtering
  const filteredRestaurants = restaurants;

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-4 mb-3">
            Foodeez Featured Selection
          </h2>
          <p className="text-text-muted">
            Discover our hand-picked selection of outstanding food establishments with exceptional flavors and service
          </p>
        </div>

        {/* Search Box */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, description or location..."
              className="w-full py-3 pl-12 pr-4 text-gray-700 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Indicator + Clear Button */}
        {(activeCategory !== 'All' || activeType || searchTerm) && (
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-50 text-indigo-700 rounded-full px-4 py-1.5 text-sm flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters applied</span>
              <button
                onClick={clearFilters}
                className="ml-2 bg-indigo-100 hover:bg-indigo-200 rounded-full px-2 py-0.5 text-xs font-medium transition"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {categories.map((category) => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition',
                activeCategory === category
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'text-gray-700 border-gray-300 hover:bg-indigo-100 hover:text-indigo-600'
              )}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Food Type Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {foodTypes.map((type) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              key={type}
              onClick={() => setActiveType(type === activeType ? null : type)}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm font-semibold transition',
                type === activeType
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 hover:bg-indigo-200 text-gray-800 hover:text-indigo-700'
              )}
            >
              {type}
            </motion.button>
          ))}
        </div>

        {/* Loading States */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-opacity-60"></div>
          </div>
        ) : isFetching ? (
          <div className="absolute top-0 left-0 w-full h-1">
            <div className="h-full bg-indigo-500 animate-pulse"></div>
          </div>
        ) : null}

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <motion.div 
                  key={restaurant.BUSINESS_ID} 
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BusinessCard business={restaurant} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 mt-6">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-8"
                >
                  <div className="text-5xl mb-4">🍽️</div>
                  <h3 className="text-xl font-medium mb-2">No matching restaurants found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/search" className="btn-primary">
            Explore All Restaurants
          </Link>
        </div>
      </div>
    </section>
  );
}


// Placeholder when no restaurants are available or during development
function PlaceholderCard({ index }: { index: number }) {
  // Array of placeholder background colors
  const bgColors = [
    'bg-primary/10',
    'bg-secondary/10',
    'bg-accent/10',
    'bg-accent/10',
    'bg-secondary/10',
    'bg-primary/10',
  ];

  // Array of placeholder icons
  const icons = [
    <Utensils key="utensils" className="w-12 h-12 text-primary-light opacity-70" />,
    <MapPin key="map" className="w-12 h-12 text-secondary-light opacity-70" />,
    <Star key="star" className="w-12 h-12 text-accent-light opacity-70" />,
    <TrendingUp key="trending" className="w-12 h-12 text-accent-light opacity-70" />,
  ];

  // Use the index to select a color and icon, cycling through the arrays
  const bgColor = bgColors[index % bgColors.length];
  const icon = icons[index % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className={`h-48 ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-text-main mb-2">
          Example Restaurant {index + 1}
        </h3>

        <div className="text-sm text-text-muted mb-3">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Sample Location</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-success/20 text-success">
            Open Now
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-warning fill-current" />
            <span className="ml-1 text-sm font-medium text-text-main">4.5</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 