import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if user exists
        const user = await prisma.visitors_account.findUnique({
            where: { EMAIL_ADDRESS: email },
        });

        if (!user) {
            // Return success even if user doesn't exist for security
            return NextResponse.json(
                { message: 'If an account exists, you will receive a password reset email' },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Store reset token in database
        await prisma.visitors_account.update({
            where: { EMAIL_ADDRESS: email },
            data: {
                RESET_TOKEN: resetToken,
                RESET_TOKEN_EXPIRY: resetTokenExpiry,
            },
        });

        // Send email with reset link
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
        
        await resend.emails.send({
            from: 'Foodeez <noreply@foodeez.ch>',
            to: email,
            subject: 'Reset your password',
            html: `
                <h1>Reset Your Password</h1>
                <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `,
        });

        return NextResponse.json(
            { message: 'If an account exists, you will receive a password reset email' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { message: 'Error processing request' },
            { status: 500 }
        );
    }
} 