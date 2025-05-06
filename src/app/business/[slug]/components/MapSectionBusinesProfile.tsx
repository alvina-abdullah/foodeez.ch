import { useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { Card } from "@/components/ui/card"; // Adjust path as needed

interface MapCardProps {
  placeId: string;
}

export default function MapCard({ placeId }: MapCardProps) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "Google Maps API key is not defined in environment variables."
    );
  }
  if (!placeId) {
    throw new Error("Place ID is required to display the map.");
  }

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    if (placeId) {
      const service = new google.maps.places.PlacesService(map);
      service.getDetails({ placeId }, (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          setCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  };

  return (
    <Card className="bg-gray-100">
      {placeId ? (
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={["places"]}
        >
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={center || { lat: 0, lng: 0 }}
            zoom={center ? 15 : 1}
            onLoad={handleLoad}
          />
        </LoadScript>
      ) : (
        <div className="p-8 flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-xl font-semibold">Google Map</h3>
            <p className="text-gray-500 mt-2">Map would be displayed here</p>
          </div>
        </div>
      )}
    </Card>
  );
}
