"use client";

import { useState, useEffect, useCallback } from "react";
import { getBusinessesByLocation, getCities } from "@/services/db";
import { BusinessDetail } from "@/types/business.types";
import CitySelectionButtons from "./CitySelectionButtons";
import ZipCodeSearch from "./ZipCodeSearch";
import ContentHeader from "./ContentHeader";
import LoadingSkeleton from "./LoadingSkeleton";
import BusinessGrid from "./BusinessGrid";


type City = { CITY_NAME: string | null };

const MAIN_CITIES = [
  "Zurich",
  "Geneva",
  "Luzern",
  "Bern",
  "Interlaken",
  "Zermatt",
  "St. Moritz",
];

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
        zipCode: searchZipCode as string,
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

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setZipCode("");
    setIsDropdownOpen(false);
  };

  const otherCities = cities
    .filter((c) => c.CITY_NAME && !MAIN_CITIES.includes(c.CITY_NAME))
    .map((c) => c.CITY_NAME!)
    .slice(0, 10);

  const isLoading = loading.cities || loading.businesses;
  const showSkeleton = isLoading && !error;
  const showEmptyState = !isLoading && !error && businesses.length === 0;

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="sub-heading">
          Find Restaurants in Your City
        </h2>
        <p className="sub-heading-description">
          Discover incredible dining options in top cities across Switzerland,
          or search by postal code for local restaurants.
        </p>
      </div>

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
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      />

      <ContentHeader
        selectedCity={selectedCity}
        searchZipCode={searchZipCode}
      />

      {showSkeleton && <LoadingSkeleton />}

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
        <BusinessGrid businesses={businesses} />
      )}

      {/* <ViewAllLink selectedCity={selectedCity} searchZipCode={searchZipCode} /> */}
    </section>
  );
}
