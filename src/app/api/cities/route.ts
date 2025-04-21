'use server';

import { NextResponse } from 'next/server';
import { getCities } from '@/services/database/cityService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const withRestaurantCount = searchParams.get('withRestaurantCount') === 'true';

    const cities = await getCities(withRestaurantCount);
    
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
} 