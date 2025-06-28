"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/core/Button";
import {  Plus, Award,  } from "lucide-react";
import { FoodeezReview } from "@/types/foodeez-review.types";
import { FoodeezReviewService } from "@/services/FoodeezReviewService";
// import { SortOption, FilterOption } from "./ReviewsFilter";
import ReviewsGrid from "./ReviewsGrid";
import ReviewForm from "./ReviewForm";
import EditReviewModal from "./EditReviewModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LoginRequiredModal from "@/components/core/LoginRequiredModal";

const TestimonialsSection: React.FC = () => {
  const { data: session } = useSession();
  
  const [reviews, setReviews] = useState<FoodeezReview[]>([]);
  // const [filteredReviews, setFilteredReviews] = useState<FoodeezReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<FoodeezReview | null>(
    null
  );
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  // const [sortBy, setSortBy] = useState<SortOption>("newest");
  // const [filterBy, setFilterBy] = useState<FilterOption>("all");
  // const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
  }, []);

  // Filter and sort reviews when filters change
  // useEffect(() => {
  //   filterAndSortReviews();
  // }, [reviews, sortBy, filterBy]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const allReviews = await FoodeezReviewService.getReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const filterAndSortReviews = () => {
  //   let filtered = [...reviews];

  //   // Apply filter
  //   switch (filterBy) {
  //     case "approved":
  //       filtered = filtered.filter((review) => review.APPROVED === 1);
  //       break;
  //     case "pending":
  //       filtered = filtered.filter((review) => review.APPROVED === 0);
  //       break;
  //     default:
  //       // Show all reviews
  //       break;
  //   }

  //   // Apply sort
  //   switch (sortBy) {
  //     case "newest":
  //       filtered.sort(
  //         (a, b) =>
  //           new Date(b.CREATION_DATETIME || 0).getTime() -
  //           new Date(a.CREATION_DATETIME || 0).getTime()
  //       );
  //       break;
  //     case "oldest":
  //       filtered.sort(
  //         (a, b) =>
  //           new Date(a.CREATION_DATETIME || 0).getTime() -
  //           new Date(b.CREATION_DATETIME || 0).getTime()
  //       );
  //       break;
  //     case "rating-high":
  //       filtered.sort((a, b) => (b.RATING || 0) - (a.RATING || 0));
  //       break;
  //     case "rating-low":
  //       filtered.sort((a, b) => (a.RATING || 0) - (b.RATING || 0));
  //       break;
  //   }

  //   setFilteredReviews(filtered);
  // };

  const handleReviewSubmit = async () => {
    await loadReviews();
    setShowForm(false);
  };

  const handleReviewEdit = (review: FoodeezReview) => {
    setEditingReview(review);
  };

  const handleReviewDelete = (reviewId: string) => {
    setDeletingReviewId(reviewId);
  };

  const handleReviewUpdate = async () => {
    await loadReviews();
    setEditingReview(null);
  };

  const handleReviewDeleteConfirm = async () => {
    await loadReviews();
    setDeletingReviewId(null);
  };

  // const getStats = () => {
  //   const total = reviews.length;
  //   const approved = reviews.filter((r) => r.APPROVED === 1).length;
  //   const pending = reviews.filter((r) => r.APPROVED === 0).length;
  //   const averageRating =
  //     reviews.length > 0
  //       ? reviews.reduce((sum, r) => sum + (r.RATING || 0), 0) / reviews.length
  //       : 0;

  //   return { total, approved, pending, averageRating };
  // };

  // const stats = getStats();

  return (
    <section className="py-16 ">
      <div className="px-4 lg:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4 sub-heading">
            <Award className="w-8 h-8 text-secondary" />
            <h2 className="">
              What Our Users Say
            </h2>
          </div>
          <p className="sub-heading-description mb-6">
            Discover what our community thinks about Foodeez. Real experiences
            from real people who love great food.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => {
                if (!session) {
                  setShowAuthModal(true);
                } else {
                  setShowForm((prev) => !prev);
                }
              }}
              className=""
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Your Experience With Foodeez
            </Button>
          </div>
        </motion.div>


        {/* Filter Section */}
        {/* <ReviewsFilter
          sortBy={sortBy}
          filterBy={filterBy}
          onSortChange={setSortBy}
          onFilterChange={setFilterBy}
          totalReviews={stats.total}
          approvedReviews={stats.approved}
          pendingReviews={stats.pending}
        /> */}

        {/* Reviews Grid */}
        <ReviewsGrid
          reviews={reviews}
          isLoading={isLoading}
          onEdit={handleReviewEdit}
          onDelete={handleReviewDelete}
        />

        {/* Review Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <ReviewForm
                  onSubmit={handleReviewSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Review Modal */}
        <EditReviewModal
          review={editingReview}
          isOpen={!!editingReview}
          onClose={() => setEditingReview(null)}
          onUpdate={handleReviewUpdate}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          reviewId={deletingReviewId}
          isOpen={!!deletingReviewId}
          onClose={() => setDeletingReviewId(null)}
          onDelete={handleReviewDeleteConfirm}
        />

        {/* Login Required Modal */}
        <LoginRequiredModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          message="Please log in to share your experience with Foodeez."
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;
