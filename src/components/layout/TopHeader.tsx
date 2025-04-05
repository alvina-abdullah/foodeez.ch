'use client';

import Link from 'next/link';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { SocialLinks } from '../core/SocialLinks';

export default function TopHeader() {
  return (
    <div className="bg-primary-900 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <a href="tel:+41234567890" className="flex items-center text-sm hover:text-primary-200 transition-colors">
            <Phone size={14} className="mr-1" />
            <span>+41 23 456 7890</span>
          </a>
          <a href="mailto:info@foodeez.com" className="flex items-center text-sm hover:text-primary-200 transition-colors">
            <Mail size={14} className="mr-1" />
            <span>info@foodeez.com</span>
          </a>
        </div>
        
        <div className="flex items-center space-x-6">
          <SocialLinks
            facebook="https://facebook.com/foodeez" 
            instagram="https://instagram.com/foodeez"
            // tiktok="https://tiktok.com/@foodeez"/
            // size="sm"
            // color="white"
          />
          
          <div className="border-l border-primary-700 h-5 mx-2 hidden sm:block"></div>
          
          <div className="space-x-4">
            <Link href="/pricing" className="text-sm hover:text-primary-200 transition-colors">
              Pricing
            </Link>
            <Link href="/(auth)/login" className="text-sm hover:text-primary-200 transition-colors">
              Log in
            </Link>
            <Link 
              href="/(auth)/register" 
              className="text-sm bg-primary-600 px-3 py-1 rounded-full hover:bg-primary-500 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}