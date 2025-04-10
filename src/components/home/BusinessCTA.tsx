'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function BusinessCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-accent-light/20 to-primary-light/20">
      <div className="container-custom text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-sm mb-6">
            <TrendingUp className="w-5 h-5 text-accent mr-2" />
            <span className="text-sm font-medium text-text-main">For Restaurant Owners</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Ready to boost your restaurant's visibility?
          </h2>
          
          <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
            Join thousands of restaurants on Foodeez and connect with hungry customers looking for their next favorite meal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/business/register"
              className="btn-primary"
            >
              Add Your Restaurant
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            
            <Link 
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full 
                        text-base font-medium text-text-main hover:bg-gray-50 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 