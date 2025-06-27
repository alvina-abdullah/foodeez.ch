"use client";
import { useEffect, useState } from "react";
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
import { extractBusinessId } from "@/lib/utils/genSlug";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/core/Modal";
import { AnimatePresence, motion } from "framer-motion";
import FoodeezReviewCard from "@/components/core/review/FoodeezReviewCard";
import ReviewForm from "@/components/core/review/ReviewForm";

export default function AllFoodeezReviewsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const businessId = extractBusinessId(slug);

  const [business, setBusiness] = useState<business_detail_view_all | null>();
  const [reviews, setReviews] = useState<visitor_business_review_view[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function fetchBusiness() {
      const data = await getBusinessById(Number(businessId));

      const mapped = data
        ? Object.fromEntries(
            Object.entries(data).map(([k, v]) => [
              k,
              v === null ? undefined : v,
            ])
          )
        : null;

      if (mapped && mapped.BUSINESS_ID) {
        setBusiness(mapped as unknown as any);

        // Fetch business reviews
        const businessReviews = await getBusinessReviews(
          Number(mapped.BUSINESS_ID)
        );
        setReviews(businessReviews);
      } else {
        setBusiness(null);
        setReviews([]);
      }

      setLoading(false);
    }

    fetchBusiness();
  }, [businessId]);

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
        <h1 className="py-12 main-heading text-center">{`${business?.BUSINESS_NAME || "Business"}`}</h1>
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
          <div className="">
            <div className="">
              <button
                className="inline-flex items-center px-5 py-2 text-sm font-medium text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors"
                onClick={() => {
                  if (!session) {
                    setShowAuthModal(true);
                  } else {
                    setShowReviewForm((prev) => !prev);
                  }
                }}
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>

              {/* Animated Inline Review Form */}
              <AnimatePresence>
                {showReviewForm && (
                  <motion.div
                    key="review-form"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <ReviewForm
                      businessId={business?.BUSINESS_ID ?? 0}
                      onSuccess={() => setShowReviewForm(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <h1 className="py-12 main-heading text-center">{`${business?.BUSINESS_NAME || "Business"}-Reviews`}</h1>

            <div className="flex-shrink-0 min-w-[250px] w-full sm:w-[350px] pb-12">
              {reviews.map((review) => (
                <FoodeezReviewCard
                  key={review.VISITOR_BUSINESS_REVIEW_ID}
                  review={review}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Login Required"
      >
        <div className="text-center">
          <p className="mb-4">You must be logged in to write a review.</p>
          <div className="flex justify-center gap-4">
            <button
              className="btn-primary"
              onClick={() => router.push("/auth/signin")}
            >
              Sign In
            </button>
            <button
              className="btn-secondary"
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
