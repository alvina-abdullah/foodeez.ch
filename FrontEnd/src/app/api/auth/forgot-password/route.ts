import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

// Initialize Resend with API key
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

        // Check if RESEND_API_KEY is configured
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not configured');
            return NextResponse.json(
                { message: 'Email service is not configured' },
                { status: 500 }
            );
        }

        // Check if NEXT_PUBLIC_APP_URL is configured
        if (!process.env.NEXT_PUBLIC_APP_URL) {
            console.error('NEXT_PUBLIC_APP_URL is not configured');
            return NextResponse.json(
                { message: 'App URL is not configured' },
                { status: 500 }
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
        
        try {
            const { data, error } = await resend.emails.send({
                from: 'Foodeez <onboarding@resend.dev>',
                to: email,
                subject: 'Reset your password',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
                        <p style="color: #666; line-height: 1.6;">Click the button below to reset your password. This link will expire in 1 hour.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                `,
            });

            if (error) {
                console.error('Resend API error:', error);
                return NextResponse.json(
                    { message: 'Failed to send email' },
                    { status: 500 }
                );
            }

            console.log('Email sent successfully:', data);
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            return NextResponse.json(
                { message: 'Failed to send email' },
                { status: 500 }
            );
        }

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