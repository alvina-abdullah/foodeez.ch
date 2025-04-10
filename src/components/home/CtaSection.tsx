'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function CtaSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/cta-background.jpg" 
          alt="Food background" 
          fill 
          className="object-cover"
          // Placeholder for actual image - in real implementation use a high-quality image
          style={{ backgroundColor: '#222' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-secondary-900/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Discover Amazing Food Near You?
            </h2>
            
            <p className="text-lg text-white/80 mb-8">
              Join thousands of food lovers who have already found their new favorite restaurants on Foodeez. Whether you're looking for a quick bite or a fine dining experience, we've got you covered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registration" className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-full transition-colors">
                Register Your Business
              </Link>
              
              <Link href="/search" className="inline-block bg-white hover:bg-gray-100 text-secondary-900 font-medium py-3 px-8 rounded-full transition-colors">
                Explore Restaurants
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">10K+</span>
                <span className="text-sm text-white/70">Happy Users</span>
              </div>
              
              <div className="h-12 w-px bg-white/20"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">5K+</span>
                <span className="text-sm text-white/70">Restaurants</span>
              </div>
              
              <div className="h-12 w-px bg-white/20"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-white">100+</span>
                <span className="text-sm text-white/70">Cities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-secondary-500/30 rounded-full blur-3xl"></div>
    </section>
  );
} 