"use client";

import { motion } from "framer-motion";
import BusinessCard from "../../core/BusinessCard";
import { BusinessDetail } from "@/types/business.types";

interface BusinessGridProps {
  businesses: BusinessDetail[];
}

export default function BusinessGrid({ businesses }: BusinessGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <motion.div
          key={business.BUSINESS_ID}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BusinessCard key={business.BUSINESS_ID} business={business} />
        </motion.div>
      ))}
    </div>
  );
} 