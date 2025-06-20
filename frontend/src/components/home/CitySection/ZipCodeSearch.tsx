"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import GoogleMapsProvider from "@/components/providers/GoogleMapsProvider";

interface ZipCodeSearchProps {
  zipCode: string;
  setZipCode: (zip: string) => void;
  setSearchZipCode: (zip: string) => void;
  onSearchSubmit: (zip: string) => void;
}

// Add type declaration for Google Maps
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
      };
    };
  }
}

export default function ZipCodeSearch({
  zipCode,
  setZipCode,
  setSearchZipCode,
  onSearchSubmit,
}: ZipCodeSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check for Google Maps API loading
  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsGoogleMapsLoaded(true);
      return;
    }

    const checkInterval = setInterval(() => {
      if (window.google?.maps?.places) {
        setIsGoogleMapsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!isGoogleMapsLoaded || !inputRef.current) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(regions)"],
          componentRestrictions: { country: "ch" },
          fields: ["address_components", "formatted_address"],
        }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();

        if (place?.address_components) {
          const postalCodeComponent = place.address_components.find(
            (component) => component.types.includes("postal_code")
          );

          if (postalCodeComponent) {
            const zipOnly = postalCodeComponent.long_name.trim();
            setZipCode(zipOnly);
            setSearchZipCode(zipOnly);
            onSearchSubmit(zipOnly);
          }
        }
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
  }, [isGoogleMapsLoaded, setZipCode, setSearchZipCode, onSearchSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputRef.current?.value.trim();
    if (!raw) return;

    // Extract 4-digit Swiss ZIP only from input like "8050 Zürich"
    const zipOnly = raw.match(/\b\d{4}\b/)?.[0]; // Matches "8050"
    if (zipOnly) {
      setZipCode(zipOnly);
      setSearchZipCode(zipOnly);
      onSearchSubmit(zipOnly);
    }
  };

  const handleClear = () => {
    setZipCode("");
    setSearchZipCode("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <GoogleMapsProvider>
        <div className="max-w-md mx-auto mb-10">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="flex items-center"
          >
            <div className="relative w-full">
              <div
                className={`relative ${isFocused ? "ring-2 ring-primary/20" : ""}`}
              >
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search by postal code..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-tl-lg rounded-bl-lg bg-white focus:border-primary focus:outline-none text-base placeholder:text-gray-400 transition shadow-sm"
                  aria-label="Search by postal code"
                />
                {zipCode && (
                  <motion.button
                    type="button"
                    onClick={handleClear}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </div>
            </div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 lg:px-6 lg:py-3 bg-primary text-white rounded-tr-lg rounded-br-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          </motion.form>
        </div>
      </GoogleMapsProvider>
    </>
  );
}
