'use server';

import { prisma } from "./prisma"

// Example function to test the schema
export async function getBusinesses() {
  try {
    const businesses = await prisma.business_detail_view_all.findMany({
      skip: 90,
      take: 9 // Limit to 9 results
    })
    // Return as is - already using uppercase field names from the DB view
    return businesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
} 
