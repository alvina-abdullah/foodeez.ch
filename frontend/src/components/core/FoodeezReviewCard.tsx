import { Card } from "@/components/ui/card";
import StarIcon from "@/components/ui/StarIcon";
import { ThumbsUp, ThumbsDown, Share2, PlayCircle, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { visitor_business_review_view } from "@prisma/client";
import { createPortal } from "react-dom";

interface FoodeezReviewCardProps {
  review: visitor_business_review_view;
  onLike?: (id: number) => void;
  onDislike?: (id: number) => void;
  onShare?: (id: number) => void;
  likeCount?: number;
}

const getReviewImages = (review: visitor_business_review_view) => {
  return [
    review.PIC_1,
    review.PIC_2,
    review.PIC_3,
    review.PIC_4,
    review.PIC_5,
    review.PIC_6,
    review.PIC_7,
    review.PIC_8,
    review.PIC_9,
    review.PIC_10,
  ].filter(Boolean) as string[];
};

export default function FoodeezReviewCard({
  review,
  onLike,
  onDislike,
  onShare,
  likeCount,
}: FoodeezReviewCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const images = getReviewImages(review);
  const hasVideo = !!review.VIDEO_1;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-3">
        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-lg">
            {review.VISITOR_ID ? `U${review.VISITOR_ID}` : "?"}
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-800">
             {review.REMARKS?.slice(0, 16) || "Anonymous"}
          </p>
          <p className="text-sm text-gray-500">
            {review.CREATION_DATETIME
              ? new Date(review.CREATION_DATETIME).toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>
      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            fillLevel={i < Number(review.RATING) ? 1 : 0}
            size={20}
            className={
              i < Number(review.RATING)
                ? "text-yellow-500"
                : "text-gray-300"
            }
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {Number(review.RATING).toFixed(1)}
        </span>
      </div>
      {/* Review Text */}
      <div className="flex-grow overflow-y-auto pr-1 hide-scrollbar mb-2">
        <p className="text-gray-700 leading-relaxed text-sm">
          {review.REMARKS}
        </p>
      </div>
      {/* Images & Video */}
      {(images.length > 0 || hasVideo) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.slice(0, 3).map((img, idx) => (
            <button
              key={img}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => {
                setGalleryIndex(idx);
                setShowGallery(true);
              }}
              aria-label="View image"
              type="button"
            >
              <Image
                src={img}
                alt={`Review image ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
          {hasVideo && (
            <button
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-black/60"
              onClick={() => {
                setGalleryIndex(images.length); // video index
                setShowGallery(true);
              }}
              aria-label="View video"
              type="button"
            >
              <PlayCircle className="w-10 h-10 text-white/90 absolute z-10" />
              <video
                src={review.VIDEO_1!}
                className="object-cover w-full h-full"
                muted
                loop
                playsInline
                preload="metadata"
                poster={images[0]}
              />
            </button>
          )}
        </div>
      )}
      {/* Gallery Modal */}
      {showGallery && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative bg-white  shadow-lg max-w-lg w-full p-5 flex flex-col items-center">
            <button
              className="absolute top-0 right-0 text-text-main hover:text-primary"
              onClick={() => setShowGallery(false)}
              aria-label="Close gallery"
            >
        <X className="h-6 w-6" />
            </button>
            {galleryIndex < images.length ? (
       
                <Image
                  src={images[galleryIndex]}
                  alt={`Gallery image ${galleryIndex + 1}`}
                  width={400}
                  height={300}
                  className="object-contain max-h-[60vh] rounded-lg"
                />
         
            ) : (
              <video
                src={review.VIDEO_1!}
                controls
                autoPlay
                className="object-contain max-h-[60vh] rounded-lg"
                poster={images[0]}
              />
            )}
            <div className="flex gap-2 mt-4">
              {images.map((img, idx) => (
                <button
                  key={img}
                  className={`w-10 h-10 rounded border-2 ${galleryIndex === idx ? "border-primary" : "border-gray-200"}`}
                  onClick={() => setGalleryIndex(idx)}
                  aria-label={`Show image ${idx + 1}`}
                  type="button"
                >
                  <Image
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    width={40}
                    height={40}
                    className="object-cover rounded"
                  />
                </button>
              ))}
              {hasVideo && (
                <button
                  className={`w-10 h-10 rounded border-2 flex items-center justify-center ${galleryIndex === images.length ? "border-primary" : "border-gray-200"}`}
                  onClick={() => setGalleryIndex(images.length)}
                  aria-label="Show video"
                  type="button"
                >
                  <PlayCircle className="w-6 h-6 text-primary" />
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Actions */}
      <div className="flex items-center gap-4 mt-3">
        <button
          className="flex items-center gap-1 text-primary"
          onClick={() => onLike?.(review.VISITOR_BUSINESS_REVIEW_ID)}
        >
          <ThumbsUp className="h-5 w-5 hover:fill-primary hover:stroke-accent hover:scale-105" />
          <span>{likeCount ?? review.LIKE_COUNT ?? 0}</span>
        </button>
        <button
          className="flex items-center gap-1 text-secondary"
          onClick={() => onDislike?.(review.VISITOR_BUSINESS_REVIEW_ID)}
        >
          <ThumbsDown className="h-5 w-5 hover:fill-secondary hover:stroke-accent hover:scale-105" />
        </button>
        <button
          className="flex items-center gap-1 text-accent hover:text-blue-800 transition"
          onClick={() => onShare?.(review.VISITOR_BUSINESS_REVIEW_ID)}
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
} 