import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
    }
    // Increment LIKE_COUNT atomically
    const updated = await prisma.visitor_business_review.update({
      where: { VISITOR_BUSINESS_REVIEW_ID: Number(reviewId) },
      data: { LIKE_COUNT: { increment: 1 } },
    });
    return NextResponse.json({ success: true, likeCount: updated.LIKE_COUNT });
  } catch (error) {
    console.error('Like review error:', error);
    return NextResponse.json({ error: 'Failed to like review' }, { status: 500 });
  }
} 