// /app/api/business/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const featured = url.searchParams.get('featured') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build the where clause
    const where: any = {
      APPROVED: 1, // Only approved businesses
      STATUS: 1,   // Only active businesses
    };
    
    // If featured is requested, we can either:
    // 1. Filter by ranking (if you have a ranking column)
    // 2. Just get the most recently added restaurants
    // 3. Or any other business rule you might have for featuring
    
    let orderBy: any = { CREATION_DATETIME: 'desc' };
    
    if (featured) {
      // Option 1: If you have a foodeez_ranking table with rankings
      // You could join with it or query it separately
      try {
        // First try to get top ranked businesses
        const topRanked = await prisma.foodeez_ranking.findMany({
          take: limit,
          orderBy: {
            RANKING: 'asc',
          },
          select: {
            BUSINESS_ID: true,
          },
        });
        
        if (topRanked.length > 0) {
          // If we have rankings, use them
          where.BUSINESS_ID = {
            in: topRanked.map(r => r.BUSINESS_ID).filter(id => id !== null) as number[]
          };
        }
      } catch (err) {
        console.error("Error fetching rankings:", err);
        // Fall back to default sorting if ranking query fails
      }
    }
    
    // Execute the query
    const businesses = await prisma.business.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.BUSINESS_NAME || !data.ADDRESS_TOWN) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create a new business
    const business = await prisma.business.create({
      data: {
        CREATION_DATETIME: new Date(),
        ...data,
        APPROVED: 0, // Pending approval by default
        STATUS: 1,   // Active by default
      },
    });
    
    return NextResponse.json(business);
  } catch (error) {
    console.error("Error creating business:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}


// import { createConnection } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET() {
//     try {
//         const connection = await createConnection();
//         const [data] = await connection.query("SELECT * FROM foodeez.business LIMIT 10;");

//         return NextResponse.json({ message: "Database connected", data });
//     } catch (error) {
//         return NextResponse.json({ message: "Database connection failed" + error }, { status: 500 });
//     }
// }

