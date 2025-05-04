"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";

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
    <div className="flex flex-wrap  mb-8 border border-black rounded-lg bg-primary-100 ">
      {mainCities.map((city) => (
        <button
          key={city}
          onClick={() => onCitySelect(city)}
          className={cn(
            "px-8 py-2 text-sm md:text-base transition-colors",
            selectedCity === city
              ? "bg-primary text-white font-medium"
              : "bg-primary-100 hover:bg-primary-200"
          )}
        >
          {city}
        </button>
      ))}

      <div className="relative">
        <button
          onClick={onDropdownToggle}
          className="flex items-center gap-1 px-8 py-2  bg-primary-100 hover:bg-primary-200 text-sm md:text-base"
        >
          More Cities
          <ChevronDown
            size={16}
            className={isDropdownOpen ? "rotate-180" : ""}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {otherCities.map((city) => (
                <button
                  key={city}
                  onClick={() => onCitySelect(city)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
