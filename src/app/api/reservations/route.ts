import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseISO } from 'date-fns';

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * API Route: POST /api/reservations
 * Creates a new restaurant table reservation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      businessId, 
      date, 
      time, 
      guestCount, 
      guestName, 
      guestEmail, 
      guestPhone, 
      specialRequests 
    } = body;

    // --- Input Validation ---
    if (!businessId || typeof businessId !== 'number') {
      return NextResponse.json({ success: false, error: 'Valid Business ID is required.' }, { status: 400 });
    }
    
    if (!date || !time) {
      return NextResponse.json({ success: false, error: 'Reservation date and time are required.' }, { status: 400 });
    }
    
    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }
    
    // Validate time format (should be HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json({ success: false, error: 'Invalid time format. Use HH:MM.' }, { status: 400 });
    }
    
    if (!guestCount || typeof guestCount !== 'number' || guestCount < 1) {
      return NextResponse.json({ success: false, error: 'Valid guest count is required.' }, { status: 400 });
    }
    
    if (!guestName || typeof guestName !== 'string' || guestName.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Guest name is required.' }, { status: 400 });
    }
    
    if (!guestEmail || typeof guestEmail !== 'string' || !isValidEmail(guestEmail)) {
      return NextResponse.json({ success: false, error: 'Valid email address is required.' }, { status: 400 });
    }
    
    // Check if business exists
    const businessExists = await prisma.business.findUnique({
      where: { BUSINESS_ID: businessId },
    });
    
    if (!businessExists) {
      return NextResponse.json({ success: false, error: 'Business not found.' }, { status: 404 });
    }

    // Parse the reservation date
    const reservationDate = parseISO(date);

    // --- Create Reservation ---
    // Instead of using the Prisma model directly, use a SQL query
    // This is a temporary approach until Prisma schema is properly synced
    const newReservation = {
      BUSINESS_ID: businessId,
      RESERVATION_DATE: reservationDate,
      RESERVATION_TIME: time,
      GUEST_COUNT: guestCount,
      GUEST_NAME: guestName.trim(),
      GUEST_EMAIL: guestEmail.trim(),
      GUEST_PHONE: guestPhone?.trim() || null,
      SPECIAL_REQUESTS: specialRequests?.trim() || null,
      CREATION_DATETIME: new Date(),
      STATUS: 1, // Pending
      NOTIFICATION_SENT: false
    };

    console.log('Processing reservation request:', newReservation);

    // For now, we'll simulate a successful reservation
    // In production, you would create an actual database record
    const simulatedReservation = {
      RESERVATION_ID: Math.floor(Math.random() * 10000),
      ...newReservation
    };

    // TODO: 
    // 1. Create actual database entry once Prisma schema is synced
    // 2. Implement notifications to restaurant, guest, and admin

    return NextResponse.json({ 
      success: true, 
      reservation: simulatedReservation,
      message: 'Reservation request submitted successfully.' 
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/reservations Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit reservation request.',
        message: error.message || 'Unknown server error' 
      },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/reservations
 * Returns reservations for a specific business or all reservations for admins
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    // TODO: Add authentication to ensure only authorized users can access reservations
    
    // For now, just return empty results or mock data
    // This will be replaced with actual database queries once Prisma is set up
    const mockReservations = businessId ? [
      {
        RESERVATION_ID: 12345,
        BUSINESS_ID: parseInt(businessId),
        RESERVATION_DATE: new Date(),
        RESERVATION_TIME: '19:00',
        GUEST_COUNT: 2,
        GUEST_NAME: 'John Doe',
        GUEST_EMAIL: 'john@example.com',
        GUEST_PHONE: '+41 123 456 789',
        STATUS: 1,
        CREATION_DATETIME: new Date(),
        business: {
          BUSINESS_NAME: 'Mock Restaurant',
          ADDRESS_TOWN: 'Zurich',
          PHONE_NUMBER: '+41 987 654 321'
        }
      }
    ] : [];
    
    return NextResponse.json({ 
      success: true, 
      reservations: mockReservations
    });
    
  } catch (error: any) {
    console.error('GET /api/reservations Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch reservations.',
        message: error.message || 'Unknown server error' 
      },
      { status: 500 }
    );
  }
} 