import { NextRequest, NextResponse } from 'next/server';
import { getBusinessReviews, createReview, getBusinessAverageRating, updateBusinessRating } from '@/services/database/reviewService';

/**
 * Business Reviews API
 * Handles retrieving and creating reviews for businesses
 */

/**
 * GET: Retrieve reviews for a business
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid business ID' },
        { status: 400 }
      );
    }
    
    const reviews = await getBusinessReviews(id, { page, limit });
    const averageRating = await getBusinessAverageRating(id);
    
    return NextResponse.json({
      ...reviews,
      averageRating: averageRating.averageRating,
      totalReviews: averageRating.totalReviews,
    });
  } catch (error) {
    console.error('Get reviews API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching reviews' },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new review for a business
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid business ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.REVIEWER_NAME || !body.RATING || !body.REVIEW) {
      return NextResponse.json(
        { error: 'Missing required fields (reviewer name, rating, or review content)' },
        { status: 400 }
      );
    }
    
    // Validate rating value
    if (body.RATING < 1 || body.RATING > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Create the review
    const review = await createReview({
      BUSINESS_ID: id,
      REVIEWER_NAME: body.REVIEWER_NAME,
      RATING: body.RATING,
      REVIEW: body.REVIEW,
      PIC_1: body.PIC_1,
      PIC_2: body.PIC_2,
      PIC_3: body.PIC_3,
    });
    
    // Update the business average rating
    const averageRating = await getBusinessAverageRating(id);
    await updateBusinessRating(id, averageRating.averageRating);
    
    return NextResponse.json({
      message: 'Review created successfully',
      review,
    }, { status: 201 });
  } catch (error) {
    console.error('Create review API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the review' },
      { status: 500 }
    );
  }
} 