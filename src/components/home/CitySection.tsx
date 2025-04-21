'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, Search, Building, X } from 'lucide-react';
import BusinessCard from '../../features/business/components/BusinessCard';
import { cn } from '@/lib/utils';
import { getCities, getBusinessesByLocation, type CityData } from '@/services/database/cityService';

interface Business {
  BUSINESS_ID: number;
  BUSINESS_NAME: string | null;
  IMAGE_URL: string | null;
  ADDRESS_TOWN: string | null;
  DESCRIPTION: string | null;
  GOOGLE_RATING: string | null;
  [key: string]: any;
}

export default function CitySection() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Zurich');
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  
  // List of main Swiss cities to display as buttons
  const mainCities = ['Zurich', 'Geneva', 'Interlaken', 'Luzern', 'St. Moritz'];
  
  useEffect(() => {
    const fetchCitiesData = async () => {
      try { 
        setIsLoading(true);
        // Use the server action directly instead of the API route
        const data = await getCities(true) as CityData[];
        
        if (data && data.length > 0) {
          setCities(data);
          setError(null);
        } else {
          throw new Error('No city data returned');
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Could not load cities.');
        
       
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCitiesData();
  }, []);
  
  // Fetch businesses for the selected city
  useEffect(() => {
    const fetchBusinessesData = async () => {
      try {
        setIsLoading(true);
        
        // Use the server action directly instead of the API route
        const data = await getBusinessesByLocation({
          city: selectedCity || undefined,
          zipCode: zipCode || undefined,
          limit: 9
        });
        
        if (data && Array.isArray(data)) {
          setBusinesses(data as Business[]);
          setError(null);
        } else {
          throw new Error('Failed to fetch businesses');
        }
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError('Could not load businesses.');
        
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessesData();
  }, [selectedCity, zipCode]);
  
  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setZipCode(''); // Clear zip code when selecting a city
  };
  
  // Handle zip code search
  const handleZipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic could be added here
    if (zipCode.trim()) {
      setSelectedCity(''); // Clear selected city when searching by zip
    }
  };

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

      {/* City tabs navigation */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
        {mainCities.map((city) => (
          <button
            key={city}
            onClick={() => handleCitySelect(city)}
            className={cn(
              'px-4 py-2 rounded-full text-sm md:text-base transition-colors',
              selectedCity === city
                ? 'bg-primary text-white font-medium'
                : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            {city}
          </button>
        ))}

        {/* Other cities dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm md:text-base transition-colors"
          >
            More Cities
            <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180' : ''} />
          </button>
        
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
              <div className="py-1">
                {cities
                  .filter(city => !mainCities.includes(city.CITY_NAME))
                  .slice(0, 10) // Limit to 10 additional cities
                  .map(city => (
                    <button
                      key={city.CITY_ID}
                      onClick={() => {
                        handleCitySelect(city.CITY_NAME);
                        setIsDropdownOpen(false);
                      }}
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

      {/* Zip code search */}
      <div className="max-w-md mx-auto mb-10">
        <form onSubmit={handleZipSearch} className="flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Search by postal code..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <MapPin size={18} />
            </div>
            {zipCode && (
              <button
                type="button"
                onClick={() => setZipCode('')}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

      {/* City heading with dynamic count */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <Building className="text-primary" size={24} />
        <h3 className="text-xl font-semibold">
          {selectedCity ? (
            <>
              Restaurants in {selectedCity}
              {cities.find(c => c.CITY_NAME === selectedCity)?.restaurantCount && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({cities.find(c => c.CITY_NAME === selectedCity)?.restaurantCount} restaurants)
                </span>
              )}
            </>
          ) : zipCode ? (
            <>Restaurants near {zipCode}</>
          ) : (
            <>Popular Restaurants</>
          )}
        </h3>
      </div>

      {/* Loading and error states */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <div 
                key={index} 
                className="bg-gray-100 rounded-lg overflow-hidden h-64 animate-pulse"
              />
            ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No restaurants found{selectedCity ? ` in ${selectedCity}` : zipCode ? ` near ${zipCode}` : ''}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <motion.div
              key={business.BUSINESS_ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BusinessCard business={business} />
            </motion.div>
          ))}
        </div>
      )}

      {/* View all link */}
      <div className="text-center mt-10">
        <Link 
          href={selectedCity ? `/restaurants?city=${encodeURIComponent(selectedCity)}` : zipCode ? `/restaurants?zipCode=${zipCode}` : "/restaurants"}
          className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
        >
          View all restaurants
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </section>
  );
} 