import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * City Service - Handles operations related to cities using database views
 */

export interface CityData {
  CITY_ID: number;
  CITY_CODE?: string | null;
  CITY_NAME?: string | null;
  businessCount?: number;
}

export interface BusinessByLocationOptions {
  city?: string;
  cityId?: number;
  zipCode?: string | number;
  limit?: number;
  offset?: number;
}

/**
 * Get all cities with optional business count
 */
export async function getCities(withBusinessCount = false): Promise<CityData[]> {
  if (!withBusinessCount) {
    // Get all cities without business count
    const cities = await prisma.$queryRaw<CityData[]>`
      SELECT 
        CITY_ID, 
        CITY_CODE, 
        CITY_NAME 
      FROM city 
      ORDER BY CITY_NAME ASC
    `;
    
    return cities;
  }
  
  // Get cities with business count using the business_detail_view_all
  const citiesWithCount = await prisma.$queryRaw<(CityData & { businessCount: number })[]>`
    SELECT 
      c.CITY_ID, 
      c.CITY_CODE, 
      c.CITY_NAME,
      COUNT(DISTINCT b.BUSINESS_ID) as businessCount
    FROM 
      city c
    LEFT JOIN 
      business_detail_view_all b ON c.CITY_ID = b.ADDRESS_CITY_ID AND b.APPROVED = 1 AND b.STATUS = 1
    GROUP BY 
      c.CITY_ID, c.CITY_CODE, c.CITY_NAME
    ORDER BY 
      c.CITY_NAME ASC
  `;
  
  return citiesWithCount;
}

/**
 * Get businesses by location (city or zipcode)
 */
export async function getBusinessesByLocation({
  city,
  cityId,
  zipCode,
  limit = 9,
  offset = 0
}: BusinessByLocationOptions = {}) {
  
  // Build the WHERE conditions
  const conditions: string[] = ['APPROVED = 1', 'STATUS = 1'];
  const params: any[] = [];
  
  if (cityId) {
    conditions.push('ADDRESS_CITY_ID = ?');
    params.push(cityId);
  } else if (city) {
    conditions.push('ADDRESS_TOWN = ?');
    params.push(city);
  } else if (zipCode) {
    conditions.push('ADDRESS_ZIP = ?');
    params.push(Number(zipCode));
  }
  
  // If no location filter is provided, return empty array
  if (conditions.length === 2 && !cityId && !city && !zipCode) {
    return [];
  }
  
  const whereClause = conditions.join(' AND ');
  
  // Get businesses that match the location criteria
  const businesses = await prisma.$queryRaw`
    SELECT 
      * 
    FROM 
      business_detail_view_all
    WHERE 
      ${Prisma.raw(whereClause)}
    ORDER BY 
      Ranking DESC, 
      GOOGLE_RATING DESC,
      BUSINESS_NAME ASC
    LIMIT ${limit}
    OFFSET ${offset}
  `;
  
  return businesses;
}

/**
 * Get city details by ID, including towns
 */
export async function getCityById(cityId: number) {
  // Get the city details
  const city = await prisma.$queryRaw<any[]>`
    SELECT 
      c.CITY_ID, 
      c.CITY_CODE, 
      c.CITY_NAME,
      COUNT(DISTINCT b.BUSINESS_ID) as businessCount
    FROM 
      city c
    LEFT JOIN 
      business_detail_view_all b ON c.CITY_ID = b.ADDRESS_CITY_ID AND b.APPROVED = 1 AND b.STATUS = 1
    WHERE 
      c.CITY_ID = ${cityId}
    GROUP BY 
      c.CITY_ID, c.CITY_CODE, c.CITY_NAME
  `;
  
  if (!city || city.length === 0) {
    return null;
  }
  
  // Get the city's towns
  const towns = await prisma.$queryRaw<any[]>`
    SELECT 
      ct.CITY_TWON_ID as TOWN_ID, 
      ct.TOWN, 
      ct.ZIPCODE,
      COUNT(DISTINCT b.BUSINESS_ID) as businessCount
    FROM 
      city_town ct
    LEFT JOIN 
      business_detail_view_all b ON (b.ADDRESS_TOWN = ct.TOWN OR b.ADDRESS_ZIP = ct.ZIPCODE)
        AND b.APPROVED = 1 AND b.STATUS = 1
    WHERE 
      ct.CITY_ID = ${cityId}
    GROUP BY 
      ct.CITY_TWON_ID, ct.TOWN, ct.ZIPCODE
    ORDER BY 
      ct.TOWN ASC
  `;
  
  // Return the city with its towns
  return {
    ...city[0],
    towns: towns || []
  };
}

