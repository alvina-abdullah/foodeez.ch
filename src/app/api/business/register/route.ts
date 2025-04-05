import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.BUSINESS_NAME || !data.DESCRIPTION || !data.ADDRESS_STREET || !data.PHONE_NUMBER) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create a new business record
    const business = await prisma.business.create({
      data: {
        CREATION_DATETIME: new Date(),
        BUSINESS_NAME: data.BUSINESS_NAME,
        SHORT_NAME: data.SHORT_NAME,
        DESCRIPTION: data.DESCRIPTION,
        ADDRESS_STREET: data.ADDRESS_STREET,
        ADDRESS_ZIP: data.ADDRESS_ZIP || null,
        ADDRESS_CITY_ID: data.ADDRESS_CITY_ID || null,
        ADDRESS_TOWN: data.ADDRESS_TOWN,
        ADDRESS_COUNTRY: data.ADDRESS_COUNTRY,
        PHONE_NUMBER: data.PHONE_NUMBER,
        PHONE_NUMBER_SHORT: data.PHONE_NUMBER_SHORT,
        WHATSAPP_NUMBER: data.WHATSAPP_NUMBER,
        WEB_ADDRESS: data.WEB_ADDRESS,
        FACEBOOK_LINK: data.FACEBOOK_LINK,
        INSTA_LINK: data.INSTA_LINK,
        TIKTOK_LINK: data.TIKTOK_LINK,
        GOOGLE_PROFILE: data.GOOGLE_PROFILE,
        IMAGE_URL: data.IMAGE_URL,
        APPROVED: 0, // Pending approval
        STATUS: 1,    // Active
      },
    });

    return NextResponse.json({
      message: "Business registered successfully",
      businessId: business.BUSINESS_ID,
    });
  } catch (error) {
    console.error("Error registering business:", error);
    return NextResponse.json(
      { message: "Failed to register business", error: String(error) },
      { status: 500 }
    );
  }
} 