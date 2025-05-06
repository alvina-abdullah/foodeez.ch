"use client";
import { Card } from "@/components/ui/card";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { GoogleReview } from "./fetchGooglePlaceDetails";

interface GoogleReviewsProps {
  reviews: GoogleReview[];
}

export default function GoogleReviews({ reviews }: GoogleReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      
      // Check position after scroll completes
      setTimeout(checkScrollPosition, 300);
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg mb-6 text-center">
        <p className="text-gray-600">No reviews available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center px-4">
        Customer Reviews
      </h2>

      <div className="relative group">
        {/* Left button - only shown when needed */}
        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-opacity duration-300"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {/* Review Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 px-6 py-2 scrollbar-hide scroll-smooth"
          onScroll={checkScrollPosition}
        >
          {reviews.map((review, idx) => (
            <Card
              key={idx}
              className="min-w-[300px] w-[300px] h-[300px] flex-shrink-0 p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col h-full">
                {/* Header with avatar and name */}
                <div className="flex items-center gap-4 mb-4">
                  {review.profile_photo_url ? (
                    <Image
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover h-12 w-12"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">
                        {review.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.author_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {review.relative_time_description}
                    </p>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                {/* Review text */}
                <div className="flex-grow overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed">
                    {review.text}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right button - only shown when needed */}
        {showRightButton && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-opacity duration-300"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
}