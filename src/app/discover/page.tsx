import prisma from "@/lib/prisma";
import { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";

export const metadata: Metadata = {
  title: "Discover Restaurants | FoodFinder",
  description: "Explore top restaurants and local favorites near you. Filter by cuisine, location, and specialties.",
};

export default async function DiscoverPage() {
  try {

    const businesses = await prisma.business.findMany({
      take: 50,
      skip: 90
    });

    console.log("Businesses loaded:", businesses.length);

    // Extract unique cuisines and locations
    const cuisines = await prisma.food_category.findMany();
    
    const locations = await prisma.city.findMany({
      select: {
        CITY_NAME: true,
      },
    });

    return <DiscoverClient
      initialBusinesses={businesses}
      cuisines={['All', ...cuisines.filter(cuisine => cuisine.TITLE !== null).map(cuisine => cuisine.TITLE as string)]}
      locations={['All', ...locations.filter(location => location.CITY_NAME !== null).map(location => location.CITY_NAME as string)]}
    />;
  } catch (error) {
    console.error("Failed to load businesses:", error);
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Loading Error</h1>
          <p className="text-red-500">Failed to load restaurant data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}