"use server";

import { prisma } from "../lib/prisma";

export async function getBusinesses() {
  try {
    const businesses = await prisma.business_detail_view_all.findMany({
      take: 9 // Limit to 9 results
    })
    // Return as is - already using uppercase field names from the DB view
    return businesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export async function getBusinessById(id: number) {
  try {
    const business = await prisma.business_detail_view_all.findUnique({
      where: {
        BUSINESS_ID: id
      }
    })
    return business
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

export async function getBusinessReviews(businessId: number) {
  try {
    const reviews = await prisma.visitor_business_review_view.findMany({
      where: {
        BUSINESS_ID: businessId,
        APPROVED: 1,
      },
      orderBy: {
        CREATION_DATETIME: "desc",
      },
    });

    return reviews;
  } catch (error) {
    console.error("[getBusinessReviews] Failed to fetch reviews:", error);
    return [];
  }
}
