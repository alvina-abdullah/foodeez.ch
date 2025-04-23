// services/database/featuredBusinessService.ts
'use server';

import { prisma } from "@/lib/prisma";
import { BusinessData } from "@/types/database";

type FoodCategory = 'All' | 'HALAL' | 'Vegetarian' | 'Vegan';
type FoodType = 'All' | 'Pizza & Pasta' | 'Fast Food' | 'Kebab & Donner' | 'Combo Box';

export async function getFeaturedBusiness(
  category: FoodCategory = 'All',
  foodType: FoodType = 'All',
): Promise<BusinessData[]> {
  try {
    // Build the base query
    let query = `
      SELECT * FROM business_detail_view_all 
      WHERE 1=1
    `;
    
    // Add category filter
    if (category !== 'All') {
      // Map category names to their corresponding food_type_id values
      const categoryMap: Record<string, number> = {
        'HALAL': 3,
        'Vegetarian': 2,
        'Vegan': 1
      };
      
      const categoryId = categoryMap[category];
      
      if (categoryId) {
        query += `
          AND Business_ID IN (
            SELECT BUSINESS_ID FROM business_2_food_type 
            WHERE FOOD_TYPE_ID = ${categoryId}
          )
        `;
      }
    }
    
    // Add food type filter
    if (foodType !== 'All') {
      // Map food types to their corresponding business_category_id values
      const foodTypeMap: Record<string, number[]> = {
        'Pizza & Pasta': [5, 6],
        'Fast Food': [7],
        'Kebab & Donner': [8],
        'Combo Box': [9, 10, 11]
      };
      
      const categoryIds = foodTypeMap[foodType];
      
      if (categoryIds && categoryIds.length > 0) {
        query += `
          AND Business_ID IN (
            SELECT BUSINESS_ID FROM business_2_business_category 
            WHERE BUSINESS_CATEGORY_ID IN (${categoryIds.join(',')})
          )
        `;
      }
    }
  
    
    // Limit and order the results
    query += `
      ORDER BY Ranking DESC, GOOGLE_RATING DESC
      LIMIT 12
    `;
    
    // Execute the raw query
    const results = await prisma.$queryRawUnsafe(query);
    return results as BusinessData[];
  } catch (error) {
    console.error("Error fetching featured businesses:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return [];
  }
}

// Function to get food types for dropdown
export async function getFoodTypes() {
  try {
    const foodTypes = await prisma.$queryRaw`
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
      LIMIT 10
    `;
    
    return foodTypes;
  } catch (error) {
    console.error("Error fetching food types:", error);
    return [];
  }
}
