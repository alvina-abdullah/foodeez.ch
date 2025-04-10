'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface AddReviewFormProps {
  restaurantId: number;
  onSubmitSuccess: (newReview: any) => void; // Callback after successful submission
}

export default function AddReviewForm({ restaurantId, onSubmitSuccess }: AddReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState(''); // Temporary, replace with auth later
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingClick = (index: number) => {
    setRating(index);
  };

  const handleMouseEnter = (index: number) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }
    if (!reviewerName.trim()) {
      setError('Please enter your name.'); // Temporary validation
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: restaurantId,
          rating,
          comment,
          reviewerName, // Send temporary name
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review');
      }

      // Reset form and call success callback
      setRating(0);
      setComment('');
      setReviewerName(''); // Reset temporary name
      onSubmitSuccess(data.review);

    } catch (err: any) {
      console.error('Review submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating*</label>
          <div className="flex space-x-1" onMouseLeave={handleMouseLeave}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Star
                key={index}
                size={24}
                className={`cursor-pointer transition-colors ${
                  (hoverRating || rating) >= index
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
                onClick={() => handleRatingClick(index)}
                onMouseEnter={() => handleMouseEnter(index)}
              />
            ))}
          </div>
        </div>

        {/* Reviewer Name (Temporary) */}
        <div>
          <label htmlFor="reviewerName" className="block text-sm font-medium text-gray-700 mb-1">Your Name*</label>
          <input
            type="text"
            id="reviewerName"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter your name"
          />
          <p className="text-xs text-gray-500 mt-1">This will be replaced by login information later.</p>
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Review*</label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Share your experience..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
} 