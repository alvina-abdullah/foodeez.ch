import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.visitors_account.create({
      data: {
        FIRST_NAME: firstName,
        LAST_NAME: lastName,
        EMAIL_ADDRESS: email,
        PASSWORD: hashedPassword,
        CREATION_DATETIME: new Date(),
        LANGUAGE: 'en', // Default language
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.VISITORS_ACCOUNT_ID.toString(),
          email: user.EMAIL_ADDRESS,
          name: `${user.FIRST_NAME} ${user.LAST_NAME}`,
        },
      },
      { status: 201 }
    );
  } catch (error : any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating user' },
      { status: 500 }
    );
  }
} 