"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import RestaurantCard from "@/components/features/BusinessCard";
import { business } from "@prisma/client";

interface DiscoverClientProps {
  initialBusinesses: business[];
  cuisines: string[];
  locations: string[];
}

export default function DiscoverClient({ 
  initialBusinesses,
  cuisines,
  locations
}: DiscoverClientProps) {
  // Initialize with empty values to avoid hydration mismatches
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  // Set default values after hydration is complete
  useEffect(() => {
    setSelectedCuisine("All");
    setSelectedLocation("All");
    setIsClient(true);
  }, []);

  // Filter businesses based on search term, cuisine, and location
  const filteredBusinesses = useMemo(() => {
    if (!isClient) return initialBusinesses;
    
    return initialBusinesses.filter(business => {
      const matchesSearch = !searchTerm || 
        (business.BUSINESS_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesCuisine = selectedCuisine === "All" || selectedCuisine === "" || 
        cuisines.includes(selectedCuisine);
      const matchesLocation = selectedLocation === "All" || selectedLocation === "" || 
        locations.includes(selectedLocation);

      return matchesSearch && matchesCuisine && matchesLocation;
    });
  }, [initialBusinesses, searchTerm, selectedCuisine, selectedLocation, isClient]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search Header */}
      <section className="bg-primary-600 py-12">
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
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search for restaurants, dishes, or cuisines..."
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <div className="bg-white rounded-full px-4 py-2 text-sm shadow-sm">
                <select
                  className="bg-transparent focus:outline-none text-secondary-800"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  disabled={!isClient}
                >
                  {isClient && cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-full px-4 py-2 text-sm shadow-sm">
                <select
                  className="bg-transparent focus:outline-none text-secondary-800"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  disabled={!isClient}
                >
                  {isClient && locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">
            {filteredBusinesses.length}{" "}
            {filteredBusinesses.length === 1 ? "Restaurant" : "Restaurants"} Found
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <RestaurantCard
                key={business.BUSINESS_ID}
                size="md"
                shadow="lg"
                business={business}
              />
            ))}
          </div>

          {!filteredBusinesses.length && (
            <div className="text-center py-12">
              <p className="text-xl text-secondary-600">
                No restaurants found matching your criteria.
              </p>
              <p className="mt-2 text-secondary-500">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Cuisines */}
      {isClient && (
        <section className="py-12 bg-accent-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-secondary-800 mb-6">
              Popular Cuisines
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cuisines.slice(1, 9).map((cuisine, index) => (
                <motion.div
                  key={cuisine}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg p-4 text-center cursor-pointer hover:bg-accent-100 transition-colors shadow-sm"
                  onClick={() => {
                    setSelectedCuisine(cuisine);
                    setSearchTerm("");
                  }}
                >
                  <p className="font-medium text-secondary-800">{cuisine}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}