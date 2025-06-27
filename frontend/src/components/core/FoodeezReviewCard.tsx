import { Card } from "@/components/ui/card";
import StarIcon from "@/components/ui/StarIcon";
import {
  Share2,
  PlayCircle,
  X,
  Heart,
  Facebook,
  Twitter,
  Copy,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { visitor_business_review_view } from "@prisma/client";
import { createPortal } from "react-dom";

interface FoodeezReviewCardProps {
  review: visitor_business_review_view;
  likeCount?: number;
  onLike?: (id: number) => void;
  onShare?: (id: number) => void;
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
  onShare,
  likeCount,
}: FoodeezReviewCardProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const images = getReviewImages(review);
  const hasVideo = !!review.VIDEO_1;
  const [mounted, setMounted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(
    likeCount ?? review.LIKE_COUNT ?? 0
  );
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // User info
  const userPic = review.PIC || undefined;
  const userName =
    [review.FIRST_NAME, review.LAST_NAME].filter(Boolean).join(" ") ||
    `User${review.VISITORS_ACCOUNT_ID}`;

  // Star rating fix: Only fill up to Math.round(Number(review.RATING))
  const ratingValue = Math.round(Number(review.RATING));

  // Share link (could be improved to be the actual review link)
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleLikeClick = async () => {
    if (likeLoading || liked) return;
    setLikeLoading(true);
    try {
      const res = await fetch("/api/reviews/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: review.VISITOR_BUSINESS_REVIEW_ID }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalLikeCount(data.likeCount);
        setLiked(true);
      }
    } catch (e) {
      // Optionally show error
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-2xl border-2 border-gray-200 bg-white p-5 lg:p-6 shadow-md hover:shadow-lg transition-all flex flex-col h-full">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-3">
        {userPic ? (
          <Image
            src={userPic}
            alt={userName}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary">
            <span className="text-primary text-lg font-bold">
              {userName.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-lg lg:text-xl text-primary leading-tight">
            {userName}
          </p>
          <p className="text-xs lg:text-lg text-text-muted">
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
            fillLevel={i < ratingValue ? 1 : 0}
            size={22}
            className={
              i < ratingValue ? "text-highlight drop-shadow" : "text-gray-800"
            }
          />
        ))}
        <span className="text-sm lg:text-base text-text-main ml-1 font-medium">
          {Number(review.RATING).toFixed(1)}
        </span>
      </div>
      {/* Review Text */}
      <div className="flex-grow overflow-y-auto pr-1 hide-scrollbar mb-2">
        <p className="text-text-main leading-relaxed text-base lg:text-lg font-normal">
          {review.REMARKS}
        </p>
      </div>
      {/* Images & Video */}
      {(images.length > 0 || hasVideo) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <button
              key={img}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-primary/20 flex items-center justify-center bg-black/60"
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
      {showGallery &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative bg-white  shadow-lg max-w-lg w-full p-5 flex flex-col items-center rounded-xl border-2 border-primary/30">
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
                      alt={`Like ${idx + 1}`}
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

      {showShare &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-primary/20">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-primary transition-colors"
                onClick={() => setShowShare(false)}
                aria-label="Close share dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <h3 className="text-xl font-semibold text-primary text-center mb-4">
                Share This Review
              </h3>

              {/* Share Link Input */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  onFocus={(e) => e.target.select()}
                  className="flex-1 text-sm px-3 py-2 border border-primary/30 rounded-full bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                  aria-label="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 text-center mb-2">
                  Link copied!
                </p>
              )}

              {/* Social Share Icons */}
              <div className="flex justify-center gap-4 mt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-green-500/10 hover:bg-green-500/20 transition"
                  aria-label="Share on WhatsApp"
                >
                  <Phone className="text-green-600 w-5 h-5" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="text-blue-600 w-5 h-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-sky-500/10 hover:bg-sky-500/20 transition"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="text-sky-500 w-5 h-5" />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
      {/* Actions */}
      <div className="flex items-center gap-2 mt-8">
        <button
          className={`flex items-center gap-1 text-primary hover:text-accent font-semibold transition ${liked ? "opacity-60 pointer-events-none" : ""}`}
          onClick={handleLikeClick}
          disabled={likeLoading || liked}
          aria-label="Like review"
        >
          <Heart
            className={`h-5 w-5 ${liked ? "fill-primary" : ""} ${likeLoading ? "animate-pulse" : ""}`}
          />
          <span>{localLikeCount}</span>
        </button>
        <button
          className="flex items-center gap-1 text-accent hover:text-blue-800 transition font-semibold"
          onClick={() => setShowShare(true)}
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </Card>
  );
}
