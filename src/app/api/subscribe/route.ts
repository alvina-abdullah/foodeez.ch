import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, code: 'EMAIL_REQUIRED', message: 'Email is required.' },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingSubscription = await prisma.foodeezSubscription.findFirst({
      where: { emailAddress: email },
    });

    if (existingSubscription) {
      return NextResponse.json(
        {
          success: false,
          code: 'EMAIL_EXISTS',
          message: 'This email is already subscribed to our newsletter.',
        },
        { status: 400 }
      );
    }

    // Create new subscription
    await prisma.foodeezSubscription.create({
      data: {
        id: BigInt(Date.now()),
        emailAddress: email,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to Foodeez updates!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  }
}
