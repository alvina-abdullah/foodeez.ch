import { sendEmail } from '@/services/EmailService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL || 'admin@foodeez.ch',
      'contact',
      { name, email, subject, message }
    );

    // Send confirmation email to user
    await sendEmail(
      email,
      'contact',
      { name, email, subject, message }
    );

    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
} 