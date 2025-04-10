'use client';

import TopSection from '@/components/home/TopSection';
import FeaturedRestaurants from '@/components/home/FeaturedRestaurants';
import BusinessCTA from '@/components/home/BusinessCTA';
import CitySection from '@/components/home/CitySection';
import ShareExperience from '@/components/home/ShareExperience';
import BenefitsSection from '@/components/home/BenefitsSection';
import AboutSection from '@/components/home/AboutSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CtaSection from '@/components/home/CtaSection';
import FaqSection from '@/components/home/FaqSection';
import HeroSection from '@/components/home/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Featured Restaurants Grid */}
      <FeaturedRestaurants />
      
      {/* Business CTA */}
      <BusinessCTA />
      
      {/* Cities Section */}
      <CitySection />
      
      {/* About Section - We Are Foodeez */}
      <AboutSection />
      
      {/* Testimonials from Google Reviews */}
      <TestimonialsSection />
      
      {/* Share Experience CTA */}
      <ShareExperience />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* FAQ Section */}
      <FaqSection />
      
      {/* Main CTA Section */}
      <CtaSection />
    </div>
  );
}
