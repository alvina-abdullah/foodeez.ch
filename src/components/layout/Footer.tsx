'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Send, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { SocialLinks } from '../core/SocialLinks';

export default function Footer() {
  const socialLinks = {
    facebook: 'https://facebook.com/foodeez',
    instagram: 'https://instagram.com/foodeez',
    twitter: 'https://twitter.com/foodeez',
    tiktok: 'https://tiktok.com/@foodeez'
  };

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would connect to your API to handle newsletter subscriptions
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Top Section - Help banner */}
        <div className="bg-primary border-2 border-white text-white rounded-xl p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Help millions to find the right Place & Food to enjoy</h3>
            <p className="">Join our community and share your experiences</p>
          </div>
          <Link
            href="/signup"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-primary font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Share your experience
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand and About */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Foodeez</h2>
            </div>
            <p className="mb-6 max-w-md">
              Foodeez is a platform that connects food lovers with amazing restaurants. Discover, visit and review food from the best places in your area.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5" />
                <div>
                  <p>123 Food Street, Foodville,</p>
                  <p>Zurich, Switzerland</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <p>+41 23 456 7890</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <p>info@foodeez.com</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <SocialLinks
                {...socialLinks}
                size="xl"
               
                variant="default"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-5">For Users</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/discover" className=" hover:text-primary transition-colors">
                  Find Restaurants
                </Link>
              </li>
              <li>
                <Link href="/about" className=" hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className=" hover:text-primary transition-colors">
                  Food Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/mobile-app" className="hover:text-primary transition-colors">
                  Mobile App
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h3 className="text-lg font-semibold mb-5">For Businesses</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/business/register" className="hover:text-primary transition-colors">
                  Register Restaurant
                </Link>
              </li>
              <li>
                <Link href="/business/login" className="hover:text-primary transition-colors">
                  Business Login
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-primary transition-colors">
                  Advertise with Us
                </Link>
              </li>
              <li>
                <Link href="/business/resources" className=" hover:text-primary transition-colors">
                  Business Resources
                </Link>
              </li>
              <li>
                <Link href="/pricing" className=" hover:text-primary transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-text">Newsletter</h3>
            <p className="mb-4 text-text">
              Subscribe to get the latest updates on new restaurants and offers.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-background border border-gray-400 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-secondary text-sm">
                Thanks for subscribing!
              </p>
            )}
          </div>

        </div>

        {/* Horizontal divider */}
        <div className="h-px bg-white my-8" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Foodeez. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/terms" className="hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-primary text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 