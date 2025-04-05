import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('q') || '';
    const location = url.searchParams.get('location') || '';
    const cuisine = url.searchParams.get('cuisine') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;
    
    // Build the where clause with filters
    const where: any = {
      APPROVED: 1,
      STATUS: 1,
    };
    
    // Add search term filter
    if (searchQuery) {
      where.OR = [
        { BUSINESS_NAME: { contains: searchQuery } },
        { DESCRIPTION: { contains: searchQuery } },
      ];
    }
    
    // Add location filter
    if (location && location !== 'All') {
      where.ADDRESS_TOWN = location;
    }
    
    // The cuisine filter would ideally use a join with business_category or food_type tables
    // But for simplicity, we'll use a direct query.
    // In a real implementation, you might want to create a SQL View for this
    
    // Execute the search query
    const [businesses, totalCount] = await Promise.all([
      prisma.business.findMany({
        where,
        take: limit,
        skip,
        orderBy: {
          CREATION_DATETIME: 'desc',
        },
      }),
      prisma.business.count({ where }),
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      results: businesses,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
    
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Search failed", error: String(error) },
      { status: 500 }
    );
  }
}

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