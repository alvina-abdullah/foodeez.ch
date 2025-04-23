'use server';

import { Prisma } from "@prisma/client";
import { prisma } from "./prisma"
import { BusinessCategory, BusinessDetail } from "@/types/business.types";

// Example function to test the schema
export async function getBusinesses() {
  try {
    const businesses = await prisma.business_detail_view_all.findMany({
      take: 9 // Limit to 9 results
    })
    // Return as is - already using uppercase field names from the DB view
    return businesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export async function getBusinessById(id: number) {
  try {
    const business = await prisma.business_detail_view_all.findUnique({
      where: {
        BUSINESS_ID: id
      }
    })
    return business
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

// Function to get distinct cities from the database
export async function getCities() {
  try {
    const cities = await prisma.business_detail_view_all.findMany({
      select: {
        CITY_NAME: true,
      },
      distinct: ['CITY_NAME'],
      orderBy: {
        CITY_NAME: 'asc'
      }
    });
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

interface BusinessQueryParams {
  city?: string;
  zipCode?: string;
  limit?: number;
}

type BusinessResult = Prisma.business_detail_view_allGetPayload<{}>[];

export async function getBusinessesByLocation({
  city,
  zipCode,
  limit = 9
}: BusinessQueryParams): Promise<BusinessResult> {
  try {
    // Validate at least one search parameter exists
    if (!city && !zipCode) return [];

    // Build where clause conditions
    const conditions: Prisma.business_detail_view_allWhereInput[] = [];

    if (city?.trim()) {
      conditions.push({ CITY_NAME: { equals: city.trim() } });
    }

    if (zipCode?.trim()) {
      const numericZip = parseInt(zipCode.trim(), 10);
      if (!isNaN(numericZip)) {
        conditions.push({ ADDRESS_ZIP: { equals: numericZip } });
      }
    }

    // If no valid conditions after validation, return empty
    if (conditions.length === 0) return [];

    return await prisma.business_detail_view_all.findMany({
      where: { OR: conditions },
      take: Math.min(limit ?? 9, 50), // Prevent excessive limits
      orderBy: { BUSINESS_NAME: 'asc' }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Database error:', error.code, error.message);
    } else if (error instanceof Error) {
      console.error('Unexpected error fetching businesses:', error.message);
    }
    return [];
  }
}


export async function getFeaturedBusinesses(limit: number = 9): Promise<BusinessResult> {
  try {
    // Fetch top businesses based on ranking
    const businesses = await prisma.business_detail_view_all.findMany({
      where: {
        Ranking: {
          not: undefined // Ensure ranking exists
        }
      },
      orderBy: {
        Ranking: 'asc'
      },
      take: Math.min(limit, 50), // Prevent fetching too many results
    });

    return businesses;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Database error fetching featured businesses:', error.code, error.message);
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }

    return [];
  }
}


export async function getBusinessCategories(): Promise<BusinessCategory[]> {
  try {
    const categories = await prisma.business_category_view.findMany();
    return categories.map(category => ({
      Business_category_id: category.Business_category_id,
      Category_name: category.Category_name || ''
    }));
  } catch (error) {
    console.error('Error fetching business categories:', error);
    return [];
  }
}

export async function getBusinessesByType(params: {
  foodType: string;
  category?: string;
  limit?: number;
}): Promise<BusinessDetail[]> {
  const { foodType, category, limit = 9 } = params;
  const normalizedType = foodType.toLowerCase();

  try {
    const models = {
      all: prisma.business_detail_view_all,
      halal: prisma.business_detail_view_halal,
      vegan: prisma.business_detail_view_vegan,
      vegetarian: prisma.business_detail_view_vegetarian
    };

    const modelKey = normalizedType in models ? normalizedType as keyof typeof models : 'all';
    const model = models[modelKey];

    const whereClause = category ? { Category_name: { equals: category } } : {};

    const businesses = await model.findMany({
      take: Math.min(limit, 50),
      where: whereClause,
      orderBy: { BUSINESS_NAME: 'asc' }
    });

    return businesses as BusinessDetail[];
  } catch (error) {
    console.error(`Error fetching ${foodType} businesses:`, error);
    return [];
  }
}