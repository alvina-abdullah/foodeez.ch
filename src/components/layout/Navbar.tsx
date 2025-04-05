'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';
import SearchInput from '../core/SearchInput';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const pathname = usePathname();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  const handleSearch = (term: string) => {
    if (term.trim()) {
      window.location.href = `/discover?q=${encodeURIComponent(term)}`;
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-200 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/95 shadow-sm'
    }`}>
      {/* Top header integration */}
      <div className="hidden md:block">
        <div className="w-full h-0.5 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-heading font-bold text-primary-600">
                Foodeez
              </span>
            </Link>
          </div>

          {/* Search bar that shows only when activated on mobile/tablet */}
          {isSearchOpen && (
            <div className="absolute left-0 right-0 top-0 h-16 bg-white z-10 px-4 flex items-center sm:px-6 lg:hidden">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search for restaurants, cuisines..."
                size="md"
                variant="pill"
                className="flex-1"
                showSearchButton
              />
              <button
                type="button"
                className="ml-2 text-secondary-500 hover:text-secondary-700"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <Link
              href="/discover"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/discover' 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              Discover
            </Link>
            <Link
              href="/businesses"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/businesses' 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              Businesses
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname === '/about' 
                  ? 'text-primary-600 font-semibold' 
                  : 'text-secondary-600 hover:text-primary-600'
              }`}
            >
              About
            </Link>
            
            <div className="relative group">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors">
                For Businesses
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-left hidden group-hover:block z-10">
                <Link
                  href="/businesses/register"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  Register Your Business
                </Link>
                <Link
                  href="/pricing"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  Pricing Plans
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
            
            {/* Desktop Search */}
            <div className="hidden lg:block w-64">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Search..."
                size="sm"
                variant="pill"
              />
            </div>
            
            <Link
              href="/(auth)/login"
              className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/(auth)/register"
              className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="p-2 text-secondary-500 hover:text-primary-600 focus:outline-none"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              className="p-2 ml-2 text-secondary-500 hover:text-primary-600 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-secondary-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/discover"
              className={`block px-3 py-2.5 text-base font-medium rounded-md ${
                pathname === '/discover' 
                  ? 'text-primary-600 bg-primary-50 font-semibold' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Discover
            </Link>
            <Link
              href="/businesses"
              className={`block px-3 py-2.5 text-base font-medium rounded-md ${
                pathname === '/businesses' 
                  ? 'text-primary-600 bg-primary-50 font-semibold' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              Businesses
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2.5 text-base font-medium rounded-md ${
                pathname === '/about' 
                  ? 'text-primary-600 bg-primary-50 font-semibold' 
                  : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              About
            </Link>
            
            <div className="border-t border-gray-100 my-2 py-2">
              <p className="px-3 py-1 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                For Businesses
              </p>
              <Link
                href="/businesses/register"
                className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md"
              >
                Register Your Business
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md"
              >
                Pricing Plans
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-md"
              >
                Contact Sales
              </Link>
            </div>
            
            <div className="border-t border-gray-100 my-2 pt-4 pb-2 flex flex-col space-y-2">
              <Link
                href="/(auth)/login"
                className="block px-3 py-2.5 text-center text-base font-medium text-primary-600 border border-primary-600 rounded-full hover:bg-primary-50"
              >
                Login
              </Link>
              <Link
                href="/(auth)/register"
                className="block px-3 py-2.5 text-center text-base font-medium bg-primary-600 text-white rounded-full hover:bg-primary-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 