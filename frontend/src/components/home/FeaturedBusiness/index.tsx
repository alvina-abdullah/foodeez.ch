"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessDetail } from "@/types/business.types";
import { useTransition } from "react";
import {
  getBusinessByFoodtypeCategoryLocation,
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
import ZipCodeSearch from "../CitySection/ZipCodeSearch";

const FOOD_TYPES = ["All", "Halal", "Vegetarian", "Vegan"] as const;
const FOOD_CATEGORIES = [
  "Pizza",
  "Pasta",
  "Fast Food",
  "Desserts",
  "Kebab & Donner",
  "Sushi",
  "Burgers",
  "Fried Chicken",
  "Tacos",
  "Biryani",
  "BBQ",
  "Vegan",
  "Vegetarian",
  "Seafood",
  "Chinese",
  "Italian",
  "Thai",
  "Middle Eastern",
  "Breakfast",
  "Salads",
  "Wraps",
  "Smoothies",
  "Ice Cream",
  "Cakes",
  "Curry",
  "Noodles",
  "Grill",
  "Steakhouse",
  "Bakery",
  "Juices",
] as const;

const INITIAL_FOOD_TYPE = "All";
const VISIBLE_CATEGORIES_LIMIT = 5;

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
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
  const [error, setError] = useState<string | null>(null);
  const [perPage, setPerPage] = useState(PER_PAGE_OPTIONS[0]);
  const [totalCountofBusiness, setTotalCountOfBusiness] = useState(0);
  const visibleCategories = FOOD_CATEGORIES.slice(0, VISIBLE_CATEGORIES_LIMIT);
  const hiddenCategories = FOOD_CATEGORIES.slice(VISIBLE_CATEGORIES_LIMIT);
  const [cities, setCities] = useState<{ CITY_NAME: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchZipCode, setSearchZipCode] = useState("");

  // Handler for city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setZipCode("");
  };

  // Handler for zip code search submit
  const handleZipCodeSearchSubmit = (zip: string) => {
    setZipCode(zip);
    setSelectedCity("");
    setSearchZipCode(zip);
    // Optionally trigger fetchBusinesses here if you want instant search
    // fetchBusinesses(1, perPage);
  };

  // Update selected category ID when category changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryIndex = FOOD_CATEGORIES.indexOf(selectedCategory as any);
      if (categoryIndex !== -1) {
        setSelectedCategoryId(categoryIndex + 1);
      } else {
        setSelectedCategoryId(undefined);
      }
    } else {
      setSelectedCategoryId(undefined);
    }
  }, [selectedCategory]);

  // Fetch city list on mount
  useEffect(() => {
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

  // Fetch businesses based on filters and perPage
  const fetchBusinesses = useCallback(
    async (batch: number = 1, perPageOverride?: number) => {
      try {
        setError(null);
        startTransition(async () => {
          const limit = (perPageOverride ?? perPage) * batch;
          const response = await getBusinessByFoodtypeCategoryLocation({
            foodType: selectedFoodType,
            categoryId: selectedCategoryId,
            city: searchZipCode? undefined : selectedCity, // city only if zipCode is empty
            zipCode: searchZipCode || undefined,
            limit,
          });

          const data = response.businesses;

          setTotalCountOfBusiness(response.totalCount);

          if (Array.isArray(data)) {
            setBusinesses(data);
            setHasMore(data.length >= limit);
          } else {
            console.error("Invalid business data format:", data);
            setError("Could not load businesses");
          }

          setInitialLoading(false);
        });
      } catch (err) {
        console.error("Error fetching businesses:", err);
        setError("Could not load businesses");
        setInitialLoading(false);
      }
    },
    [
      selectedFoodType,
      selectedCategoryId,
      selectedCity,
      searchZipCode,
      perPage,
      startTransition,
    ]
  );

  // Handle filter changes
  useEffect(() => {
    setCurrentBatch(1); // Reset batch when filters change
    fetchBusinesses(1, perPage);
  }, [
    selectedFoodType,
    selectedCategoryId,
    selectedCity,
    perPage,
    fetchBusinesses,
  ]);

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
    setZipCode("");
    setSearchZipCode("");
    setPerPage(PER_PAGE_OPTIONS[0]);
  };

  const handleViewMoreBusiness = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const nextBatch = currentBatch + 1;
    setCurrentBatch(nextBatch);
    fetchBusinesses(nextBatch);
  };

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetchBusinesses(currentBatch);
  };

  // Handle per page change
  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentBatch(1);
    fetchBusinesses(1, value);
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
    <section className="py-20">
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
        isDropdownOpen={isCategoryDropdownOpen}
        setIsDropdownOpen={setIsCategoryDropdownOpen}
        isPending={isPending}
      />

      <CitySelectionButtons
        mainCities={MAIN_CITIES}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        otherCities={otherCities}
        isDropdownOpen={isDropdownOpen}
        onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
      />

      <ZipCodeSearch
        zipCode={zipCode}
        setZipCode={setZipCode}
        setSearchZipCode={setSearchZipCode}
        onSearchSubmit={handleZipCodeSearchSubmit}
      />

      <ResultCountInfo
        visibleCount={businesses.length}
        totalCount={totalCountofBusiness}
        selectedFoodType={selectedFoodType}
        selectedCategory={selectedCategory}
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
