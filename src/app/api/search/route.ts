import { NextRequest, NextResponse } from 'next/server';
import { searchBusinesses, searchFoodItems, getTrendingSearches, getPopularDishes } from '@/services/database/searchService';

/**
 * Enhanced Search API
 * Provides advanced search capabilities for businesses and food items
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || 'business'; // business, food, or trending
    const category = searchParams.get('category') ? Number(searchParams.get('category')) : undefined;
    const city = searchParams.get('city') || undefined;
    const foodType = searchParams.get('foodType') || undefined;
    const businessId = searchParams.get('businessId') ? Number(searchParams.get('businessId')) : undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const rating = searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    
    let results;

    switch (type) {
      case 'business':
        // Search for businesses with enhanced features
        results = await searchBusinesses({
          query,
          category,
          city: city ? isNaN(parseInt(city)) ? city : parseInt(city) : undefined,
          foodType,
          rating,
          page,
          limit,
          sortBy: sortBy as any,
        });
        
        return NextResponse.json({
          success: true,
          type: 'business',
          data: results.businesses,
          pagination: {
            total: results.pagination.totalCount,
            page: results.pagination.page,
            limit: results.pagination.limit,
            hasMore: results.pagination.page < results.pagination.totalPages,
            totalPages: results.pagination.totalPages,
          },
        });
        
      case 'food':
        // Search for food items
        results = await searchFoodItems({
          query,
          businessId,
          category,
          minPrice,
          maxPrice,
          page,
          limit,
          sortBy: sortBy as any,
        });
        
        return NextResponse.json({
          success: true,
          type: 'food',
          data: results.menuItems,
          pagination: {
            total: results.pagination.totalCount,
            page: results.pagination.page,
            limit: results.pagination.limit,
            hasMore: results.pagination.page < results.pagination.totalPages,
            totalPages: results.pagination.totalPages,
          },
        });
        
      case 'trending':
        // Get trending searches
        const trendingSearches = await getTrendingSearches();
        
        return NextResponse.json({
          success: true,
          type: 'trending',
          data: trendingSearches,
        });
      
      case 'popular-dishes':
        // Get popular dishes
        const popularDishes = await getPopularDishes(limit);
        
        return NextResponse.json({
          success: true,
          type: 'popular-dishes',
          data: popularDishes,
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid search type. Use "business", "food", "trending", or "popular-dishes".' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An error occurred while processing search request',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Example query parameters:
// /api/search?query=thai&type=business&city=zurich&foodType=1&rating=4&sortBy=rating&page=1&limit=10
// /api/search?query=curry&type=food&minPrice=10&maxPrice=20&sortBy=price_asc&page=1&limit=10
// /api/search?type=trending
// /api/search?type=popular-dishes&limit=5

// Example of how to create a SQL View for better search performance
// This would be executed directly in your database, not in this file

/*
CREATE VIEW vw_business_search AS
SELECT 
    b.BUSINESS_ID,
    b.BUSINESS_NAME,
    b.SHORT_NAME,
    b.DESCRIPTION,
    b.ADDRESS_STREET,
    b.ADDRESS_ZIP,
    b.ADDRESS_TOWN,
    b.ADDRESS_COUNTRY,
    b.PHONE_NUMBER,
    b.IMAGE_URL,
    b.GOOGLE_RATING,
    b.WEB_ADDRESS,
    b.FACEBOOK_LINK,
    b.INSTA_LINK,
    b.APPROVED,
    b.STATUS,
    GROUP_CONCAT(DISTINCT bc.CATEGORY_NAME) AS categories,
    GROUP_CONCAT(DISTINCT ft.TITLE) AS food_types
FROM 
    business b
LEFT JOIN 
    business_2_business_category b2bc ON b.BUSINESS_ID = b2bc.BUSINESS_ID
LEFT JOIN 
    business_category bc ON b2bc.BUSINESS_CATEGORY_ID = bc.BUSINESS_CATEGORY_ID
LEFT JOIN 
    business_2_food_type b2ft ON b.BUSINESS_ID = b2ft.BUSINESS_ID
LEFT JOIN 
    food_type ft ON b2ft.FOOD_TYPE_ID = ft.FOOD_TYPE_ID
WHERE 
    b.APPROVED = 1 AND b.STATUS = 1
GROUP BY 
    b.BUSINESS_ID;
*/ 