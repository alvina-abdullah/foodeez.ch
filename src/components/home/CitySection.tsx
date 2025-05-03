"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, Search, Building, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBusinessesByLocation, getCities } from "@/lib/db";
import BusinessCard from "../BusinessCard";
import { BusinessDetail } from "@/types/business.types";
import { Autocomplete, LoadScript } from "@react-google-maps/api";

type City = { CITY_NAME: string | null };

const MAIN_CITIES = ["Zurich", "Geneva", "Luzern", "Bern"];
const INITIAL_CITY = "Zurich";

export default function CitySection() {
  const [cities, setCities] = useState<City[]>([]);
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [selectedCity, setSelectedCity] = useState(INITIAL_CITY);
  const [zipCode, setZipCode] = useState("");
  const [searchZipCode, setSearchZipCode] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState({ cities: true, businesses: true });
  const [error, setError] = useState<string | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Memoized fetch functions
  const fetchCities = useCallback(async () => {
    try {
      const data = await getCities();
      setCities(data.filter((c) => c.CITY_NAME));
      setError(null);
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Could not load cities.");
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  }, []);

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, businesses: true }));

      const data = await getBusinessesByLocation({
        city: selectedCity,
        zipCode: searchZipCode as any,
        limit: 12,
      });

      if (data.length === 0) {
        throw new Error("No businesses found");
      }

      setBusinesses(
        data.map((business) => ({
          ...business,
          BUSINESS_NAME: business.BUSINESS_NAME || undefined,
          SHORT_NAME: business.SHORT_NAME || undefined,
          DESCRIPTION: business.DESCRIPTION || undefined,
          ADDRESS_STREET: business.ADDRESS_STREET || undefined,
          ADDRESS_ZIP: business.ADDRESS_ZIP || undefined,
          ADDRESS_TOWN: business.ADDRESS_TOWN || undefined,
          ADDRESS_CITY_ID: business.ADDRESS_CITY_ID || undefined,
          CITY_CODE: business.CITY_CODE || undefined,
          CITY_NAME: business.CITY_NAME || undefined,
          ADDRESS_COUNTRY: business.ADDRESS_COUNTRY || undefined,
          PHONE_NUMBER: business.PHONE_NUMBER || undefined,
          WHATSAPP_NUMBER: business.WHATSAPP_NUMBER || undefined,
          WEB_ADDRESS: business.WEB_ADDRESS || undefined,
          LOGO: business.LOGO || undefined,
          FACEBOOK_LINK: business.FACEBOOK_LINK || undefined,
          INSTA_LINK: business.INSTA_LINK || undefined,
          TIKTOK_LINK: business.TIKTOK_LINK || undefined,
          GOOGLE_PROFILE: business.GOOGLE_PROFILE || undefined,
          IMAGE_URL: business.IMAGE_URL || undefined,
          GOOGLE_RATING: business.GOOGLE_RATING || undefined,
          APPROVED: business.APPROVED || undefined,
          STATUS: business.STATUS || undefined,
          Ranking: business.Ranking || undefined,
        })) as BusinessDetail[]
      );

      setError(null);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Could not load businesses.");
    } finally {
      setLoading((prev) => ({ ...prev, businesses: false }));
    }
  }, [selectedCity, searchZipCode]);

  // Initial data fetch
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Business data fetch
  useEffect(() => {
    if (selectedCity || searchZipCode) {
      fetchBusinesses();
    }
  }, [selectedCity, searchZipCode, fetchBusinesses]);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        const postalCodeComponent = place.address_components.find((component) =>
          component.types.includes("postal_code")
        );

        if (postalCodeComponent) {
          setZipCode(postalCodeComponent.long_name);
          setSearchZipCode(postalCodeComponent.long_name);
        }
      }
    }
  };

  // Handlers
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setZipCode("");
    setIsDropdownOpen(false);
  };

  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim()) {
      setSearchZipCode(zipCode);
      setSelectedCity("");
    }
  };

  // Derived state
  const otherCities = cities
    .filter((c) => c.CITY_NAME && !MAIN_CITIES.includes(c.CITY_NAME))
    .slice(0, 10);

  const isLoading = loading.cities || loading.businesses;
  const showSkeleton = isLoading && !error;
  const showEmptyState = !isLoading && !error && businesses.length === 0;

  return (
    <section className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Find Restaurants in Your City
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover incredible dining options in top cities across Switzerland,
          or search by postal code for local restaurants.
        </p>
      </div>

      {/* City Selection */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
        {MAIN_CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={cn(
              "px-4 py-2 rounded-full text-sm md:text-base transition-colors",
              selectedCity === city
                ? "bg-primary text-white font-medium"
                : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            {city}
          </button>
        ))}

        {/* Other Cities Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm md:text-base"
          >
            More Cities
            <ChevronDown
              size={16}
              className={isDropdownOpen ? "rotate-180" : ""}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {otherCities.map((city) => (
                  <button
                    key={city.CITY_NAME}
                    onClick={() => handleCitySelect(city.CITY_NAME!)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {city.CITY_NAME}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zip Code Search */}
      <div className="max-w-md mx-auto mb-10">
        <form onSubmit={handleZipSearch} className="flex items-center">
          <div className="relative w-full">
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
              libraries={["places"]}
            >
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
                options={{
                  types: ["geocode"],
                  componentRestrictions: { country: "ch" },
                }}
              >
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) =>
                    setZipCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Search by postal code..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={4}
                />
              </Autocomplete>
            </LoadScript>
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {zipCode && (
              <button
                type="button"
                onClick={() => {
                  setZipCode("");
                  setSearchZipCode("");
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Content Section */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <Building className="text-primary" size={24} />
        <h3 className="text-xl font-semibold">
          {selectedCity
            ? `Restaurants in ${selectedCity}`
            : searchZipCode
            ? `Restaurants near ${searchZipCode}`
            : "Popular Restaurants"}
        </h3>
      </div>

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
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {showEmptyState && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No restaurants found{selectedCity ? ` in ${selectedCity}` : ""}
          </p>
        </div>
      )}

      {!isLoading && !error && businesses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* View All Link */}
      <div className="text-center mt-10">
        <Link
          href={`/discover?${
            selectedCity ? `city=${selectedCity}` : `zip=${searchZipCode}`
          }`}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          View all restaurants
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
