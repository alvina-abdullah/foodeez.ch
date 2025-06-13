import { sendEmail } from '@/services/EmailService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      occasion,
      specialRequests,
      businessName,
      businessEmail
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to restaurant
    // await EmailService.sendEmail(
    //   businessEmail || process.env.ADMIN_EMAIL || 'admin@foodeez.ch',
    //   'reservation',
    //   {
    //     name,
    //     email,
    //     phone,
    //     date,
    //     time,
    //     guests,
    //     occasion,
    //     specialRequests,
    //     businessName
    //   }
    // );
    console.log(businessEmail, 'businessEmail');

    // Send confirmation email to customer
    await sendEmail(
      email,
      'reservation',
      {
        name,
        email,
        phone,
        date,
        time,
        guests,
        occasion,
        specialRequests,
        businessName
      }
    );

    // // Send notification email to admin
    // await sendEmail(
    //     process.env.ADMIN_EMAIL || "admin@foodeez.ch",
    //     'reservation',
    //     {
    //       name,
    //       email,
    //       phone,
    //       date,
    //       time,
    //       guests,
    //       occasion,
    //       specialRequests,
    //       businessName
    //     }
    // )

    return NextResponse.json(
      { message: 'Reservation request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reservation submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit reservation request' },
      { status: 500 }
    );
  }
} 