'use server';

import { prisma } from "@/lib/prisma";
import { DiscoverBusiness } from "@/types/discover.types";

type FilterOptions = {
  searchTerm?: string;
  category?: string;
  foodType?: string;
  priceRange?: string;
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'popularity' | 'newest';
};

/**
 * Searches businesses based on various filters
 */
export async function searchBusinesses({
  searchTerm = '',
  category = 'All',
  foodType = 'All',
  priceRange = 'All',
  rating = 0,
  page = 1,
  limit = 12,
  sortBy = 'popularity',
}: FilterOptions): Promise<{ businesses: DiscoverBusiness[]; total: number }> {
  try {
    const offset = (page - 1) * limit;
    
    // Base query
    let query = `
      SELECT * FROM business_detail_view_all 
      WHERE 1=1
    `;
    
    let countQuery = `
      SELECT COUNT(*) as total FROM business_detail_view_all 
      WHERE 1=1
    `;
    
    // Search term filter
    if (searchTerm) {
      const searchCondition = `
        AND (
          BUSINESS_NAME LIKE '%${searchTerm}%' 
          OR DESCRIPTION LIKE '%${searchTerm}%'
          OR ADDRESS_TOWN LIKE '%${searchTerm}%'
          OR ADDRESS_STREET LIKE '%${searchTerm}%'
        )
      `;
      query += searchCondition;
      countQuery += searchCondition;
    }
    
    // Category filter
    if (category && category !== 'All') {
      // Map category names to their corresponding business_category_id values
      const categoryMap: Record<string, number[]> = {
        'Pizza & Pasta': [5, 6],
        'Fast Food': [7],
        'Kebab & Donner': [8],
        'Combo Box': [9, 10, 11]
      };
      
      const categoryIds = categoryMap[category];
      
      if (categoryIds && categoryIds.length > 0) {
        const categoryCondition = `
          AND Business_ID IN (
            SELECT BUSINESS_ID FROM business_2_business_category 
            WHERE BUSINESS_CATEGORY_ID IN (${categoryIds.join(',')})
          )
        `;
        query += categoryCondition;
        countQuery += categoryCondition;
      }
    }
    
    // Food type filter
    if (foodType && foodType !== 'All') {
      // Map food types to their corresponding food_type_id values
      const foodTypeMap: Record<string, number> = {
        'HALAL': 3,
        'Vegetarian': 2,
        'Vegan': 1
      };
      
      const foodTypeId = foodTypeMap[foodType];
      
      if (foodTypeId) {
        const foodTypeCondition = `
          AND Business_ID IN (
            SELECT BUSINESS_ID FROM business_2_food_type 
            WHERE FOOD_TYPE_ID = ${foodTypeId}
          )
        `;
        query += foodTypeCondition;
        countQuery += foodTypeCondition;
      }
    }
    
    // Price range filter
    if (priceRange && priceRange !== 'All') {
      const priceRangeMap: Record<string, number> = {
        'Budget': 1,
        'Mid-Range': 2,
        'Premium': 3,
        'Luxury': 4
      };
      
      const priceRangeId = priceRangeMap[priceRange];
      
      if (priceRangeId) {
        const priceCondition = `
          AND Business_ID IN (
            SELECT BUSINESS_ID FROM business_detail 
            WHERE PRICE_RANGE_ID = ${priceRangeId}
          )
        `;
        query += priceCondition;
        countQuery += priceCondition;
      }
    }
    
    // Rating filter
    if (rating > 0) {
      const ratingCondition = `
        AND CAST(GOOGLE_RATING AS FLOAT) >= ${rating}
      `;
      query += ratingCondition;
      countQuery += ratingCondition;
    }
    
    // Sorting
    switch (sortBy) {
      case 'rating':
        query += ` ORDER BY CAST(GOOGLE_RATING AS FLOAT) DESC`;
        break;
      case 'newest':
        query += ` ORDER BY BUSINESS_ID DESC`;
        break;
      case 'popularity':
      default:
        query += ` ORDER BY Ranking DESC, CAST(GOOGLE_RATING AS FLOAT) DESC`;
        break;
    }
    
    // Pagination
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    // Execute queries
    const [results, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(query),
      prisma.$queryRawUnsafe(countQuery)
    ]);
    
    const total = Array.isArray(countResult) && countResult.length > 0 
      ? Number(countResult[0].total) 
      : 0;
    
    return { 
      businesses: results as DiscoverBusiness[], 
      total 
    };
  } catch (error) {
    console.error("Error searching businesses:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return { businesses: [], total: 0 };
  }
}

/**
 * Get popular search terms
 */
export async function getPopularSearchTerms(): Promise<string[]> {
  // This would typically be backed by a real database table tracking searches
  // For now, returning static popular search terms
  return [
    "Pizza",
    "Indian",
    "Chinese",
    "Fast Food",
    "Halal",
    "Vegan",
    "Burger",
    "Italian",
    "Healthy",
    "Breakfast"
  ];
}

/**
 * Get food categories for filters
 */
export async function getFoodCategories(): Promise<{ id: number; name: string; count: number }[]> {
  try {
    const categories = await prisma.$queryRaw`
      SELECT 
        bc.BUSINESS_CATEGORY_ID as id,
        bc.CATEGORY_NAME as name,
        COUNT(b2bc.BUSINESS_ID) as count
      FROM 
        business_category bc
      LEFT JOIN 
        business_2_business_category b2bc ON bc.BUSINESS_CATEGORY_ID = b2bc.BUSINESS_CATEGORY_ID
      GROUP BY 
        bc.BUSINESS_CATEGORY_ID
      HAVING 
        count > 0
      ORDER BY 
        count DESC
    `;
    
    return categories as { id: number; name: string; count: number }[];
  } catch (error) {
    console.error("Error fetching food categories:", error);
    return [];
  }
}

/**
 * Get dietary preferences
 */
export async function getDietaryPreferences(): Promise<{ id: number; name: string; count: number }[]> {
  try {
    const preferences = await prisma.$queryRaw`
      SELECT 
        ft.FOOD_TYPE_ID as id,
        ft.FOOD_TYPE_NAME as name,
        COUNT(b2ft.BUSINESS_ID) as count
      FROM 
        food_type ft
      LEFT JOIN 
        business_2_food_type b2ft ON ft.FOOD_TYPE_ID = b2ft.FOOD_TYPE_ID
      GROUP BY 
        ft.FOOD_TYPE_ID
      HAVING 
        count > 0
      ORDER BY 
        count DESC
    `;
    
    return preferences as { id: number; name: string; count: number }[];
  } catch (error) {
    console.error("Error fetching dietary preferences:", error);
    return [];
  }
}

/**
 * Get price ranges
 */
export async function getPriceRanges(): Promise<{ id: number; name: string; symbol: string }[]> {
  return [
    { id: 1, name: "Budget", symbol: "£" },
    { id: 2, name: "Mid-Range", symbol: "££" },
    { id: 3, name: "Premium", symbol: "£££" },
    { id: 4, name: "Luxury", symbol: "££££" }
  ];
}
