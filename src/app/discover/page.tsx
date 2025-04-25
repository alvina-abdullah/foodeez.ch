"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { 
  searchBusinesses, 
  getPopularSearchTerms, 
  getFoodCategories,
  getDietaryPreferences,
  getPriceRanges
} from "@/services/DiscoverPageService";
import SearchHero from "./components/SearchHero";

import { useSearchParams, useRouter } from "next/navigation";
import Filters from "./components/Filters";
import SearchLoading from "./components/SearchLoading";
import NoResults from "./components/NoResults";
import BusinessList from "./components/BusinessList";
import Pagination from "./components/Pagination";
import { DiscoverBusiness } from "@/types/discover.types";

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // State
  const [businesses, setBusinesses] = useState<DiscoverBusiness[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<{id: number; name: string; count: number}[]>([]);
  const [dietaryOptions, setDietaryOptions] = useState<{id: number; name: string; count: number}[]>([]);
  const [priceRanges, setPriceRanges] = useState<{id: number; name: string; symbol: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get search params
  const currentQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'All';
  const currentFoodType = searchParams.get('foodType') || 'All';
  const currentPriceRange = searchParams.get('price') || 'All';
  const currentRating = searchParams.get('rating') ? Number(searchParams.get('rating')) : 0;
  const currentPage = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const currentSort = (searchParams.get('sort') as 'rating' | 'popularity' | 'newest') || 'popularity';
  
  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [terms, cats, diets, prices] = await Promise.all([
          getPopularSearchTerms(),
          getFoodCategories(),
          getDietaryPreferences(),
          getPriceRanges()
        ]);
        
        setPopularSearches(terms);
        setCategories(cats);
        setDietaryOptions(diets);
        setPriceRanges(prices);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Handle search
  const fetchBusinesses = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const results = await searchBusinesses({
        searchTerm: currentQuery,
        category: currentCategory,
        foodType: currentFoodType,
        priceRange: currentPriceRange,
        rating: currentRating,
        page: currentPage,
        sortBy: currentSort
      });
      
      setBusinesses(results.businesses as DiscoverBusiness[]);
      setTotalResults(results.total);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentQuery, 
    currentCategory, 
    currentFoodType, 
    currentPriceRange, 
    currentRating,
    currentPage,
    currentSort
  ]);
  
  // Effect to fetch businesses on search param changes
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);
  
  // Update URL with search params
  const updateSearchParams = (params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    
    startTransition(() => {
      router.push(`/discover?${newParams.toString()}`);
    });
  };
  
  // Handle search query change
  const handleSearch = (query: string) => {
    updateSearchParams({ q: query || null, page: 1 });
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    const params: Record<string, string | number | null> = { page: 1 };
    
    switch (filterType) {
      case 'category':
        params.category = value === 'All' ? null : value;
        break;
      case 'foodType':
        params.foodType = value === 'All' ? null : value;
        break;
      case 'price':
        params.price = value === 'All' ? null : value;
        break;
      case 'rating':
        params.rating = value === '0' ? null : value;
        break;
      case 'sort':
        params.sort = value;
        break;
    }
    
    updateSearchParams(params);
  };
  
  // Handle pagination
  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero with Search */}
      <SearchHero 
        query={currentQuery}
        onSearch={handleSearch}
        popularSearches={popularSearches}
        isLoading={isPending}
      />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Results Info and Sorting */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-main">
              {isLoading ? (
                <span className="animate-pulse">Searching...</span>
              ) : (
                <>
                  {totalResults > 0 ? (
                    <span>
                      Found <span className="text-primary">{totalResults}</span> results
                      {currentQuery && (
                        <> for "<span className="text-primary">{currentQuery}</span>"</>
                      )}
                    </span>
                  ) : (
                    <span>No results found</span>
                  )}
                </>
              )}
            </h2>
          </div>
          
          {/* Sort Dropdown */}
          <div className="mt-4 md:mt-0">
            <select
              value={currentSort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={isPending}
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <Filters 
              categories={categories}
              dietaryOptions={dietaryOptions}
              priceRanges={priceRanges}
              selectedCategory={currentCategory}
              selectedFoodType={currentFoodType}
              selectedPriceRange={currentPriceRange}
              selectedRating={currentRating}
              onChange={handleFilterChange}
              isLoading={isPending}
            />
          </div>
          
          {/* Results */}
          <div className="flex-1">
            {isLoading ? (
              <SearchLoading />
            ) : businesses.length === 0 ? (
              <NoResults query={currentQuery} />
            ) : (
              <>
                <BusinessList  businesses={businesses} />
                
                {/* Pagination */}
                {totalResults > 12 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={Math.ceil(totalResults / 12)}
                    onPageChange={handlePageChange}
                    isLoading={isPending}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
