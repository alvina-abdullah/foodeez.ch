import prisma from '@/lib/prisma';

/**
 * Business Database Service
 * Handles all database operations related to businesses
 */

/**
 * Get all businesses with optional filtering and pagination
 */
export async function getAllBusinesses({
  page = 1,
  limit = 10,
  category,
  approved = true,
  orderBy = 'CREATION_DATETIME',
  orderDirection = 'desc',
}: {
  page?: number;
  limit?: number;
  category?: number;
  approved?: boolean;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
} = {}) {
  const skip = (page - 1) * limit;

  // Build filter conditions
  const where: any = {
    APPROVED: approved ? 1 : 0,
    STATUS: 1, // Active businesses
  };

  // If category is specified, filter by category
  if (category) {
    where.business_2_business_category = {
      some: {
        BUSINESS_CATEGORY_ID: category,
        STATUS: 1,
      },
    };
  }

  // Get businesses with pagination
  const businesses = await prisma.business.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [orderBy]: orderDirection,
    },
    include: {
      business_2_business_category: {
        include: {
          business_category: true,
        },
      },
    },
  });

  // Get total count for pagination
  const totalCount = await prisma.business.count({ where });

  return {
    businesses,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

/**
 * Get a business by ID with related data
 */
export async function getBusinessById(id: number) {
  return prisma.business.findUnique({
    where: { BUSINESS_ID: id },
    include: {
      business_2_business_category: {
        include: {
          business_category: true,
        },
      },
      business_rating: true,
      business_reviews: true,
      food_menu: {
        include: {
          food_menu_items: true,
        },
      },
    },
  });
}

/**
 * Create a new business
 */
export async function createBusiness(data: any) {
  return prisma.business.create({
    data: {
      ...data,
      CREATION_DATETIME: new Date(),
      APPROVED: 0, // Pending approval by default
      STATUS: 1, // Active by default
    },
  });
}

/**
 * Update an existing business
 */
export async function updateBusiness(id: number, data: any) {
  return prisma.business.update({
    where: { BUSINESS_ID: id },
    data,
  });
}

/**
 * Delete a business (soft delete by changing status)
 */
export async function deleteBusiness(id: number) {
  return prisma.business.update({
    where: { BUSINESS_ID: id },
    data: { STATUS: 0 },
  });
}

/**
 * Get all business categories
 */
export async function getBusinessCategories() {
  return prisma.business_category.findMany({
    orderBy: { CATEGORY_NAME: 'asc' },
  });
}

/**
 * Get businesses by owner ID
 */
export async function getBusinessesByOwnerId(ownerId: number) {
  return prisma.owner_2_business.findMany({
    where: {
      BUSINESS_OWNER_ID: ownerId,
      STATUS: 1,
    },
    include: {
      business: true,
    },
  });
} 