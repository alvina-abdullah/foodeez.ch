'use client';

import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { SocialLinks } from '../core/SocialLinks';

export default function TopHeader() {
  const socialLinks = {
    facebook: 'https://facebook.com/foodeez',
    instagram: 'https://instagram.com/foodeez',
    twitter: 'https://twitter.com/foodeez',
    tiktok: 'https://tiktok.com/@foodeez'
  };

  return (
    <div className="hidden md:block bg-primary text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Contact info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-center sm:text-left">
          <a
            href="tel:+41234567890"
            className="flex items-center justify-center hover:text-white/80 transition-colors"
          >
            <Phone size={14} className="mr-2" />
            <span>+41 23 456 7890</span>
          </a>
          <a
            href="mailto:info@foodeez.com"
            className="flex items-center justify-center hover:text-white/80 transition-colors"
          >
            <Mail size={14} className="mr-2" />
            <span>info@foodeez.com</span>
          </a>
        </div>

        {/* Right side: Social + Pricing */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-center sm:text-right">
          <SocialLinks
            {...socialLinks}
            size="sm"
            color="white"
            variant="default"
            className="flex justify-center sm:justify-end"
          />

          <div className="hidden sm:block border-l border-white/20 h-5" />

          <Link
            href="/pricing"
            className="hover:text-white/80 transition-colors"
          >
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
