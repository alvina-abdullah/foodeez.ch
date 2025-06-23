"use client";
import { useEffect, useState } from "react";
import FoodeezReviewCard from "@/components/core/FoodeezReviewCard";
import {
  business_detail_view_all,
  visitor_business_review_view,
} from "@prisma/client";
import {
  getBusinessById,
  getBusinessReviews,
} from "@/services/BusinessProfilePageService";
import { Skeleton } from "@/components/ui/skeleton";
import Banner from "@/components/core/Banner";
import { useParams } from "next/navigation";
import { extractBusinessId, parseSlug } from "@/lib/utils/genSlug";
import Link from "next/link";
import ReviewForm from "./components/ReviewForm";
import { X } from "lucide-react";

export default function AllFoodeezReviewsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const parsedId = parseSlug(slug);
  const businessId = extractBusinessId(slug);

  const [business, setBusiness] = useState<business_detail_view_all | null>();
  const [reviews, setReviews] = useState<visitor_business_review_view[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCounts, setLikeCounts] = useState<{ [id: number]: number }>({});
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const data = await getBusinessById(parsedId.id);
        setBusiness(data);
      } catch (error) {
        console.error("Error fetching business:", error);
      } finally {
        setLoading(false);
      }
    };
    if (businessId) {
      fetchBusiness();
    }
  }, [businessId, slug, parsedId.id]);

  useEffect(() => {
    async function fetchReviews() {
      let all: visitor_business_review_view[] = [];
      for (let i = 1; i <= 6; i++) {
        const reviews = await getBusinessReviews(
          i,
          5 + Math.floor(Math.random() * 5)
        );
        all = all.concat(reviews);
      }
      setReviews(all);
      setLikeCounts(
        all.reduce(
          (acc, r) => {
            acc[r.VISITOR_BUSINESS_REVIEW_ID] = r.LIKE_COUNT ?? 0;
            return acc;
          },
          {} as { [id: number]: number }
        )
      );
      setLoading(false);
    }
    fetchReviews();
  }, []);

  const handleLike = (id: number) => {
    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const handleDislike = (id: number) => {};
  const handleShare = (id: number) => {};

  // Helper for address
  const getFullAddress = (b: business_detail_view_all | null | undefined) => {
    if (!b) return "";
    const parts = [
      b.ADDRESS_STREET,
      b.ADDRESS_TOWN,
      b.CITY_NAME,
      b.ADDRESS_ZIP ? b.ADDRESS_ZIP.toString() : undefined,
      b.ADDRESS_COUNTRY,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="">
      <Banner
        src="/images/banners/CTAs/shareExperiance.png"
        alt="Share Your Experience with Foodeez"
      />
      <div className="px-2 sm:px-4 lg:px-0">
        <h1 className="py-12 main-heading text-center">{`${business?.BUSINESS_NAME || "Business"}-Reviews`}</h1>
        {/* Business Info Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border rounded-xl p-6 bg-white/80 shadow-sm">
          <div className="flex-1 space-y-2">
            <div className="text-lg font-semibold text-primary">
              {business?.BUSINESS_NAME}
            </div>
            {business && (
              <>
                <div className="text-gray-700 text-sm">
                  <span className="font-medium">Address:</span>{" "}
                  {getFullAddress(business)}
                </div>
                {business.PHONE_NUMBER && (
                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    <a
                      href={`tel:${business.PHONE_NUMBER}`}
                      className="hover:text-accent underline"
                    >
                      {business.PHONE_NUMBER}
                    </a>
                  </div>
                )}
                {business.EMAIL_ADDRESS && (
                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${business.EMAIL_ADDRESS}`}
                      className="hover:text-accent underline"
                    >
                      {business.EMAIL_ADDRESS}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-3 min-w-[180px]">
            <Link href={`/business/${slug}/reservation`}>
              <button className="btn-primary w-full">Reserve Table</button>
            </Link>
            <Link href={`/business/${slug}/menu`}>
              <button className="btn-secondary w-full">See Menu</button>
            </Link>
          </div>
        </div>
        {/* Reviews Section */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-[380px] w-full max-w-md mx-auto" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-20">
            No reviews found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="col-span-full flex justify-end mb-4">
              <button
                className="btn-primary"
                onClick={() => setShowReviewModal(true)}
              >
                Write a Review
              </button>
            </div>
            
            {reviews.map((review) => (
              <FoodeezReviewCard
                key={review.VISITOR_BUSINESS_REVIEW_ID}
                review={review}
                likeCount={likeCounts[review.VISITOR_BUSINESS_REVIEW_ID]}
                onLike={handleLike}
                onDislike={handleDislike}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-lg p-6 relative w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <ReviewForm
              businessId={business?.BUSINESS_ID ?? 0}
              onSuccess={() => {
                setShowReviewModal(false);
                // Optionally refresh reviews here
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
