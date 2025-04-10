'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';
import SearchInput from '@/components/core/SearchInput';

export default function TopSection() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  
  // Fetch visitor count or any other data you need
  useEffect(() => {
    // For demonstration, using a static number
    // In a real app, you would fetch this from an API
    setVisitorCount(10000);
    
    // Simulating API call
    // const fetchVisitorCount = async () => {
    //   try {
    //     const response = await fetch('/api/stats/visitors');
    //     const data = await response.json();
    //     setVisitorCount(data.count);
    //   } catch (error) {
    //     console.error('Error fetching visitor count:', error);
    //     setVisitorCount(10000); // Fallback number
    //   }
    // };
    // 
    // fetchVisitorCount();
  }, []);
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/discover?q=${encodeURIComponent(query)}`;
    }
  };
  
  return (
    <div className="w-full bg-orange-100 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Visitor Count Display */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2">
          <p className="text-secondary-800 font-medium text-lg">
            More than {visitorCount?.toLocaleString() || 'many'} daily visitors
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Star 
                key={index} 
                size={20} 
                fill="#FFD700" 
                className="text-yellow-400" 
              />
            ))}
          </div>
        </div>
        
        {/* Banner - This could be a rotating message or image */}
        <div className="bg-orange-200 rounded-lg p-8 mb-10 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-800 mb-4">
            Discover Amazing Food Experiences
          </h1>
          <p className="text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto">
            Find, visit, and enjoy the best restaurants, cafes, and food spots in your area
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchInput
            placeholder="Search for restaurants, food types, or cuisines..."
            size="lg"
            variant="default"
            shadow="md"
            showSearchButton
            searchButtonText="Search"
            onSearch={handleSearch}
          />
          
          {/* Food Type Quick Links */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link 
              href="/discover?type=all" 
              className="bg-yellow-300 text-center py-2 rounded font-medium hover:bg-yellow-400 transition-colors"
            >
              All
            </Link>
            <Link 
              href="/discover?type=halal" 
              className="bg-yellow-100 text-center py-2 rounded font-medium hover:bg-yellow-200 transition-colors"
            >
              HALAL
            </Link>
            <Link 
              href="/discover?type=vegetarian" 
              className="bg-yellow-100 text-center py-2 rounded font-medium hover:bg-yellow-200 transition-colors"
            >
              Vegetarian
            </Link>
            <Link 
              href="/discover?type=vegan" 
              className="bg-yellow-100 text-center py-2 rounded font-medium hover:bg-yellow-200 transition-colors"
            >
              Vegan
            </Link>
          </div>
          
          {/* Cuisine Types */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link 
              href="/discover?cuisine=pizza" 
              className="bg-white text-center py-2 border border-gray-200 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Pizza & Pasta
            </Link>
            <Link 
              href="/discover?cuisine=fastfood" 
              className="bg-white text-center py-2 border border-gray-200 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Fast Food
            </Link>
            <Link 
              href="/discover?cuisine=kebab" 
              className="bg-white text-center py-2 border border-gray-200 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              Kebab & Donner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 