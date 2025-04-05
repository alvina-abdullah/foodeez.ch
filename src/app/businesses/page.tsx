import React from 'react'
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import slugify from "slugify";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Browse Businesses | Foodeez",
  description: "Discover and explore all the food businesses in your area",
};

// Helper function to generate slug
const generateSlug = (name: string, id: number) => {
  return `${slugify(name || '', { lower: true, strict: true })}-${id}`;
};

export default async function BusinessesPage() {
  try {
    // Fetch businesses with pagination
    const businesses = await prisma.business.findMany({
      take: 50,  // Limit to 50 businesses for better performance
      where: {
        APPROVED: 1,  // Only show approved businesses
      },
      orderBy: {
        CREATION_DATETIME: 'desc'  // Show newest first
      }
    });

    // Group businesses by first letter for alphabetical navigation
    const groupedBusinesses = businesses.reduce((acc, business) => {
      if (!business.BUSINESS_NAME) return acc;
      
      const firstLetter = business.BUSINESS_NAME.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(business);
      return acc;
    }, {} as Record<string, typeof businesses>);

    // Sort the keys alphabetically
    const sortedKeys = Object.keys(groupedBusinesses).sort();

    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              Browse All Businesses
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Discover amazing food businesses that can satisfy your cravings and culinary curiosity.
            </p>
          </div>

          {/* Alphabetical Navigation */}
          <div className="flex justify-center flex-wrap gap-2 my-8">
            {sortedKeys.map(letter => (
              <a 
                key={letter}
                href={`#section-${letter}`}
                className="w-8 h-8 flex items-center justify-center bg-white shadow-sm rounded-full text-primary-600 hover:bg-primary-50 font-medium transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          {/* Businesses by Letter */}
          {sortedKeys.map(letter => (
            <div key={letter} id={`section-${letter}`} className="mb-12">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 border-b pb-2">
                {letter}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedBusinesses[letter].map(business => (
                  <BusinessCard key={business.BUSINESS_ID} business={business} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load businesses:", error);
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Loading Error</h1>
          <p className="text-red-500">Failed to load business data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}

// Simplified business card for the listing page
function BusinessCard({ business }: { business: any }) {
  const slug = generateSlug(business.BUSINESS_NAME || '', business.BUSINESS_ID);

  return (
    <Link 
      href={`/businesses/${slug}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-40 w-full">
        {business.IMAGE_URL ? (
          <Image
            src={business.IMAGE_URL}
            alt={business.BUSINESS_NAME || 'Business Image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-secondary-900 truncate">
          {business.BUSINESS_NAME || 'Unnamed Business'}
        </h3>
        {business.ADDRESS_TOWN && (
          <p className="text-sm text-secondary-600 mt-1">
            {business.ADDRESS_TOWN}
          </p>
        )}
        {business.DESCRIPTION && (
          <p className="mt-2 text-sm text-secondary-600 line-clamp-2">
            {business.DESCRIPTION}
          </p>
        )}
      </div>
    </Link>
  );
}