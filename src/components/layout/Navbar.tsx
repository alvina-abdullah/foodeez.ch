'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchInput from '../core/SearchInput';
import DropdownMenu from '../core/DropDownMenu';
import MobileMenu from '../MobileMenu';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingSearches, setTrendingSearches] = useState<{id: number, term: string, count: number}[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {  
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  // Fetch trending searches
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/search?type=trending');
        const data = await response.json();
        if (data.success) {
          setTrendingSearches(data.data);
        }
      } catch (error) {
        console.error('Error fetching trending searches:', error);
      }
    };
    
    fetchTrending();
  }, []);
  
  // When search term changes, fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      try {
        // This would be a lightweight API endpoint that returns quick suggestions
        // For now, we'll simulate it with trending searches
        const filteredSuggestions = trendingSearches
          .filter(item => item.term.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(item => item.term);
          
        // Add some common prefixes and suffixes to the search term for suggestions
        const searchTermWithPrefixes = [
          searchTerm,
          `${searchTerm} restaurant`,
          `${searchTerm} food`,
          `best ${searchTerm}`,
          `${searchTerm} near me`
        ];
        
        // Create a combined array of suggestions without duplicates
        const combinedSuggestions = Array.from(
          new Set([...filteredSuggestions, ...searchTermWithPrefixes])
        ).slice(0, 5);
        
        setSuggestions(combinedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, trendingSearches]);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      setSearchTerm('');
      setShowSuggestions(false);
      router.push(`/discover?q=${encodeURIComponent(term)}`);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  return (
    <nav
      className={`z-50 sticky top-0 transition-all duration-300 ${isScrolled
        ? 'bg-white shadow-md'
        : 'bg-white/90 backdrop-blur-sm'
        }`}
      aria-label="Main Navigation"
    >
      {/* Top Gradient Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent to-secondary" />

      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary font-heading">
            Foodeez
          </Link>

          {/* Search (mobile only) */}
          {isSearchOpen && (
            <div className="absolute top-0 inset-x-0 h-16 bg-white flex items-center z-50 px-4 sm:px-6 lg:hidden">
              <div className="relative flex-1">
                <SearchInput
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value)}
                  onSearch={handleSearch}
                  placeholder="Search for restaurants, cuisines..."
                  size="sm"
                  variant="pill"
                  className="flex-1"
                  showSearchButton
                />
                
                {/* Mobile Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-3 hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-5">
            {[
              { label: 'Discover', href: '/discover' },
              { label: 'About', href: '/about' }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium px-3 py-2 transition-colors rounded-md ${pathname === link.href
                  ? 'text-primary bg-primary/10'
                  : 'text-text-main hover:text-primary hover:bg-primary/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu
              label="For Businesses"
              items={[
                { label: 'Register Your Business', href: '/business/register' },
                { label: 'Pricing Plans', href: '/pricing' },
                { label: 'Contact Sales', href: '/contact' },
              ]}
            />

            <div className="w-64 hidden lg:block relative">
              <SearchInput
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                onSearch={handleSearch}
                placeholder="Search restaurants, dishes..."
                size="sm"
                variant="pill"
              />
              
              {/* Desktop Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/signin"
              className="text-sm font-medium text-primary hover:text-primary-dark transition"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Icons */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-text-muted hover:text-primary transition"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-text-muted hover:text-primary transition"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      <AnimatePresence>{isMenuOpen && <MobileMenu isMenuOpen />}</AnimatePresence>
    </nav>
  );
};

export default Navbar;
