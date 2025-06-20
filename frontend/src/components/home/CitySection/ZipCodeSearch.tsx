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
    }
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
          const postalCodeComponent = place.address_components.find((comp) =>
            comp.types.includes("postal_code")
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
      console.error("Google Places Autocomplete error:", error);
    }
  }, [isGoogleMapsLoaded, setZipCode, setSearchZipCode, onSearchSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputRef.current?.value.trim();
    if (!raw) return;

    const zipOnly = raw.match(/\b\d{4}\b/)?.[0];
    if (zipOnly) {
      setZipCode(zipOnly);
      setSearchZipCode(zipOnly);
      onSearchSubmit(zipOnly);
    }
  };

  const handleClear = () => {
    setZipCode("");
    setSearchZipCode("");
    inputRef.current?.focus();
  };

  return (
    <GoogleMapsProvider>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="mx-auto mb-10 w-full max-w-xl px-4 sm:px-6"
      >
        <div className="flex flex-col sm:flex-row items-stretch w-full">
          {/* Input Field */}
          <div className="relative w-full sm:rounded-l-lg sm:border-r-0 border border-gray-300 rounded-lg sm:rounded-none">
            <MapPin
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by postal code..."
              aria-label="Search by postal code"
              className={`w-full py-3 pl-10 pr-10 text-base placeholder:text-gray-400 transition rounded-lg sm:rounded-none sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                isFocused ? "ring-2 ring-primary/20" : ""
              }`}
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="mt-3 sm:mt-0 sm:ml-2 px-5 py-3 sm:px-6 sm:py-3 bg-primary text-white rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Search</span>
          </motion.button>
        </div>
      </motion.form>
    </GoogleMapsProvider>
  );
}
