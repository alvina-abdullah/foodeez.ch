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

/**
 * Get categories from the businessCategory table for displaying in the UI
 */
export async function getBusinessCategories() {
  try {
    // Fetch from the main businessCategory table (not view)
    const categories = await prisma.businessCategory.findMany({
      select: {
        id: true,
        categoryName: true
      },
      orderBy: {
        categoryName: 'asc'
      }
    });
    
    
    // Format for UI display
    return categories.map(cat => ({
      Business_category_id: cat.id,
      Category_name: cat.categoryName || ''
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
}): Promise<any[]> {
  const { foodType, category, limit = 9 } = params;
  const normalizedType = foodType.toLowerCase();

  try {
    // First fetch businesses based on food type
    let businesses: any[] = [];
    
    if (normalizedType === 'halal') {
      businesses = await prisma.business_detail_view_halal.findMany({
        take: Math.min(limit, 50),
        orderBy: { BUSINESS_NAME: 'asc' }
      });
    } else if (normalizedType === 'vegan') {
      businesses = await prisma.business_detail_view_vegan.findMany({
        take: Math.min(limit, 50),
        orderBy: { BUSINESS_NAME: 'asc' }
      });
    } else if (normalizedType === 'vegetarian') {
      businesses = await prisma.business_detail_view_vegetarian.findMany({
        take: Math.min(limit, 50),
        orderBy: { BUSINESS_NAME: 'asc' }
      });
    } else {
      // Default to 'all' businesses
      businesses = await prisma.business_detail_view_all.findMany({
        take: Math.min(limit, 50),
        orderBy: { BUSINESS_NAME: 'asc' }
      });
    }

    // If category is specified, filter businesses by category
    if (category) {
      // Get businesses in this category
      const businessCategories = await prisma.business_2_business_category_view.findMany({
        where: {
          CATEGORY_NAME: category
        }
      });
      
      // Extract business IDs that belong to this category
      const businessIdsInCategory = businessCategories
        .map(bc => bc.BUSINESS_ID)
        .filter(id => id !== null && id !== undefined);
      
      // Filter the businesses to only include those in the category
      businesses = businesses.filter(
        business => businessIdsInCategory.includes(business.BUSINESS_ID)
      );
    }

    // Normalize the result format
    return businesses.map(business => {
      // Determine the ranking field based on the view type
      const ranking = business.IFNULL_d_Ranking__0_ !== undefined
        ? business.IFNULL_d_Ranking__0_
        : (business.Ranking || 0);
        
      // Return a consistent object format
      return {
        ...business,
        Ranking: ranking
      };
    });
  } catch (error) {
    console.error(`Error fetching ${foodType} businesses:`, error);
    return [];
  }
}

/**
 * Fetch businesses by both food type (halal, vegan, etc) and category ID
 * This function works with the businessCategory table's ID
 */
export async function getBusinessesByTypeAndCategories(params: {
  foodType: string;
  categoryId?: number; // The category ID from businessCategory table
  limit?: number;
}): Promise<any[]> {
  const { foodType, categoryId, limit = 12 } = params;
  const normalizedType = foodType.toLowerCase();
  
  try {
    console.log(`Fetching businesses with foodType: ${foodType}, categoryId: ${categoryId}`);
    
    // Step 1: If category is specified, get business IDs that have this category
    let businessIdsInCategory: number[] = [];
    
    if (categoryId !== undefined) {
      // Get businesses linked to this category through the relation table
      const businessCategoryLinks = await prisma.businessToBusinessCategory.findMany({
        where: {
          businessCategoryId: categoryId,
          status: 1 // Only active relations
        },
        select: {
          businessId: true
        }
      });
      
      businessIdsInCategory = businessCategoryLinks
        .map(link => link.businessId)
        .filter((id): id is number => id !== null && id !== undefined);
      
      console.log(`Found ${businessIdsInCategory.length} businesses in category ${categoryId}`);
      
      // If no businesses found in this category, return empty array
      if (businessIdsInCategory.length === 0) {
        return [];
      }
    }
    
    // Step 2: Get businesses based on food type and category filter
    let businesses: any[] = [];
    const whereClause = categoryId !== undefined
      ? { BUSINESS_ID: { in: businessIdsInCategory } }
      : {};
    
    try {
      // Select appropriate database view based on food type
      if (normalizedType === 'halal') {
        businesses = await prisma.business_detail_view_halal.findMany({
          where: whereClause,
          take: Math.min(limit, 50),
          orderBy: { BUSINESS_NAME: 'asc' }
        });
      } else if (normalizedType === 'vegan') {
        businesses = await prisma.business_detail_view_vegan.findMany({
          where: whereClause,
          take: Math.min(limit, 50),
          orderBy: { BUSINESS_NAME: 'asc' }
        });
      } else if (normalizedType === 'vegetarian') {
        businesses = await prisma.business_detail_view_vegetarian.findMany({
          where: whereClause,
          take: Math.min(limit, 50),
          orderBy: { BUSINESS_NAME: 'asc' }
        });
      } else {
        // Default to 'all' businesses
        businesses = await prisma.business_detail_view_all.findMany({
          where: whereClause,
          take: Math.min(limit, 50),
          orderBy: { BUSINESS_NAME: 'asc' }
        });
      }
      
      console.log(`Found ${businesses.length} businesses matching criteria`);
    } catch (dbError) {
      console.error(`Error querying food type view (${normalizedType}):`, dbError);
      // Fallback to all businesses view if specific view fails
      businesses = await prisma.business_detail_view_all.findMany({
        where: whereClause,
        take: Math.min(limit, 50),
        orderBy: { BUSINESS_NAME: 'asc' }
      });
    }

    // Step 3: Normalize results for consistent structure
    return businesses.map(business => {
      // Determine the ranking field based on the view type
      const ranking = business.IFNULL_d_Ranking__0_ !== undefined
        ? business.IFNULL_d_Ranking__0_
        : (business.Ranking || 0);
        
      return {
        ...business,
        Ranking: ranking
      };
    });
  } catch (error) {
    console.error(`Error fetching businesses by type and categories:`, error);
    return [];
  }
}

/**
 * Get all available business categories directly from the view
 */
export async function getBusinessCategoryIDs() {
  try {
    // Get unique categories from the view
    const categories = await prisma.business_2_business_category_view.findMany({
      distinct: ['BUSINESS_CATEGORY_ID', 'CATEGORY_NAME'],
      where: {
        STATUS: 1 // Only active categories
      },
      select: {
        BUSINESS_CATEGORY_ID: true,
        CATEGORY_NAME: true
      },
      orderBy: {
        CATEGORY_NAME: 'asc'
      }
    });
    
    console.log('Available categories:', categories);
    
    // Format as expected by the UI
    return categories.map(cat => ({
      Business_category_id: cat.BUSINESS_CATEGORY_ID,
      Category_name: cat.CATEGORY_NAME || ''
    }));
  } catch (error) {
    console.error('Error fetching business category IDs:', error);
    return [];
  }
}