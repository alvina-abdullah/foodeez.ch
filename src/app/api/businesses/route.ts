import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const zipCode = searchParams.get('zipCode');
    const limit = parseInt(searchParams.get('limit') || '9');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where conditions based on provided filters
    const whereConditions: any = { 
      STATUS: 1, // Active businesses
      APPROVED: 1 // Approved businesses
    };

    // Filter by city if provided
    if (city) {
      whereConditions.ADDRESS_TOWN = city;
    }

    // Filter by ZIP code if provided
    if (zipCode) {
      whereConditions.ADDRESS_ZIP = zipCode;
    }

    // Execute the query to get businesses
    let businesses;
    
    if (city || zipCode) {
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
      
      businesses = await prisma.$queryRawUnsafe(query);
    } else {
      // Fallback to Prisma ORM for simpler queries
      businesses = await prisma.business_detail_view_all.findMany({
        where: whereConditions,
        orderBy: {
          GOOGLE_RATING: 'desc'
        },
        take: limit,
        skip: offset
      });
    }

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch businesses' },
      { status: 500 }
    );
  }
}
