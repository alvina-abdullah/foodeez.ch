import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 6;
    const city = searchParams.get('city') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating') as string) : 0;
    
    // Build the where clause based on the parameters
    const whereClause: any = {
      IS_ACTIVE: true
    };
    
    if (city) {
      whereClause.ADDRESS_TOWN = {
        contains: city,
        mode: 'insensitive'
      };
    }
    
    if (cuisine) {
      whereClause.CUISINE_TYPE = {
        contains: cuisine,
        mode: 'insensitive'
      };
    }
    
    if (minRating > 0) {
      whereClause.GOOGLE_RATING = {
        gte: minRating.toString()
      };
    }
    
    // Fetch recommended businesses
    const recommendedBusinesses = await prisma.business.findMany({
      where: whereClause,
      take: limit,
      orderBy: [
        {
          IS_FEATURED: 'desc'
        },
        {
          GOOGLE_RATING: 'desc'
        }
      ],
      select: {
        BUSINESS_ID: true,
        BUSINESS_NAME: true,
        IMAGE_URL: true,
        ADDRESS_TOWN: true,
        GOOGLE_RATING: true,
        CUISINE_TYPE: true,
        IS_FEATURED: true,
        FEATURED_POSITION: true,
        _count: {
          select: {
            review: true
          }
        }
      }
    });
    
    // Calculate some additional metrics for each business
    const enhancedBusinesses = recommendedBusinesses.map(business => {
      // Convert string rating to number
      const rating = business.GOOGLE_RATING ? parseFloat(business.GOOGLE_RATING) : null;
      
      // Calculate recommendation score (example formula)
      const reviewCount = business._count.review;
      const isFeatured = business.IS_FEATURED;
      const recommendationScore = (rating || 0) * 0.7 + (reviewCount * 0.2) + (isFeatured ? 10 : 0);
      
      return {
        ...business,
        rating,
        reviewCount,
        recommendationScore: Math.round(recommendationScore * 10) / 10
      };
    });
    
    // Sort by recommendation score
    enhancedBusinesses.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    return NextResponse.json(enhancedBusinesses);
  } catch (error) {
    console.error('Error fetching recommended businesses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended businesses' },
      { status: 500 }
    );
  }
} 