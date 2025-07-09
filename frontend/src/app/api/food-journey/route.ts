import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';


// Helper function to serialize BigInt values
const serializeBigInt = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[key] = serializeBigInt(obj[key]);
    }
    return result;
  }
  return obj;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }


    // Get user details from database
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }



    const body = await request.json();
    const images = body.images

    // Handle file uploads
    const imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const img of images) {
        if (typeof img === 'object' && 'arrayBuffer' in img) {
          const buffer = Buffer.from(await img.arrayBuffer());
          const uploadDir = join(process.cwd(), 'public', 'uploads', 'food-journey-images');
          if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
          }
          const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
          const filePath = join(uploadDir, filename);
          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/food-journey-images/${filename}`);
        }
      }
    }

    // Map images to PIC_1...PIC_10
    const picFields: { [key: string]: string | undefined } = {};
    for (let i = 0; i < 3; i++) {
      picFields[`PIC_${i + 1}`] = imageUrls[i] || undefined;
    }



    const journeyData = {
      VISITOR_NAME: body.VISITOR_NAME || `${user.FIRST_NAME} ${user.LAST_NAME}`,
      VISITOR_EMAIL_ADDRESS: body.VISITOR_EMAIL_ADDRESS || session.user.email,
      VISITOR_PIC: body.VISITOR_PIC || user.PIC,
      TITLE: body.TITLE,
      DESCRIPTION: body.DESCRIPTION,
      RESTAURANT_NAME: body.RESTAURANT_NAME,
      ADDRESS_GOOGLE_URL: body.ADDRESS_GOOGLE_URL,
      ...picFields,
      CREATION_DATETIME: new Date(),
    };

    const newJourney = await prisma.visitor_food_journey.create({
      data: journeyData,
    });

    return NextResponse.json(serializeBigInt(newJourney), { status: 201 });
  } catch (error) {
    console.error('Error creating food journey:', error);
    return NextResponse.json({ error: 'Failed to create food journey' }, { status: 500 });
  }
} 