import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const businessId = formData.get('businessId');
    const rating = formData.get('rating');
    const remarks = formData.get('remarks');
    const images = formData.getAll('images');
    const video = formData.get('video');

    // Validate required fields
    if (!businessId || !rating || !remarks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle file uploads
    const imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const img of images) {
        if (typeof img === 'object' && 'arrayBuffer' in img) {
          const buffer = Buffer.from(await img.arrayBuffer());
          const uploadDir = join(process.cwd(), 'public', 'uploads', 'review-images');
          if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
          }
          const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
          const filePath = join(uploadDir, filename);
          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/review-images/${filename}`);
        }
      }
    }

    let videoUrl: string | null = null;
    if (video && typeof video === 'object' && 'arrayBuffer' in video) {
      const buffer = Buffer.from(await video.arrayBuffer());
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'review-videos');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.mp4`;
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      videoUrl = `/uploads/review-videos/${filename}`;
    }

    // Save review to DB
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Map images to PIC_1...PIC_10
    const picFields: { [key: string]: string | undefined } = {};
    for (let i = 0; i < 10; i++) {
      picFields[`PIC_${i + 1}`] = imageUrls[i] || undefined;
    }

    const review = await prisma.visitor_business_review.create({
      data: {
        BUSINESS_ID: Number(businessId),
        VISITORS_ACCOUNT_ID: Number(user.VISITORS_ACCOUNT_ID),
        RATING: String(rating),
        REMARKS: String(remarks),
        ...picFields,
        VIDEO_1: videoUrl || undefined,
        CREATION_DATETIME: new Date(),
        LIKE_COUNT: 1,
        APPROVED: 0,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { reviewId } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
    }
    // Find review and check ownership
    const review = await prisma.visitor_business_review.findUnique({
      where: { VISITOR_BUSINESS_REVIEW_ID: Number(reviewId) },
    });
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    // Get user
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email },
    });
    if (!user || Number(review.VISITORS_ACCOUNT_ID) !== Number(user.VISITORS_ACCOUNT_ID)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await prisma.visitor_business_review.delete({
      where: { VISITOR_BUSINESS_REVIEW_ID: Number(reviewId) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const formData = await request.formData();
    const reviewId = formData.get('reviewId');
    const remarks = formData.get('remarks');
    const rating = formData.get('rating');
    const images = formData.getAll('images');
    const video = formData.get('video');
    if (!reviewId) {
      return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });
    }
    // Find review and check ownership
    const review = await prisma.visitor_business_review.findUnique({
      where: { VISITOR_BUSINESS_REVIEW_ID: Number(reviewId) },
    });
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    // Get user
    const user = await prisma.visitors_account.findUnique({
      where: { EMAIL_ADDRESS: session.user.email },
    });
    if (!user || Number(review.VISITORS_ACCOUNT_ID) !== Number(user.VISITORS_ACCOUNT_ID)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Handle file uploads (optional, similar to POST)
    const imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const img of images) {
        if (typeof img === 'object' && 'arrayBuffer' in img) {
          const buffer = Buffer.from(await img.arrayBuffer());
          const uploadDir = join(process.cwd(), 'public', 'uploads', 'review-images');
          if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
          }
          const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;
          const filePath = join(uploadDir, filename);
          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/review-images/${filename}`);
        }
      }
    }
    let videoUrl: string | null = null;
    if (video && typeof video === 'object' && 'arrayBuffer' in video) {
      const buffer = Buffer.from(await video.arrayBuffer());
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'review-videos');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.mp4`;
      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);
      videoUrl = `/uploads/review-videos/${filename}`;
    }
    // Map images to PIC_1...PIC_10
    const picFields: { [key: string]: string | undefined } = {};
    for (let i = 0; i < 10; i++) {
      picFields[`PIC_${i + 1}`] = imageUrls[i] || undefined;
    }
    const updated = await prisma.visitor_business_review.update({
      where: { VISITOR_BUSINESS_REVIEW_ID: Number(reviewId) },
      data: {
        REMARKS: remarks ? String(remarks) : undefined,
        RATING: rating ? String(rating) : undefined,
        ...picFields,
        VIDEO_1: videoUrl || undefined,
      },
    });
    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}