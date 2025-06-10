'use server';

import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma"
import { BusinessDetail, BusinessResult } from "@/types/business.types";

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

export async function getCities() {
  try {
    const cities = await prisma.business_detail_view_all.findMany({
      select: {
        CITY_NAME: true,
      },
      distinct: ['CITY_NAME'],
      orderBy: {
        CITY_NAME: 'asc'
      }
    });
    return cities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

interface GetBusinessesParams {
  city?: string;
  zipCode?: string;
  limit?: number;
}

export async function getBusinessesByLocation({
  city,
  zipCode,
  limit = 12
}: GetBusinessesParams): Promise<BusinessResult> {
  try {
    const trimmedCity = city?.trim();
    const trimmedZip = zipCode?.trim();

    let whereClause: Prisma.business_detail_view_allWhereInput | undefined;

    if (trimmedZip) {
      // Prioritize zip code if provided
      const numericZip = Number(trimmedZip);
      if (!isNaN(numericZip)) {
        whereClause = { ADDRESS_ZIP: { equals: numericZip } };
      }
    } else if (trimmedCity) {
      // Fallback to city if no zip code is provided
      whereClause = { CITY_NAME: { equals: trimmedCity } };
    }

    if (!whereClause) {
      console.log("No valid search criteria provided.");
      return []; // No valid search criteria
    }

    console.log("Executing Prisma query with whereClause:", JSON.stringify(whereClause));

    const result = await prisma.business_detail_view_all.findMany({
      where: whereClause, // Use the determined where clause
      take: Math.min(limit, 50), // enforce upper bound
      orderBy: { BUSINESS_NAME: 'asc' },
      select: {
        BUSINESS_ID: true,
        BUSINESS_NAME: true,
        SHORT_NAME: true,
        DESCRIPTION: true,
        ADDRESS_STREET: true,
        ADDRESS_ZIP: true,
        ADDRESS_TOWN: true,
        ADDRESS_CITY_ID: true,
        CITY_CODE: true,
        CITY_NAME: true,
        ADDRESS_COUNTRY: true,
        PHONE_NUMBER: true,
        WHATSAPP_NUMBER: true,
        WEB_ADDRESS: true,
        LOGO: true,
        FACEBOOK_LINK: true,
        INSTA_LINK: true,
        TIKTOK_LINK: true,
        GOOGLE_PROFILE: true,
        IMAGE_URL: true,
        GOOGLE_RATING: true,
        APPROVED: true,
        STATUS: true,
        RANKING: true,
      }
    });

    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('[Prisma Error]', error.code, error.message);
    } else {
      console.error('[Unexpected Error]', (error as Error).message);
    }
    return [];
  }
}

export async function getBusinessesByTypeAndCategories(params: {
  foodType: string;
  categoryId?: number;
  limit?: number;
  skip?: number;
}): Promise<{ businesses: BusinessDetail[]; totalCount: number }> {
  const { foodType, categoryId, limit, skip = 0 } = params;
  const normalizedType = foodType.toLowerCase();

  try {
    let businessIdsInCategory: number[] = [];

    // 🔹 Step 1: Get businesses by category
    if (categoryId !== undefined) {

      const businessCategoryLinks = await prisma.business_2_business_category_view.findMany({
        where: {
          BUSINESS_CATEGORY_ID: categoryId,
          STATUS: 1
        },
        select: {
          BUSINESS_ID: true
        }
      });

      businessIdsInCategory = businessCategoryLinks
        .map(link => link.BUSINESS_ID)
        .filter((id): id is number => id !== null && id !== undefined);



      if (businessIdsInCategory.length === 0) {
        // console.log(`No businesses found for category ${categoryId}, returning empty result.`);
        return { businesses: [], totalCount: 0 };
      }
    }

    // 🔹 Step 2: Prepare view and where clause
    const whereClause = categoryId !== undefined
      ? { BUSINESS_ID: { in: businessIdsInCategory } }
      : {};

    let businesses: BusinessDetail[] = [];
    let totalCount = 0;

    const getData = async (model: any) => {
      const [data, count] = await Promise.all([
        model.findMany({
          where: whereClause,
          take: limit,
          skip,
          orderBy: { BUSINESS_NAME: 'asc' }
        }),
        model.count({
          where: whereClause
        })
      ]);
      return { data, count };
    };

    try {
      if (normalizedType === 'halal') {
        ({ data: businesses, count: totalCount } = await getData(prisma.business_detail_view_halal));
      } else if (normalizedType === 'vegan') {
        ({ data: businesses, count: totalCount } = await getData(prisma.business_detail_view_vegan));
      } else if (normalizedType === 'vegetarian') {
        ({ data: businesses, count: totalCount } = await getData(prisma.business_detail_view_vegetarian));
      } else {
        ({ data: businesses, count: totalCount } = await getData(prisma.business_detail_view_all));
      }
    } catch (dbError) {
      console.error("dbError:", dbError);

      ({ data: businesses, count: totalCount } = await getData(prisma.business_detail_view_all));
    }

    return {
      businesses: businesses,
      totalCount
    };
  } catch (error) {
    console.error(`[ERROR] Error in getBusinessesByTypeAndCategories:`, error);
    return {
      businesses: [],
      totalCount: 0
    };
  }
}

export async function getAdsLinkData() {
  try {
    const adsLinkData = await prisma.adlink_view.findMany();
    return adsLinkData;
  } catch (error) {
    console.error('Error fetching ads link data:', error);
    return [];
  }
}
