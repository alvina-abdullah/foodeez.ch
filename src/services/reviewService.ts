import prisma from '@/lib/prisma';

/**
 * Review Database Service
 * Handles all database operations related to business reviews
 */

/**
 * Get reviews for a specific business
 */
export async function getBusinessReviews(
  businessId: number,
  { page = 1, limit = 10 }: { page?: number; limit?: number } = {}
) {
  const skip = (page - 1) * limit;

  const reviews = await prisma.business_reviews.findMany({
    where: {
      BUSINESS_ID: businessId,
    },
    skip,
    take: limit,
    orderBy: {
      CREATION_DATETIME: 'desc',
    },
  });

  const totalCount = await prisma.business_reviews.count({
    where: {
      BUSINESS_ID: businessId,
    },
  });

  return {
    reviews,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * Get a single review by ID
 */
export async function getReviewById(reviewId: number) {
  return prisma.business_reviews.findUnique({
    where: {
      BUSINESS_REVIEWS_ID: reviewId,
    },
  });
}

/**
 * Create a new review
 */
export async function createReview(data: {
  BUSINESS_ID: number;
  REVIEWER_NAME: string;
  RATING: number;
  REVIEW: string;
  PIC_1?: string;
  PIC_2?: string;
  PIC_3?: string;
}) {
  return prisma.business_reviews.create({
    data: {
      ...data,
      CREATION_DATETIME: new Date(),
    },
  });
}

/**
 * Update an existing review
 */
export async function updateReview(reviewId: number, data: any) {
  return prisma.business_reviews.update({
    where: {
      BUSINESS_REVIEWS_ID: reviewId,
    },
    data,
  });
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: number) {
  return prisma.business_reviews.delete({
    where: {
      BUSINESS_REVIEWS_ID: reviewId,
    },
  });
}

/**
 * Get average rating for a business
 */
export async function getBusinessAverageRating(businessId: number) {
  const result = await prisma.business_reviews.aggregate({
    where: {
      BUSINESS_ID: businessId,
    },
    _avg: {
      RATING: true,
    },
    _count: {
      RATING: true,
    },
  });

  return {
    averageRating: result._avg.RATING || 0,
    totalReviews: result._count.RATING || 0,
  };
}

/**
 * Update business rating in the business table
 */
export async function updateBusinessRating(businessId: number, rating: number) {
  // Check if a rating exists for this business
  const existingRating = await prisma.business_rating.findFirst({
    where: {
      BUSINESS_ID: businessId,
    },
  });

  if (existingRating) {
    // Update existing rating
    return prisma.business_rating.update({
      where: {
        BUSINESS_RATING_ID: existingRating.BUSINESS_RATING_ID,
      },
      data: {
        BUSINESS_RATING: rating,
      },
    });
  } else {
    // Create new rating
    return prisma.business_rating.create({
      data: {
        BUSINESS_ID: businessId,
        BUSINESS_RATING: rating,
        CREATION_DATETIME: new Date(),
      },
    });
  }
} 