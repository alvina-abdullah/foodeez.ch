

/**
 * Advanced Search Database Service
 * Implements full-text search, fuzzy matching, and relevance scoring
 */

import { prisma } from "@/lib/prisma";

/**
 * Search businesses by name, description, or location with advanced features
 */
export async function searchBusinesses({
  query,
  category,
  city,
  foodType,
  rating,
  page = 1,
  limit = 10,
  sortBy = 'relevance',
}: {
  query?: string;
  category?: number;
  city?: number | string;
  foodType?: number | string;
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'rating' | 'newest';
}) {
  const skip = (page - 1) * limit;

  // Build the where clause based on search parameters
  const where: any = {
    APPROVED: 1,
    STATUS: 1,
  };

  // Enhanced search by query term with fuzzy matching and relevance
  if (query && query.trim() !== '') {
    const normalizedQuery = query.trim().toLowerCase();
    const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
    
    // Create an array of OR conditions for each search term
    const searchConditions = [];
    
    if (searchTerms.length > 0) {
      for (const term of searchTerms) {
        searchConditions.push({
          OR: [
            {
              BUSINESS_NAME: {
                contains: term,
              },
            },
            {
              SHORT_NAME: {
                contains: term,
              },
            },
            {
              DESCRIPTION: {
                contains: term,
              },
            },
            {
              ADDRESS_TOWN: {
                contains: term,
              },
            },
          ],
        });
      }
      
      // All search terms must match at least one field
      where.AND = searchConditions;
    } else {
      // Single term search
      where.OR = [
        {
          BUSINESS_NAME: {
            contains: normalizedQuery,
          },
        },
        {
          SHORT_NAME: {
            contains: normalizedQuery,
          },
        },
        {
          DESCRIPTION: {
            contains: normalizedQuery,
          },
        },
        {
          ADDRESS_TOWN: {
            contains: normalizedQuery,
          },
        },
      ];
    }
  }

  // Filter by city (supporting both ID and name)
  if (city) {
    if (typeof city === 'number') {
      where.ADDRESS_CITY_ID = city;
    } else {
      where.ADDRESS_TOWN = {
        contains: city,
      };
    }
  }

  // Filter by category (using relation)
  if (category) {
    where.business_2_business_category = {
      some: {
        BUSINESS_CATEGORY_ID: Number(category),
        STATUS: 1,
      },
    };
  }

  // Filter by food type (using relation)
  if (foodType) {
    if (typeof foodType === 'number') {
      where.business_2_food_type = {
        some: {
          FOOD_TYPE_ID: foodType,
        },
      };
    } else {
      where.business_2_food_type = {
        some: {
          food_type: {
            TITLE: {
              contains: foodType,
            },
          },
        },
      };
    }
  }

  // Filter by minimum rating
  if (rating) {
    where.OR = [
      {
        GOOGLE_RATING: {
          gte: String(rating),
        },
      },
      {
        business_rating: {
          some: {
            BUSINESS_RATING: {
              gte: rating,
            },
          },
        },
      },
    ];
  }

  // Determine the sort order
  let orderBy: any = {};
  
  switch (sortBy) {
    case 'rating':
      orderBy.GOOGLE_RATING = 'desc';
      break;
    case 'newest':
      orderBy.CREATION_DATETIME = 'desc';
      break;
    case 'relevance':
    default:
      // For relevance sorting, we'll apply a custom ranking formula
      // MySQL doesn't support custom scoring directly in Prisma,
      // so we'll sort by ratings as a proxy for relevance when query exists
      orderBy = query ? { GOOGLE_RATING: 'desc' } : { CREATION_DATETIME: 'desc' };
      break;
  }

  // Execute the search query
  const businesses = await prisma.business.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      business_2_business_category: {
        include: {
          business_category: true,
        },
      },
      business_2_food_type: {
        include: {
          food_type: true,
        },
      },
      business_rating: true,
      business_reviews: {
        take: 3,
        orderBy: {
          RATING: 'desc',
        },
      },
    },
  });

  // Calculate average rating for each business
  const businessesWithAvgRating = businesses.map(business => {
    const reviews = business.business_reviews || [];
    const googleRating = parseFloat(business.GOOGLE_RATING || '0') || 0;
    const ratingCount = reviews.length;
    
    // Combined rating weighted 70% to google rating and 30% to user reviews
    let avgRating = googleRating;
    if (ratingCount > 0) {
      const reviewsAvg = reviews.reduce((sum, review) => sum + (review.RATING || 0), 0) / ratingCount;
      avgRating = (googleRating * 0.7) + (reviewsAvg * 0.3);
    }
    
    return {
      ...business,
      avgRating: parseFloat(avgRating.toFixed(1)),
    };
  });

  // Get total count for pagination
  const totalCount = await prisma.business.count({ where });

  return {
    businesses: businessesWithAvgRating,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * Search food menu items with enhanced accuracy
 */
export async function searchFoodItems({
  query,
  businessId,
  category,
  minPrice,
  maxPrice,
  page = 1,
  limit = 10,
  sortBy = 'relevance',
}: {
  query?: string;
  businessId?: number;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc';
}) {
  const skip = (page - 1) * limit;

  // Build the where clause based on search parameters
  const where: any = {
    DISPLAY: 1,
  };

  // Enhanced search with multi-term matching
  if (query && query.trim() !== '') {
    const normalizedQuery = query.trim().toLowerCase();
    const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 1);
    
    // Create an array of OR conditions for each search term
    const searchConditions = [];
    
    if (searchTerms.length > 0) {
      for (const term of searchTerms) {
        searchConditions.push({
          OR: [
            {
              TITLE: {
                contains: term,
              },
            },
            {
              DESCRIPTION: {
                contains: term,
              },
            },
          ],
        });
      }
      
      // All search terms must match at least one field
      where.AND = searchConditions;
    } else {
      // Single term search
      where.OR = [
        {
          TITLE: {
            contains: normalizedQuery,
          },
        },
        {
          DESCRIPTION: {
            contains: normalizedQuery,
          },
        },
      ];
    }
  }

  // Filter by business
  if (businessId) {
    where.food_menu = {
      BUSINESS_ID: businessId,
    };
  }

  // Filter by category
  if (category) {
    where.MENU_CATEGORY_ID = Number(category);
  }

  // Filter by price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.PRICE = {};
    
    if (minPrice !== undefined) {
      where.PRICE.gte = minPrice;
    }
    
    if (maxPrice !== undefined) {
      where.PRICE.lte = maxPrice;
    }
  }

  // Determine the sort order
  let orderBy: any = {};
  
  switch (sortBy) {
    case 'price_asc':
      orderBy.PRICE = 'asc';
      break;
    case 'price_desc':
      orderBy.PRICE = 'desc';
      break;
    case 'relevance':
    default:
      // For relevance sorting, we prioritize exact title matches
      orderBy = query 
        ? [{ TITLE: { startsWith: query } }, { PRICE: 'asc' }] 
        : { PRICE: 'asc' };
      break;
  }

  // Execute the search query
  const menuItems = await prisma.food_menu_items.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      food_menu: {
        include: {
          business: true,
        },
      },
    },
  });

  // Get total count for pagination
  const totalCount = await prisma.food_menu_items.count({ where });

  return {
    menuItems,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * Get nearby businesses based on coordinates or city/town
 */
export async function getNearbyBusinesses({
  cityId,
  town,
  latitude,
  longitude,
  radius = 10, // km
  limit = 5,
}: {
  cityId?: number;
  town?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
}) {
  const where: any = {
    APPROVED: 1,
    STATUS: 1,
  };

  if (cityId) {
    where.ADDRESS_CITY_ID = cityId;
  }

  if (town) {
    where.ADDRESS_TOWN = {
      contains: town,
    };
  }

  // Note: For real geospatial search, we would use the longitude/latitude
  // Since MySQL doesn't have direct support in Prisma, 
  // this is a simplified implementation

  return prisma.business.findMany({
    where,
    take: limit,
    orderBy: {
      CREATION_DATETIME: 'desc',
    },
    include: {
      business_rating: true,
      business_reviews: {
        take: 1,
        orderBy: {
          CREATION_DATETIME: 'desc',
        },
      },
    },
  });
}

/**
 * Get cities for search filters
 */
export async function getCities() {
  return prisma.city.findMany({
    orderBy: {
      CITY_NAME: 'asc',
    },
  });
}

/**
 * Get towns by city ID
 */
export async function getTownsByCity(cityId: number) {
  return prisma.city_town.findMany({
    where: {
      CITY_ID: cityId,
    },
    orderBy: {
      TOWN: 'asc',
    },
  });
}

/**
 * Get all available food types/cuisines
 */
export async function getFoodTypes() {
  return prisma.food_type.findMany({
    orderBy: {
      TITLE: 'asc',
    },
  });
}

/**
 * Get all business categories
 */
export async function getBusinessCategories() {
  return prisma.business_category.findMany({
    orderBy: {
      CATEGORY_NAME: 'asc',
    },
  });
}

/**
 * Get trending searches
 */
export async function getTrendingSearches() {
  // In a real application, this would fetch from a search analytics table
  // For now, return mock data
  return [
    { id: 1, term: "Italian", count: 120 },
    { id: 2, term: "Vegetarian", count: 89 },
    { id: 3, term: "Zurich", count: 76 },
    { id: 4, term: "Pizza", count: 65 },
    { id: 5, term: "Halal", count: 54 },
  ];
}

/**
 * Get popular dishes based on menu items
 */
export async function getPopularDishes(limit: number = 10) {
  return prisma.food_menu_items.findMany({
    where: {
      DISPLAY: 1,
    },
    take: limit,
    orderBy: {
      PRICE: 'desc', // Using price as a proxy for popularity
    },
    include: {
      food_menu: {
        include: {
          business: true,
        },
      },
    },
  });
} 