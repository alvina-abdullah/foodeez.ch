'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FoodeezReview } from '@/types/foodeez-review.types';
import ReviewForm from './ReviewForm';

interface EditReviewModalProps {
  review: FoodeezReview | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  review,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const handleSubmit = async () => {
    try {
      // The form will handle the update
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  if (!review) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Your Review
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <ReviewForm
                initialData={{
                  rating: review.RATING || 5,
                  review: review.REVIEW || '',
                  images: [],
                }}
                isEditing={true}
                onSubmit={handleSubmit}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditReviewModal; 