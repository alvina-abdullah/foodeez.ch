import { prisma } from "./prisma"

// Example function to test the schema
export async function getBusinesses() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        businessCategories: {
          include: {
            category: true
          }
        },
        foodMenus: {
          include: {
            menuItems: true
          }
        }
      },
      take: 5 // Limit to 5 results
    })
    return businesses
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
} 
