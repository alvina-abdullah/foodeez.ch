import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const businessId = searchParams.get('businessId');
    const highRated = searchParams.get('highRated') === 'true';
    
    // Build the query based on parameters
    const whereClause: any = {};
    
    if (businessId) {
      whereClause.BUSINESS_ID = parseInt(businessId);
    }
    
    if (highRated) {
      whereClause.RATING = {
        gte: 4 // Ratings of 4 and above
      };
    }
    
    // Fetch reviews from the database
    const reviews = await prisma.business_reviews.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        CREATED_AT: 'desc' // Most recent first
      },
      include: {
        business: {
          select: {
            BUSINESS_NAME: true,
            IMAGE_URL: true,
            ADDRESS_TOWN: true,
            GOOGLE_RATING: true
          }
        },
        user: {
          select: {
            NAME: true,
            PROFILE_IMAGE: true
          }
        }
      }
    });
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

/**
 * API Route: POST /api/reviews
 * Creates a new business review.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, rating, comment, reviewerName } = body;

    // --- Input Validation ---
    if (!businessId || typeof businessId !== 'number') {
      return NextResponse.json({ success: false, error: 'Valid Business ID is required.' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5.' }, { status: 400 });
    }
    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Comment cannot be empty.' }, { status: 400 });
    }
    // Simple validation for reviewer name (adjust if using authentication)
    if (!reviewerName || typeof reviewerName !== 'string' || reviewerName.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Reviewer name is required.' }, { status: 400 });
    }
    
    // Check if business exists (optional but good practice)
    const businessExists = await prisma.business.findUnique({
      where: { BUSINESS_ID: businessId },
    });
    if (!businessExists) {
      return NextResponse.json({ success: false, error: 'Business not found.' }, { status: 404 });
    }

    // --- Create Review --- 
    const newReview = await prisma.business_reviews.create({
      data: {
        BUSINESS_ID: businessId,
        RATING: rating,
        REVIEW: comment.trim(),
        REVIEWER_NAME: reviewerName.trim(), // Replace with authenticated user ID/name later
        CREATION_DATETIME: new Date(),
        // PIC_1, PIC_2, PIC_3 can be added later if image upload is implemented
      },
    });

    console.log('New review created:', newReview.BUSINESS_REVIEWS_ID);

    // Revalidate relevant paths if using ISR (Incremental Static Regeneration)
    // Example: revalidatePath(`/restaurants/${businessId}`);

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/reviews Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit review.',
        message: error.message || 'Unknown server error' 
      },
      { status: 500 }
    );
  }
} 