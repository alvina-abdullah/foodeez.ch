'use client';

import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
import BusinessCard from '@/components/core/BusinessCard';
import { BusinessDetail } from '@/types/business.types';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { searchBusinesses } from '@/services/searchPageService';

export default function SearchPage() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState({
    name: '',
    zipCode: ''
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!searchQuery.name && !searchQuery.zipCode) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await searchBusinesses(searchQuery);
        setBusinesses(result);
        if (result.length === 0) {
          setError('No businesses found matching your search');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching for businesses');
        setBusinesses([]);
      } finally {
        setIsLoading(false);
        setSearchPerformed(true);
      }
    };

    fetchBusinesses();
  }, [searchQuery]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearchQuery({
      name: formData.get('name') as string,
      zipCode: formData.get('zipCode') as string
    });
  };

  return (
    <div className="py-8">
      {/* Search Form */}
      <div className="mb-12">
        <h1 className="main-heading text-center">Find Your Favorite Business</h1>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter business name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                placeholder="Enter ZIP code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto md:px-8 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search size={20} />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center py-4 text-red-600">
          {error}
        </div>
      )}

      {/* Results */}
      {searchPerformed && (
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching for businesses...</p>
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.BUSINESS_ID} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                We couldn't find any business matching your search.
              </h2>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or explore our featured businesses.
              </p>
              <Link
                href="/business/register"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Own a business? Register it now on Foodeez!
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
