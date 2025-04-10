import { NextRequest, NextResponse } from 'next/server';
import { getBusinessById } from '@/services/database/businessService';

/**
 * Business Details API
 * Retrieves detailed information about a specific business
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid business ID' },
        { status: 400 }
      );
    }
    
    const business = await getBusinessById(id);
    
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(business);
  } catch (error) {
    console.error('Business details API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching business details' },
      { status: 500 }
    );
  }
} 