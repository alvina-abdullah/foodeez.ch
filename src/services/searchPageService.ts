'use server';

import { BusinessDetail } from "@/types/business.types";
import { prisma } from "../lib/prisma"

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

export async function searchBusinesses({
    searchTerm = '',
    category = 'All',
    foodType = 'All',
    priceRange = 'All',
    rating = 0,
    page = 1,
    limit = 12,
    sortBy = 'popularity',
    name = '',
    zipCode = '',
  }: FilterOptions & { name?: string; zipCode?: string }): Promise<{ businesses: BusinessDetail[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
  
      let query = `
        SELECT * FROM business_detail_view_all 
        WHERE 1=1
      `;
  
      let countQuery = `
        SELECT COUNT(*) as total FROM business_detail_view_all 
        WHERE 1=1
      `;
  
      // Name filter
      if (name) {
        const nameCondition = ` AND BUSINESS_NAME LIKE '%${name}%' `;
        query += nameCondition;
        countQuery += nameCondition;
      }
  
      // Zip Code filter
      if (zipCode) {
        const zipCondition = ` AND ADDRESS_ZIP = '${zipCode}' `;
        query += zipCondition;
        countQuery += zipCondition;
      }
  
      // Search term filter (existing logic)
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
            AND BUSINESS_ID IN (
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
            AND BUSINESS_ID IN (
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
            AND BUSINESS_ID IN (
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
        businesses: results as BusinessDetail[],
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
  