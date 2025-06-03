"use client";

import { motion } from "framer-motion";

export default function SearchLoading() {
  // Create an array to represent loading skeleton cards
  const skeletonCards = Array.from({ length: 6 }, (_, index) => index);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletonCards.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="h-[420px] bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* Skeleton image */}
          <div className="w-full h-40 bg-gray-200 animate-pulse"></div>
          
          {/* Skeleton content */}
          <div className="p-4">
            {/* Title and rating */}
            <div className="flex justify-between mb-3">
              <div className="h-6 bg-gray-200 animate-pulse w-3/5 rounded"></div>
              <div className="h-6 bg-gray-200 animate-pulse w-1/6 rounded-full"></div>
            </div>
            
            {/* Location */}
            <div className="h-5 bg-gray-200 animate-pulse w-4/5 rounded mt-2"></div>
            
            {/* Description */}
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 animate-pulse w-full rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse w-5/6 rounded"></div>
            </div>
            
            {/* Contact info */}
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-gray-200 animate-pulse w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse w-2/3 rounded"></div>
            </div>
            
            {/* Bottom section */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between">
              <div className="h-5 bg-gray-200 animate-pulse w-1/3 rounded"></div>
              <div className="h-5 bg-gray-200 animate-pulse w-1/4 rounded"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 