// Test script to validate Prisma setup
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Testing Prisma connection and schema...')
  
  try {
    // Test basic query
    const businessCount = await prisma.business.count()
    console.log(`Database contains ${businessCount} businesses`)
    
    // Test a more complex query with relations
    const businesses = await prisma.business.findMany({
      take: 2,
      include: {
        businessCategories: true,
        foodMenus: {
          include: {
            menuItems: true
          }
        }
      }
    })
    
    console.log('Successfully retrieved businesses with related data:')
    console.log(JSON.stringify(businesses, null, 2))
    
    console.log('Prisma is working correctly! ✅')
  } catch (error) {
    console.error('Error testing Prisma:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 