/**
 * Get popular cities with most businesses, limited to top N
 */
export async function getPopularCities(limit = 6) {
  const popularCities = await prisma.$queryRaw<CityData[]>`
    SELECT 
      c.CITY_ID, 
      c.CITY_CODE, 
      c.CITY_NAME,
      COUNT(DISTINCT b.BUSINESS_ID) as businessCount
    FROM 
      city c
    JOIN 
      business_detail_view_all b ON c.CITY_ID = b.ADDRESS_CITY_ID 
    WHERE 
      b.APPROVED = 1 AND b.STATUS = 1
    GROUP BY 
      c.CITY_ID, c.CITY_CODE, c.CITY_NAME
    HAVING 
      COUNT(DISTINCT b.BUSINESS_ID) > 0
    ORDER BY 
      businessCount DESC, c.CITY_NAME ASC
    LIMIT ${limit}
  `;
  
  return popularCities;
}

/**
 * Search cities by name
 */
export async function searchCities(query: string, limit = 10) {
  if (!query) {
    return [];
  }
  
  const cities = await prisma.$queryRaw<CityData[]>`
    SELECT 
      c.CITY_ID, 
      c.CITY_CODE, 
      c.CITY_NAME,
      COUNT(DISTINCT b.BUSINESS_ID) as businessCount
    FROM 
      city c
    LEFT JOIN 
      business_detail_view_all b ON c.CITY_ID = b.ADDRESS_CITY_ID AND b.APPROVED = 1 AND b.STATUS = 1
    WHERE 
      c.CITY_NAME LIKE ${`%${query}%`}
    GROUP BY 
      c.CITY_ID, c.CITY_CODE, c.CITY_NAME
    ORDER BY 
      c.CITY_NAME ASC
    LIMIT ${limit}
  `;
  
  return cities;
}

/**
 * Get towns (sub-locations) by name or zip with optional business count
 */
export async function getTownsByNameOrZip(search: string, limit = 10) {
  if (!search) {
    return [];
  }
  
  const isNumeric = /^\d+$/.test(search);
  
  let whereClause = '';
  if (isNumeric) {
    whereClause = `ct.ZIPCODE LIKE ${`${search}%`}`;
  } else {
    whereClause = `ct.TOWN LIKE ${`%${search}%`}`;
  }
  
  const towns = await prisma.$queryRaw<any[]>`
    SELECT 
      ct.CITY_TWON_ID as TOWN_ID, 
      ct.TOWN, 
      ct.ZIPCODE,
      c.CITY_ID,
      c.CITY_NAME,
      COUNT(DISTINCT b.BUSINESS_ID) as businessCount
    FROM 
      city_town ct
    JOIN
      city c ON ct.CITY_ID = c.CITY_ID
    LEFT JOIN 
      business_detail_view_all b ON (b.ADDRESS_TOWN = ct.TOWN OR b.ADDRESS_ZIP = ct.ZIPCODE)
        AND b.APPROVED = 1 AND b.STATUS = 1
    WHERE 
      ${Prisma.raw(whereClause)}
    GROUP BY 
      ct.CITY_TWON_ID, ct.TOWN, ct.ZIPCODE, c.CITY_ID, c.CITY_NAME
    ORDER BY 
      businessCount DESC, ct.TOWN ASC
    LIMIT ${limit}
  `;
  
  return towns;
} 