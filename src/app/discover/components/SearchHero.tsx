"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

interface SearchHeroProps {
  query: string;
  onSearch: (query: string) => void;
  popularSearches: string[];
  isLoading: boolean;
}

export default function SearchHero({ query, onSearch, popularSearches, isLoading }: SearchHeroProps) {
  const [searchValue, setSearchValue] = useState(query);
  const [isFocused, setIsFocused] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    onSearch("");
    // Focus the input after clearing
    const input = document.getElementById("search-input");
    if (input) {
      (input as HTMLInputElement).focus();
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-primary/90 to-accent/90 text-white">
      {/* Background Image (pre-loaded via CSS for better performance) */}
      <div 
        className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-20" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundPosition: "center 40%",
        }}
      ></div>
      
      {/* Content */}
      <div className="relative container max-w-7xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Discover Amazing Food Experiences
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Find the best restaurants, cafes, and food spots in your area
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto"
        >
          <div 
            className={`flex items-center bg-white rounded-full p-1.5 shadow-lg transition-all ${
              isFocused ? "ring-4 ring-primary/20" : ""
            }`}
          >
            <span className="pl-4 text-primary">
              <Search size={24} />
            </span>
            
            <input
              id="search-input"
              type="text"
              placeholder="Search for restaurants, cuisines, or dishes..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 py-3 px-4 text-text-main outline-none text-lg bg-transparent rounded-full"
            />
            
            {searchValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 md:px-8 bg-primary hover:bg-primary-dark text-white font-medium rounded-full transition-colors flex items-center space-x-2 disabled:opacity-70"
            >
              {isLoading ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
              ) : (
                "Search"
              )}
            </button>
          </div>
          
          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-wrap justify-center gap-2"
            >
              <span className="text-white/80 text-sm">Popular:</span>
              {popularSearches.slice(0, 5).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSearch(term)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </motion.div>
          )}
        </motion.form>
      </div>
    </div>
  );
} 