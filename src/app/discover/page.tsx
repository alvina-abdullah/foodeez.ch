import prisma from "@/lib/prisma";
import { Metadata } from "next";
import DiscoverClient from "./DiscoverClient";
import { getBusinessCategories, getFoodTypes } from "@/services/database/searchService";

export const metadata: Metadata = {
  title: "Discover Restaurants | Foodeez",
  description: "Explore top restaurants and local favorites. Find the perfect dining experience with our advanced search options.",
};

export default async function DiscoverPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  try {
    // Get the initial data based on search parameters if available
    const query = searchParams?.q || '';
    const cuisine = searchParams?.cuisine || '';
    const city = searchParams?.city || '';
    const rating = searchParams?.rating ? Number(searchParams.rating) : undefined;
    const sortBy = searchParams?.sort || 'relevance';
    
    // Fetch all required data
    const [businesses, foodTypes, categories, cities] = await Promise.all([
      // Fetch initial businesses
      prisma.business.findMany({
        where: {
          APPROVED: 1,
          STATUS: 1,
        },
        take: 12,
        orderBy: {
          CREATION_DATETIME: 'desc',
        },
        include: {
          business_rating: true,
          business_2_business_category: {
            include: {
              business_category: true,
            }
          },
          business_reviews: {
            take: 1,
            orderBy: {
              CREATION_DATETIME: 'desc'
            }
          }
        }
      }),
      // Fetch food types for filtering
      prisma.food_type.findMany({
        orderBy: {
          TITLE: 'asc',
        },
      }),
      // Fetch business categories
      prisma.business_category.findMany({
        orderBy: {
          CATEGORY_NAME: 'asc',
        },
      }),
      // Fetch cities for location filtering
      prisma.city.findMany({
        orderBy: {
          CITY_NAME: 'asc',
        },
      })
    ]);
    
    console.log("Data loaded successfully:", {
      businessesCount: businesses.length,
      foodTypesCount: foodTypes.length,
      categoriesCount: categories.length,
      citiesCount: cities.length
    });

    return (
      <DiscoverClient
        initialBusinesses={businesses}
        foodTypes={foodTypes}
        categories={categories}
        cities={cities}
      />
    );
  } catch (error) {
    console.error("Failed to load discover page data:", error);
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