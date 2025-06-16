import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import { writeFile, mkdir, unlink } from 'fs/promises';
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
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image
    const optimizedBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Generate filename using email only (without timestamp)
    const filename = `${session.user.email}.jpg`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profile-images');
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Delete existing image if it exists
    const existingImagePath = join(uploadDir, filename);
    if (existsSync(existingImagePath)) {
      await unlink(existingImagePath);
    }

    // Save the new file
    await writeFile(existingImagePath, optimizedBuffer);

    // Get the base URL from the request
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Create full URL for the image
    const imageUrl = `${baseUrl}/uploads/profile-images/${filename}`;

    // Update user profile in database
    await prisma.visitors_account.update({
      where: { EMAIL_ADDRESS: session.user.email },
      data: { PIC: imageUrl },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Profile image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
} 