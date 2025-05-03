"use client";

import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import { getBusinesses } from "@/lib/db";
import { BusinessDetail } from "@/types/business.types";
import BusinessCard from "@/components/core/BusinessCard"; // Make sure this exists and is default export

// export const metadata: Metadata = {
//   title: "Browse Businesses | Foodeez",
//   description: "Discover and explore all the food businesses in your area",
// };

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const response = await getBusinesses();
        setBusinesses(response);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinesses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Browse All Businesses
          </h1>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Discover amazing food businesses that can satisfy your cravings and
            culinary curiosity.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-secondary-700 text-lg">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {businesses.map((biz) => (
              <BusinessCard key={biz.BUSINESS_ID} business={biz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
