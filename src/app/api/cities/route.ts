import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const withRestaurantCount = url.searchParams.get('withRestaurantCount') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Get all cities
    const cities = await prisma.city.findMany({
      take: limit,
      orderBy: {
        CITY_NAME: 'asc',
      },
      where: {
        CITY_NAME: {
          not: null,
        },
      },
    });
    
    // If restaurant count is requested, we need to count businesses in each city
    if (withRestaurantCount) {
      // This approach is not the most efficient for large datasets
      // For a production app, you should consider aggregating this data or using raw SQL
      
      const citiesWithCounts = await Promise.all(
        cities.map(async (city) => {
          // Get businesses for this city by checking ADDRESS_TOWN field
          // This assumes businesses use the city name in their town field
          const businessCount = await prisma.business.count({
            where: {
              ADDRESS_TOWN: {
                equals: city.CITY_NAME,
                mode: 'insensitive', // Case insensitive comparison
              },
              APPROVED: 1,
              STATUS: 1,
            },
          });
          
          return {
            ...city,
            restaurantCount: businessCount,
          };
        })
      );
      
      // Sort cities by restaurant count (descending)
      const sortedCities = citiesWithCounts.sort(
        (a, b) => (b.restaurantCount || 0) - (a.restaurantCount || 0)
      );
      
      return NextResponse.json(sortedCities);
    }
    
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" }, 
      { status: 500 }
    );
  }
} 