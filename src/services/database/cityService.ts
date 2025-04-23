'use server';

import { prisma } from "@/lib/prisma";

// Interface for city data
export interface CityData {
  CITY_ID: number;
  CITY_NAME: string;
  CITY_CODE?: string;
  restaurantCount?: number;
  imageUrl?: string;
}

// /**
//  * Get cities with optional restaurant count
//  * @param withRestaurantCount Whether to include restaurant count for each city
//  * @returns List of cities with restaurant count if requested
//  */
export async function getCities(withRestaurantCount: boolean = false) {
  try {
    if (withRestaurantCount) {
      // Fetch cities with restaurant count using a raw query for better performance
      const cities = await prisma.$queryRaw`
        SELECT 
          c.CITY_ID,
          c.CITY_NAME,
          c.CITY_CODE,
          COUNT(b.BUSINESS_ID) as restaurantCount
        FROM 
          city c
        LEFT JOIN 
          business b ON c.CITY_ID = b.ADDRESS_CITY_ID AND b.STATUS = 1 AND b.APPROVED = 1
        GROUP BY 
          c.CITY_ID
        ORDER BY 
          restaurantCount DESC, c.CITY_NAME ASC
      `;
      
      return cities;
    } else {
      // Just fetch the cities without restaurant count
      const cities = await prisma.$queryRaw`
        SELECT * FROM city
        ORDER BY CITY_NAME ASC
      `;
      
      return cities;
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}

/**
 * Fetch businesses by city name or ZIP code
 */
export async function getBusinessesByLocation(options: {
  city?: string;
  zipCode?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const { city, zipCode, limit = 9, offset = 0 } = options;

    // Use raw query for better performance with complex filtering
    let query = `
      SELECT * FROM business_detail_view_all
      WHERE STATUS = 1 AND APPROVED = 1
    `;
    
    if (city) {
      query += ` AND ADDRESS_TOWN = '${city.replace(/'/g, "''")}'`;
    }
    
    if (zipCode) {
      query += ` AND ADDRESS_ZIP = '${zipCode.replace(/'/g, "''")}'`;
    }
    
    query += `
      ORDER BY GOOGLE_RATING DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const businesses = await prisma.$queryRawUnsafe(query);
    return businesses;
  } catch (error) {
    console.error('Error fetching businesses by location:', error);
    return [];
  }
} 