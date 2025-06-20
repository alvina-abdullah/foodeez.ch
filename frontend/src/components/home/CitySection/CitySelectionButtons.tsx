"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

interface CitySelectionButtonsProps {
  mainCities: string[];
  selectedCity: string;
  onCitySelect: (city: string) => void;
  otherCities: string[];
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
}

export default function CitySelectionButtons({
  mainCities,
  selectedCity,
  onCitySelect,
  otherCities,
  isDropdownOpen,
  onDropdownToggle,
}: CitySelectionButtonsProps) {
  return (
    <div className="border border-accent mb-8 bg-secondary-light rounded-lg text-accent-dark">
      <div className="grid grid-cols-2 lg:flex gap-y-2 relative">
        {mainCities.map((city) => (
          <button
            key={city}
            onClick={() => onCitySelect(city)}
            className={cn(
              "lg:px-10 py-2 text-sm md:text-base transition-colors text-center",
              selectedCity === city
                ? "bg-primary text-white"
                : "bg-secondary-light hover:bg-primary-light"
            )}
          >
            {city}
          </button>
        ))}

        <div className="relative">
          <button
            onClick={onDropdownToggle}
            className={cn(
              "w-full lg:w-auto lg:px-10 py-2 text-sm md:text-base transition-colors text-center flex items-center justify-center gap-1",
              isDropdownOpen
                ? "bg-primary text-white"
                : "bg-secondary-light hover:bg-primary-light"
            )}
          >
            More Cities
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-200",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-auto md:w-56 max-h-96 overflow-y-auto rounded-xl shadow-lg border border-primary z-50 bg-white"
                id="no-scrollbar"
              >
                <div className="p-2 space-y-1">
                  {otherCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        onCitySelect(city);
                        onDropdownToggle(); // close dropdown after selection
                      }}
                      className="w-full text-left px-4 py-2 rounded-md text-sm transition-colors hover:bg-primary/10 text-text-main"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {otherCities.includes(selectedCity) && (
          <span className="lg:px-10 py-2 text-center bg-primary text-white text-sm md:text-base font-semibold">
            {selectedCity}
          </span>
        )}
      </div>
    </div>
  );
}
