'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Utensils } from 'lucide-react';

interface City {
  CITY_ID: number;
  CITY_NAME: string;
  restaurantCount?: number;
  imageUrl?: string;
}

export default function CitySection() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/cities?withRestaurantCount=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        
        const data = await response.json();
        setCities(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Could not load cities. Please try again later.');
        
        // Fallback to sample data in case of error
        setCities([
          { CITY_ID: 1, CITY_NAME: 'Zurich', restaurantCount: 120 },
          { CITY_ID: 2, CITY_NAME: 'Geneva', restaurantCount: 85 },
          { CITY_ID: 3, CITY_NAME: 'Interlaken', restaurantCount: 45 },
          { CITY_ID: 4, CITY_NAME: 'Luzern', restaurantCount: 67 },
          { CITY_ID: 5, CITY_NAME: 'St. Moritz', restaurantCount: 38 },
          { CITY_ID: 6, CITY_NAME: 'Bern', restaurantCount: 72 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCities();
  }, []);
  
  // City images - these would ideally come from your database or a CDN
  const cityImages = {
    'Zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'Geneva': 'https://images.unsplash.com/photo-1588693273928-92231d0bc282?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'Interlaken': 'https://images.unsplash.com/photo-1531410050434-010ec9fc29a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'Luzern': 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1970&q=80',
    'St. Moritz': 'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    'Bern': 'https://images.unsplash.com/photo-1624105900527-8fccb4386796?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
  };
  
  return (
    <section className="section-padding bg-background-muted">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              Locations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-main">
              Explore by City
            </h2>
          </div>
          
          <p className="mt-2 md:mt-0 text-text-muted max-w-md">
            Discover the best restaurants, cafes, and food spots in cities across Switzerland
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Featured Cities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.slice(0, 6).map((city, index) => {
                const cityImage = cityImages[city.CITY_NAME as keyof typeof cityImages] || 
                  'https://images.unsplash.com/photo-1586108681141-b60183eb7776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
                  
                return (
                  <motion.div
                    key={city.CITY_ID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/discover?location=${encodeURIComponent(city.CITY_NAME)}`} className="block">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={cityImage}
                          alt={city.CITY_NAME}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                          <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                            <h3 className="text-2xl font-bold mb-2">{city.CITY_NAME}</h3>
                            <div className="flex items-center">
                              <span className="flex items-center text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Utensils className="w-3.5 h-3.5 mr-1.5 text-white" />
                                {city.restaurantCount} Restaurants
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Explore CTA */}
                        <div className="absolute right-6 bottom-6 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                          <div className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium">
                            Explore
                            <Navigation className="w-3.5 h-3.5 ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            
            {/* View All Cities Button */}
            <div className="text-center mt-12">
              <Link href="/discover" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full 
                        text-base font-medium text-text-main hover:bg-white transition-colors">
                View All Cities
                <MapPin className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
} 