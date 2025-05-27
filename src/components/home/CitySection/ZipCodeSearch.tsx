"use client";

import { MapPin, Search, X } from "lucide-react";
import { Autocomplete, LoadScript } from "@react-google-maps/api";

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

interface ZipCodeSearchProps {
  zipCode: string;
  setZipCode: (zip: string) => void;
  setSearchZipCode: (zip: string) => void;
  onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged: () => void;
}

export default function ZipCodeSearch({
  zipCode,
  setZipCode,
  setSearchZipCode,
  onLoad,
  onPlaceChanged,
}: ZipCodeSearchProps) {
  return (
    <div className="max-w-md mx-auto mb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (zipCode.trim()) {
            setSearchZipCode(zipCode);
          }
        }}
        className="flex items-center"
      >
        <div className="relative w-full">
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={libraries}
          >
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                types: ["geocode"],
                componentRestrictions: { country: "ch" },
              }}
            >
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                placeholder="Search by postal code..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={4}
              />
            </Autocomplete>
          </LoadScript>
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          {zipCode && (
            <button
              type="button"
              onClick={() => {
                setZipCode("");
                setSearchZipCode("");
              }}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
}
