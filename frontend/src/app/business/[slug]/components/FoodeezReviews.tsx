"use client";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { visitor_business_review_view } from "@prisma/client";
import Link from "next/link";
import FoodeezReviewCard from "@/components/core/FoodeezReviewCard";

interface FoodeezReviewsProps {
  reviews: visitor_business_review_view[];
  genSlug: string;
}

export default function FoodeezReviews({ reviews, genSlug }: FoodeezReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [likeCounts, setLikeCounts] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    const initialLikes: { [id: number]: number } = {};
    reviews.forEach((r) => {
      initialLikes[r.VISITOR_BUSINESS_REVIEW_ID] = r.LIKE_COUNT ?? 0;
    });
    setLikeCounts(initialLikes);
    checkScrollPosition();
  }, [reviews]);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleLike = (id: number) => {
    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
    // TODO: Optionally, call an API to persist like count
  };

  const handleDisLike = (id: number) => {
    // TODO: Optionally, call an API to persist dislike
  };

  const handleShare = (id: number) => {
    // TODO: Implement share logic
  };

  return (
    <div className="relative w-full py-8 px-2 sm:px-4 lg:px-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="sub-heading">Foodeez Reviews</h2>
        <Link href={`/business/${genSlug}/reviews?write=1`}>
          <button className="btn-primary">Write a Review</button>
        </Link>
      </div>
      <div className="relative group">
        {showLeftButton && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
        )}

        {/* Review Cards Carousel */}
        <div
          id="no-scrollbar"
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth space-x-4 py-2 scrollbar-hide"
          onScroll={checkScrollPosition}
        >
          {reviews.length === 0 ? (
            <Card className="w-full min-w-[250px] max-w-md mx-auto h-40 flex items-center justify-center text-gray-500 text-base">
              No reviews available.
            </Card>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.VISITOR_BUSINESS_REVIEW_ID}
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 min-w-[250px] w-full sm:w-[350px]"
              >
                <FoodeezReviewCard
                  review={review}
                  likeCount={likeCounts[review.VISITOR_BUSINESS_REVIEW_ID]}
                  onLike={handleLike}
                  onDislike={handleDisLike}
                  onShare={handleShare}
                />
              </motion.div>
            ))
          )}
        </div>
        {showRightButton && reviews.length > 0 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        )}
      </div>
      <Link
        href={`/business/${genSlug}/reviews`}
        target="_blank"
        rel="noopener noreferrer"
        className=""
      >
        <button className="btn-primary my-8">View more Foodeez reviews</button>
      </Link>
    </div>
  );
}
