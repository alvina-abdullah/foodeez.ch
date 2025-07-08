import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const approved = searchParams.get('approved');
    const whereClause: any = {};
    if (approved !== null) {
      whereClause.APPROVED = parseInt(approved);
    } else {
      whereClause.APPROVED = 1; // Only show approved by default
    }
    const stories = await prisma.visitor_food_journey.findMany({
      where: whereClause,
      orderBy: { CREATION_DATETIME: 'desc' },
      take: limit ? parseInt(limit) : 5,
      skip: offset ? parseInt(offset) : undefined,
    });
    return NextResponse.json(serializeBigInt(stories));
  } catch (error) {
    console.error('Error fetching food journeys:', error);
    return NextResponse.json({ error: 'Failed to fetch food journeys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const body = await request.json();
    // Get user details from database
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email }
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const journeyData = {
      VISITOR_NAME: body.VISITOR_NAME || `${user.FIRST_NAME} ${user.LAST_NAME}`,
      VISITOR_EMAIL_ADDRESS: body.VISITOR_EMAIL_ADDRESS || session.user.email,
      VISITOR_PIC: body.VISITOR_PIC || user.PIC,
      TITLE: body.TITLE,
      DESCRIPTION: body.DESCRIPTION,
      RESTAURANT_NAME: body.RESTAURANT_NAME,
      ADDRESS_GOOGLE_URL: body.ADDRESS_GOOGLE_URL,
      PIC_1: body.PIC_1 || null,
      PIC_2: body.PIC_2 || null,
      PIC_4: body.PIC_4 || null,
      CREATION_DATETIME: new Date(),
      APPROVED: 0, // Default to pending approval
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