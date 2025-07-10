"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessDetail, BusinessCategory } from "@/types/business.types";
import { useTransition } from "react";
import {
  getBusinessByFoodtypeCategoryLocation,
  getBusinessCategories,
  getCities,
} from "@/services/HomePageService";
import FoodTypeFilter from "./FoodTypeFilter";
import CategoryFilter from "./CategoryFilter";
import ResultCountInfo from "./ResultCountInfo";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import EmptyState from "./EmptyState";
import BusinessGrid from "./BusinessGrid";
import PaginationControls, { PER_PAGE_OPTIONS } from "./PaginationControls";
import CitySelectionButtons from "../CitySection/CitySelectionButtons";
import SearchBar from "./SearchBar";
import LoadingSpinner from "@/components/core/LoadingSpinner"; // Use your spinner or fallback

const FOOD_TYPES = ["All", "Halal", "Vegetarian", "Vegan"] as const;
const INITIAL_FOOD_TYPE = "All";

const MAIN_CITIES = [
  "Zurich",
  "Geneva",
  "Luzern",
  "Bern",
  "Interlaken",
  "Zermatt",
  "St. Moritz",
];

export default function FeaturedBusiness() {
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [isPaginationDropdownOpen, setIsPaginationDropdownOpen] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedFoodType, setSelectedFoodType] =
    useState<string>(INITIAL_FOOD_TYPE);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For bottom spinner
  const [error, setError] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS[0]);
  const [totalCountofBusiness, setTotalCountOfBusiness] = useState(0);
  const [cities, setCities] = useState<{ CITY_NAME: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [searchZipCode, setSearchZipCode] = useState("");
  const [query, setQuery] = useState("");

  const [categories, setCategories] = useState<BusinessCategory[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<
    BusinessCategory[]
  >([]);
  const [hiddenCategories, setHiddenCategories] = useState<BusinessCategory[]>(
    []
  );

  // Handler for city selection
  const handleCitySelect = (city: string) => {
    setSearchZipCode('');
    setSelectedCity(city);
    
  };

  
  // Update selected category ID when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(
        (cat) =>
          cat.CATEGORY?.toLowerCase() === selectedCategory.toLowerCase() ||
          cat.CATEGORY_NAME?.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (category) {
        setSelectedCategoryId(category.BUSINESS_CATEGORY_ID);
      } else {
        setSelectedCategoryId(undefined);
      }
    } else {
      setSelectedCategoryId(undefined);
    }
  }, [selectedCategory, categories]);

  // Fetch city list and categories on mount
  useEffect(() => {
    getBusinessCategories().then((categories) => {
      setCategories(categories);

      const visible = categories.slice(0, 6); // Show first 6 categories
      const hidden = categories.slice(6); // Hide the rest
      setVisibleCategories(visible);
      setHiddenCategories(hidden);
    });

    getCities().then((cities) => {
      setCities(
        cities
          .filter(
            (c: { CITY_NAME: string | null }) =>
              typeof c.CITY_NAME === "string" && c.CITY_NAME
          )
          .map((c: { CITY_NAME: string | null }) => ({
            CITY_NAME: c.CITY_NAME as string,
          }))
      );
    });
  }, []);

  // Efficient fetchBusinesses: uses skip/limit for pagination
  const fetchBusinesses = useCallback(
    async (batch: number = 1, perPageOverride?: number, append = false) => {
      try {
        setError(null);
        if (append) setIsLoadingMore(true);
        else setInitialLoading(true);
        const limit = perPageOverride ?? perPage;
        const skip = append ? businesses.length : 0;
        const response = await getBusinessByFoodtypeCategoryLocation({
          foodType: selectedFoodType,
          categoryId: selectedCategoryId,
          city: searchZipCode ? undefined : selectedCity, // city only if zipCode is empty
          businessName: query,
          zipCode: searchZipCode || undefined,
          limit,
          skip,
        });
        const data = response.businesses;
        setTotalCountOfBusiness(response.totalCount);
        if (Array.isArray(data)) {
          if (append) {
            setBusinesses((prev) => [...prev, ...data]);
          } else {
            setBusinesses(data);
          }
          setHasMore(businesses.length + data.length < response.totalCount);
        } else {
          setError("Could not load businesses");
        }
        setInitialLoading(false);
        setIsLoadingMore(false);
      } catch (err) {
        setError("Could not load businesses");
        setInitialLoading(false);
        setIsLoadingMore(false);
      }
    },
    [selectedFoodType, selectedCategoryId, selectedCity, searchZipCode, perPage, query, businesses.length]
  );

  // Handle filter changes (reset businesses)
  useEffect(() => {
    setCurrentBatch(1); // Reset batch when filters change
    fetchBusinesses(1, perPage, false);
  }, [selectedFoodType, selectedCategoryId, selectedCity, perPage, fetchBusinesses]);

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
    setSelectedCity("");
    setSearchZipCode("");
    setQuery("")
    setPerPage(PER_PAGE_OPTIONS[0]);
  };

  // Efficient lazy loading: only fetch next page
  const handleViewMoreBusiness = () => {
    setCurrentBatch((prev) => prev + 1);
    fetchBusinesses(currentBatch + 1, perPage, true);
  };

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchBusinesses(currentBatch, perPage, false);
  };

  // Handle per page change
  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentBatch(1);
    fetchBusinesses(1, value, false);
  };

  // Handle search query change
  const handleSearch = (query: string, zipcode: string) => {
    setQuery(query);
    setSearchZipCode(zipcode);
    // Reset all other filters when search is used
    setSelectedCity("");
    setSelectedCategory("");
    setSelectedFoodType(INITIAL_FOOD_TYPE);
  };

  const otherCities = cities
    .filter((c) => c.CITY_NAME && !MAIN_CITIES.includes(c.CITY_NAME))
    .map((c) => c.CITY_NAME!);

  // Derived state
  const showSkeleton = isPending || initialLoading;
  const showEmptyState =
    !isPending && !initialLoading && !error && businesses.length === 0;
  // const visibleBusinesses = businesses.slice(0, perPage * currentBatch);

  return (
    <section className="py-20 px-4 lg:px-0">
      <div className="text-center mb-10">
        <h2 className="main-heading">Foodeez's Top Selection</h2>
        <p className="main-heading-description">
          Discover restaurants by dietary preferences and food categories and
          Location
        </p>
      </div>

      <FoodTypeFilter
        foodTypes={FOOD_TYPES as unknown as string[]}
        selectedFoodType={selectedFoodType}
        onSelect={handleFoodTypeSelect}
        isPending={isPending}
      />

      <CategoryFilter
        visibleCategories={visibleCategories}
        hiddenCategories={hiddenCategories}
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
        isPending={isPending}
      />

      <CitySelectionButtons
        mainCities={MAIN_CITIES}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        otherCities={otherCities}
      />

      {/* Hero with Search */}
      <SearchBar query={query} zipcode={searchZipCode} onSearch={handleSearch} isLoading={isPending} />

      <ResultCountInfo
        visibleCount={businesses.length}
        totalCount={totalCountofBusiness}
        selectedFoodType={selectedFoodType}
        selectedCategory={selectedCategory}
        selectedCity={selectedCity}
        zipCode={searchZipCode}
        clearAllFilters={clearAllFilters}
        isPending={isPending}
      />

      {initialLoading && !showSkeleton && <LoadingSkeleton />}
      {showSkeleton && <LoadingSkeleton />}
      {error && <ErrorState error={error} handleRetry={handleRetry} />}
      {showEmptyState && <EmptyState clearAllFilters={clearAllFilters} />}

      <BusinessGrid
        businesses={businesses}
        isPending={isPending}
        error={error}
      />

      {/* Show spinner only at the bottom when loading more */}
      {isLoadingMore && (
        <div className="flex justify-center py-4" aria-label="Loading more businesses">
          <LoadingSpinner />
        </div>
      )}

      <PaginationControls
        hasMore={hasMore}
        isPending={isPending}
        handleViewMoreBusiness={handleViewMoreBusiness}
        perPage={perPage}
        isDropdownOpen={isPaginationDropdownOpen}
        setIsDropdownOpen={setIsPaginationDropdownOpen}
        handlePerPageChange={handlePerPageChange}
      />
    </section>
  );
}
