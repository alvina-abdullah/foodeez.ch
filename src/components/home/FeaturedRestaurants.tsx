'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Utensils, TrendingUp } from 'lucide-react';
import { business } from '@prisma/client';
import slugify from 'slugify';
import BusinessCard from '../../features/business/components/BusinessCard';

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState<business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        setIsLoading(true);
        // Use our new recommendations API for better results
        const response = await fetch('/api/business?minRating=4&limit=6');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured restaurants');
        }
        
        const data = await response.json();
        setRestaurants(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured restaurants:', err);
        setError('Could not load featured restaurants. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedRestaurants();
  }, []);
  
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
            Top Rated
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-4 mb-3">
            Foodeez Featured Selection
          </h2>
          <p className="text-text-muted">
            Discover our hand-picked selection of outstanding food establishments with exceptional flavors and service
          </p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="text-center text-danger p-4 bg-danger-light/20 rounded-lg">
            {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <BusinessCard key={restaurant.BUSINESS_ID} business={restaurant} />
              ))
            ) : (
              // Fallback data for development or when empty response is received
              Array.from({ length: 6 }).map((_, index) => (
                <PlaceholderCard key={index} index={index} />
              ))
            )}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link 
            href="/search" 
            className="btn-primary"
          >
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