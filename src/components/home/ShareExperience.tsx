'use client';

import Link from 'next/link';

export default function ShareExperience() {
  return (
    <section className="py-16 bg-orange-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-3">
          Help millions to find the right Place & Food to enjoy
        </h2>
        
        <p className="text-lg text-secondary-700 mb-8">
          Share your experience
        </p>
        
        <Link 
          href="/(auth)/login"
          className="inline-block bg-white border border-gray-300 px-6 py-3 rounded-md font-medium text-primary-600 hover:bg-gray-50 transition-colors"
        >
          Login or Sign Up
        </Link>
      </div>
    </section>
  );
} 