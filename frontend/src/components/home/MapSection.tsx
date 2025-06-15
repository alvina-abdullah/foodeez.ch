"use client";

import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const defaultZoom = 14;

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export default function MapSection() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setHasPermission(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasPermission(true);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setHasPermission(false);
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <div className="relative w-full h-[600px] mt-10 rounded-xl overflow-hidden shadow-md">
      {hasPermission === null && (
        <div className="flex items-center justify-center h-full text-gray-500">
          Requesting location permission...
        </div>
      )}

      {hasPermission === true && userLocation && (
        <>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation}
              zoom={defaultZoom}
              options={{
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
              }}
            >
              <Marker position={userLocation} title="You are here!" />
            </GoogleMap>
          </LoadScript>
        </>
      )}

      {hasPermission === false && (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-600 text-center px-6">
          <h2 className="text-xl font-semibold mb-2">Location Access Denied</h2>
          <p className="mb-4">
            It looks like you've blocked location access. To try again, please
            enable it from your browser settings and reload the page.
          </p>
          <span className="text-6xl my-4">📍</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-primary text-white px-4 py-2 rounded hover:bg-primary-700 transition"
          >
            Reload Page
          </button>
        </div>
      )}
    </div>
  );
}
