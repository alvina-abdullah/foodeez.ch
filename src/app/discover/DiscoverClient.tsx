"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import RestaurantCard from "@/features/business/components/BusinessCard";
import { business, food_type, business_category, city } from "@prisma/client";
import { Search, Sliders, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchInput from "@/components/core/SearchInput";

// Enhanced interface for search filters
interface SearchFilters {
  query: string;
  cuisine: string | number;
  location: string | number;
  rating: number | null;
  sortBy: 'relevance' | 'rating' | 'newest';
}

interface DiscoverClientProps {
  initialBusinesses: business[];
  foodTypes: food_type[];
  categories: business_category[];
  cities: city[];
}

export default function DiscoverClient({ 
  initialBusinesses,
  foodTypes,
  categories,
  cities
}: DiscoverClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial search parameters from URL
  const initialQuery = searchParams.get('q') || '';
  const initialCuisine = searchParams.get('cuisine') || 'All';
  const initialCity = searchParams.get('city') || 'All';
  const initialRating = searchParams.get('rating') ? parseInt(searchParams.get('rating') || '0') : null;
  const initialSortBy = (searchParams.get('sort') || 'relevance') as 'relevance' | 'rating' | 'newest';
  
  // State variables
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>(initialBusinesses);
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    cuisine: initialCuisine,
    location: initialCity,
    rating: initialRating,
    sortBy: initialSortBy
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: initialBusinesses.length,
    hasMore: initialBusinesses.length > 12,
    totalPages: Math.ceil(initialBusinesses.length / 12)
  });
  const [trendingSearches, setTrendingSearches] = useState<{id: number, term: string, count: number}[]>([]);
  
  // Initialize client-side rendering state
  useEffect(() => {
    setIsClient(true);
    fetchTrendingSearches();
  }, []);

  // Function to fetch trending searches
  const fetchTrendingSearches = async () => {
    try {
      const response = await fetch('/api/search?type=trending');
      const data = await response.json();
      if (data.success) {
        setTrendingSearches(data.data);
      }
    } catch (error) {
      console.error('Error fetching trending searches:', error);
    }
  };
  
  // Search function with timeout to prevent excessive API calls
  const debouncedSearch = useCallback(
    async (filters: SearchFilters, page: number = 1) => {
      setIsLoading(true);
      
      try {
        // Build query string with all active filters
        const params = new URLSearchParams();
        params.append('type', 'business');
        
        if (filters.query) params.append('query', filters.query);
        if (filters.cuisine && filters.cuisine !== 'All') params.append('foodType', String(filters.cuisine));
        if (filters.location && filters.location !== 'All') params.append('city', String(filters.location));
        if (filters.rating) params.append('rating', String(filters.rating));
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        params.append('page', String(page));
        params.append('limit', String(pagination.limit));
        
        const response = await fetch(`/api/search?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setBusinesses(data.data);
          setPagination({
            page: data.pagination.page,
            limit: data.pagination.limit,
            total: data.pagination.total,
            hasMore: data.pagination.hasMore,
            totalPages: data.pagination.totalPages
          });
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.limit]
  );
  
  // Update URL and search when filters change
  useEffect(() => {
    if (!isClient) return;
    
    const params = new URLSearchParams();
    if (filters.query) params.append('q', filters.query);
    if (filters.cuisine !== 'All') params.append('cuisine', String(filters.cuisine));
    if (filters.location !== 'All') params.append('city', String(filters.location));
    if (filters.rating) params.append('rating', String(filters.rating));
    if (filters.sortBy !== 'relevance') params.append('sort', filters.sortBy);
    
    // Update URL without causing a navigation/refresh
    const url = `/discover${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', url);
    
    // Execute search with a delay to avoid excessive API calls
    const timer = setTimeout(() => {
      debouncedSearch(filters);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters, isClient, debouncedSearch]);
  
  // Load more results
  const loadMore = () => {
    if (isLoading || !pagination.hasMore) return;
    debouncedSearch(filters, pagination.page + 1);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      query: '',
      cuisine: 'All',
      location: 'All',
      rating: null,
      sortBy: 'relevance'
    });
  };
  
  // Apply a specific search term
  const applySearchTerm = (term: string) => {
    setFilters(prev => ({
      ...prev,
      query: term
    }));
  };
  
  // Render star rating selector
  const renderRatingOptions = () => {
    return [5, 4, 3, 2, 1].map(rating => (
      <div 
        key={rating}
        className={`flex items-center space-x-1 cursor-pointer p-2 ${filters.rating === rating ? 'bg-primary-50 rounded' : ''}`}
        onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === rating ? null : rating }))}
      >
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg 
              key={i} 
              className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm">{rating}+ Stars</span>
      </div>
    ));
  };

  // Helper function to check if a value is a numeric string or number
  const isFoodTypeMatch = (foodTypeId: bigint | null, filterValue: string | number): boolean => {
    if (filterValue === 'All') return true;
    if (foodTypeId === null) return false;
    
    if (typeof filterValue === 'number') {
      return Number(foodTypeId) === filterValue;
    }
    
    return String(foodTypeId) === filterValue;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Discover Delicious Food Near You
            </h1>
            <p className="mt-3 text-lg text-primary-100">
              Find your favorite restaurants, dishes, and local specialties
            </p>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <SearchInput
                  placeholder="Search for restaurants, cuisines, or dishes..."
                  value={filters.query}
                  onChange={(value) => setFilters(prev => ({ ...prev, query: value }))}
                  onSearch={(value) => setFilters(prev => ({ ...prev, query: value }))}
                  size="lg"
                  variant="pill"
                  shadow="md"
                  showSearchButton={true}
                  searchButtonText="Search"
                  className="bg-white"
                />
                
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="absolute right-20 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
                >
                  <Sliders size={20} className="text-primary-600" />
                </button>
              </div>
            </div>

            {/* Trending searches */}
            {trendingSearches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-white/80 text-sm mr-1">Trending:</span>
                {trendingSearches.map(item => (
                  <span 
                    key={item.id}
                    onClick={() => applySearchTerm(item.term)}
                    className="bg-white/20 text-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-white/30"
                  >
                    {item.term}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {isFilterOpen && (
        <section className="bg-white shadow-md py-6 border-t border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-primary-600 text-sm font-medium hover:underline"
              >
                Reset All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cuisine Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={String(filters.cuisine)}
                  onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                >
                  <option value="All">All Cuisines</option>
                  {isClient && foodTypes.map(type => (
                    <option key={String(type.FOOD_TYPE_ID)} value={String(type.FOOD_TYPE_ID)}>
                      {type.TITLE || 'Unknown'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={String(filters.location)}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                >
                  <option value="All">All Locations</option>
                  {isClient && cities.map(city => (
                    <option key={String(city.CITY_ID)} value={String(city.CITY_ID)}>
                      {city.CITY_NAME || 'Unknown'}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            
            {/* Rating filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex flex-wrap gap-4">
                {renderRatingOptions()}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Apply Filters
              </button>
          </div>
        </div>
      </section>
      )}

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-800">
              {pagination.total}{" "}
              {pagination.total === 1 ? "Restaurant" : "Restaurants"} Found
          </h2>

            {/* Active filters */}
            {(filters.query || filters.cuisine !== 'All' || filters.location !== 'All' || filters.rating) && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {filters.query && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Search: {filters.query}
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                    />
                  </span>
                )}
                
                {filters.cuisine !== 'All' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Cuisine: {typeof filters.cuisine === 'number' 
                      ? foodTypes.find(t => String(t.FOOD_TYPE_ID) === String(filters.cuisine))?.TITLE || filters.cuisine
                      : filters.cuisine}
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, cuisine: 'All' }))}
                    />
                  </span>
                )}
                
                {filters.location !== 'All' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Location: {typeof filters.location === 'number'
                      ? cities.find(c => String(c.CITY_ID) === String(filters.location))?.CITY_NAME || filters.location
                      : filters.location}
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, location: 'All' }))}
                    />
                  </span>
                )}
                
                {filters.rating && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Rating: {filters.rating}+ stars
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={() => setFilters(prev => ({ ...prev, rating: null }))}
                    />
                  </span>
                )}
                
                <button 
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Loading state */}
          {isLoading && businesses.length === 0 && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* Results grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <motion.div
                key={business.BUSINESS_ID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RestaurantCard 
                business={business}
              />
              </motion.div>
            ))}
          </div>

          {/* No results state */}
          {!isLoading && businesses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-800 mb-2">No restaurants found</p>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Load more button */}
          {!isLoading && pagination.hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-6 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Load More
              </button>
            </div>
          )}
          
          {/* Pagination info */}
          {businesses.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {businesses.length} of {pagination.total} restaurants
            </div>
          )}
        </div>
      </section>
    </div>
  );
}