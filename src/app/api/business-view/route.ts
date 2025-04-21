'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Use Prisma's model API with correct field names
    const businesses = await prisma.business_detail_view_all.findMany({
      take: 9,
      select: {
        Business_ID: true,
        BUSINESS_NAME: true,
        DESCRIPTION: true,
        ADDRESS_STREET: true,
        ADDRESS_TOWN: true,
        IMAGE_URL: true,
        GOOGLE_RATING: true,
        FACEBOOK_LINK: true,
        INSTA_LINK: true,
        TIKTOK_LINK: true,
        WHATSAPP_NUMBER: true,
        WEB_ADDRESS: true,
        PHONE_NUMBER: true,
        ADDRESS_COUNTRY: true,
        LOGO: true
      }
    });

    // Map the data to ensure BUSINESS_ID is consistently capitalized
    const mappedBusinesses = businesses.map(business => ({
      BUSINESS_ID: business.Business_ID,
      ...business
    }));

    return NextResponse.json({ 
      businesses: mappedBusinesses,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching business data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business data', success: false },
      { status: 500 }
    );
  }
} 