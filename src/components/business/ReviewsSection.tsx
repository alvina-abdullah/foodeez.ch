// components/ReviewsSection.tsx

import Link from 'next/link';
import Button from '../core/Button';

interface ReviewsSectionProps {
  businessId: number;
}

export function ReviewsSection({ businessId }: ReviewsSectionProps) {
  return (
    <div className="pt-6">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {/* Add review list here */}
        <div className="text-gray-500">No reviews yet. Be the first to review!</div>
        <Link href={`/businesses/${businessId}/reviews/add`}>
          <Button variant="primary">Write a Review</Button>
        </Link>
      </div>
    </div>
  );
}