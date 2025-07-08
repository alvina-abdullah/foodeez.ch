"use server";

import { prisma } from "@/lib/prisma";
import { business, business_detail_view_all, business_food_menu_card, business_food_menu_card_view } from "@prisma/client";

// Fetch all menu categories for a business
// export async function getMenuCategories(businessId: number) {
//   return prisma.menu_category.findMany({
//     where: { BUSINESS_ID: businessId, SHOW: 1 },
//     orderBy: { DISPLAY_SEQ: "asc" },
//   });
// }



export async function getBusinessById(id: number) {
    try {
      const business = await prisma.business_detail_view_all.findUnique({
        where: {
          BUSINESS_ID: id
        }
      })
      return business as business_detail_view_all 
    } catch (error) {
      console.error('Error fetching business:', error)
      return null
    }
  }


// Fetch products for a menu card with filters, sorting, and pagination
export async function getMenuProducts({
    businessId,
    categoryId,
    sortBy = "PRODUCT_NAME",
    sortOrder = "asc",
    availableOnly = false,
    minPrice,
    maxPrice,
    page = 1,
    perPage = 20,
}: {
    businessId: number;
    categoryId?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    availableOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    perPage?: number;
}) {
    const where: any = {
        BUSINESS_ID: businessId,
    };
    if (categoryId) where.BUSINESS_PRODUCT_CATEGORY_ID = categoryId;
    if (availableOnly) where.STATUS = 1;
    //   if (minPrice !== undefined || maxPrice !== undefined) {
    //     where.PRODUCT_PRICE = {};
    //     if (minPrice !== undefined) where.PRODUCT_PRICE.gte = minPrice;
    //     if (maxPrice !== undefined) where.PRODUCT_PRICE.lte = maxPrice;
    //   }
    const skip = (page - 1) * perPage;
    const take = perPage;
    return prisma.business_food_menu_card_view.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take,
    });
}

// Get product count for filters
export async function getMenuProductCount({
    businessId,
    categoryId,
    availableOnly = false,
    minPrice,
    maxPrice,
}: {
    businessId: number;
    categoryId?: number;
    availableOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
}) {
    const where: any = {
        BUSINESS_ID: businessId,
    };
    if (categoryId) where.BUSINESS_PRODUCT_CATEGORY_ID = categoryId;
    if (availableOnly) where.STATUS = 1;
    //   if (minPrice !== undefined || maxPrice !== undefined) {
    //     where.PRODUCT_PRICE = {};
    //     if (minPrice !== undefined) where.PRODUCT_PRICE.gte = minPrice;
    //     if (maxPrice !== undefined) where.PRODUCT_PRICE.lte = maxPrice;
    //   }
    return prisma.business_food_menu_card_view.count({ where });
}

// Fetch a single product by ID
// export async function getMenuProductById(productId: number) {
//   return prisma.business_food_menu_card_view.findUnique({
//     where: { BUSINESS_FOOD_MENU_CARD_ID: productId },
//   });
// }
