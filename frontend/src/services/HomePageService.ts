'use server';

import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma"
import { BusinessDetail, BusinessResult } from "@/types/business.types";

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
        EMAIL_ADDRESS: true,
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
        VEGAN: true,
        VEGETARIAN: true,
        HALAL: true
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

export async function getAdsLinkData() {
  try {
    const adsLinkData = await prisma.adlink_view.findMany();
    return adsLinkData;
  } catch (error) {
    console.error('Error fetching ads link data:', error);
    return [];
  }
}

export async function getBusinessCategories() {
  try {
    const categories = await prisma.business_category_view.findMany({});
    return categories;
  } catch (error) {
    console.error('Error fetching business categories:', error);
    return [];
  }
}

// export async function getUpcomingEvents() {
//   try {
//     const events = await prisma.upcoming_events.findMany({
//       where: {
//         EVENT_DATE_FROM: {
//           gte: new Date(),
//         },
//       },
//       orderBy: {
//         EVENT_DATE_FROM: 'asc',
//       },
//       take: 4,
//     });
//     return events;
//   } catch (error) {
//     console.error('Error fetching upcoming events:', error);
//     return [];
//   }
// }

export async function getUpcomingEvents() {
  try {
    // ✅ Mock data
    const mockEvents = [
      {
        UPCOMING_EVENTS_ID: 1,
        CREATION_DATETIME: new Date('2025-06-01T10:00:00'),
        EVENT_DATE_FROM: new Date('2025-07-05'),
        EVENT_DATE_TO: new Date('2025-07-05'),
        EVENT_TIME_FROM: '14:00',
        EVENT_TIME_TO: '18:00',
        EVENT_TITLE: 'Food Festival 2025',
        EVENT_DESCRIPTION: 'A celebration of local and international cuisines.',
        ADDRESS_CITY: 'Karachi',
        ADDRESS_ZIPCODE: '75500',
        ADDRESS_STREET: 'Main Clifton Road',
        ADDRESS_HOUSE_NO: 101,
        ADDRESS_TOWN: 'Clifton',
      },
      {
        UPCOMING_EVENTS_ID: 2,
        CREATION_DATETIME: new Date('2025-06-10T11:30:00'),
        EVENT_DATE_FROM: new Date('2025-07-15'),
        EVENT_DATE_TO: new Date('2025-07-15'),
        EVENT_TIME_FROM: '10:00',
        EVENT_TIME_TO: '13:00',
        EVENT_TITLE: 'Tech Expo Karachi',
        EVENT_DESCRIPTION: 'Showcasing the latest in technology and innovation.',
        ADDRESS_CITY: 'Karachi',
        ADDRESS_ZIPCODE: '75300',
        ADDRESS_STREET: 'Expo Center Rd',
        ADDRESS_HOUSE_NO: 22,
        ADDRESS_TOWN: 'Gulshan-e-Iqbal',
      },
      {
        UPCOMING_EVENTS_ID: 3,
        CREATION_DATETIME: new Date('2025-06-15T15:00:00'),
        EVENT_DATE_FROM: new Date('2025-08-01'),
        EVENT_DATE_TO: new Date('2025-08-02'),
        EVENT_TIME_FROM: '09:00',
        EVENT_TIME_TO: '17:00',
        EVENT_TITLE: 'Startup Pitch Day',
        EVENT_DESCRIPTION: 'Meet investors and pitch your startup idea.',
        ADDRESS_CITY: 'Lahore',
        ADDRESS_ZIPCODE: '54000',
        ADDRESS_STREET: 'TechHub Street',
        ADDRESS_HOUSE_NO: 5,
        ADDRESS_TOWN: 'Model Town',
      },
      {
        UPCOMING_EVENTS_ID: 4,
        CREATION_DATETIME: new Date('2025-06-18T08:45:00'),
        EVENT_DATE_FROM: new Date('2025-08-10'),
        EVENT_DATE_TO: new Date('2025-08-10'),
        EVENT_TIME_FROM: '12:00',
        EVENT_TIME_TO: '14:30',
        EVENT_TITLE: 'Healthy Living Seminar',
        EVENT_DESCRIPTION: 'Tips and strategies for a healthy lifestyle.',
        ADDRESS_CITY: 'Islamabad',
        ADDRESS_ZIPCODE: '44000',
        ADDRESS_STREET: 'Blue Area Avenue',
        ADDRESS_HOUSE_NO: 12,
        ADDRESS_TOWN: 'Blue Area',
      },
    ];

    return mockEvents;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}


export async function getBusinessByFoodtypeCategoryLocation (params : {
  foodType: string;
  categoryId?: number;
  city?: string;
  zipCode?: string;
  limit?: number;
  skip?: number;
}) {
  const { foodType, categoryId, city, zipCode, limit = 12, skip = 0 } = params;
  const normalizedType = foodType.toLowerCase();

  try {
    let whereClause: Prisma.business_detail_view_allWhereInput | undefined;

    if (zipCode) {
      const numericZip = Number(zipCode);
      if (!isNaN(numericZip)) {
        whereClause = { ADDRESS_ZIP: { equals: numericZip } };
      }
    } else if (city) {
      whereClause = { CITY_NAME: { equals: city } };
    }

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

      const businessIdsInCategory = businessCategoryLinks
        .map(link => Number(link.BUSINESS_ID))
        .filter((id): id is number => !isNaN(id) && id !== null && id !== undefined);

      if (businessIdsInCategory.length === 0) {
        return { businesses: [], totalCount: 0 };
      }

      whereClause = {
        ...whereClause,
        BUSINESS_ID: { in: businessIdsInCategory }
      };
    }

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
    console.error(`[ERROR] Error in getBusinessByFoodtypeCategoryLocation:`, error);
    return {
      businesses: [],
      totalCount: 0
    };
  }
}