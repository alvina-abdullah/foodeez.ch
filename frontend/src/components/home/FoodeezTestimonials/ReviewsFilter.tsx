'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/core/Button';
import { Star, Filter, SortAsc, SortDesc } from 'lucide-react';

export type SortOption = 'newest' | 'oldest' | 'rating-high' | 'rating-low';
export type FilterOption = 'all' | 'approved' | 'pending';

interface ReviewsFilterProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
}

const ReviewsFilter: React.FC<ReviewsFilterProps> = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  totalReviews,
  approvedReviews,
  pendingReviews,
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: SortDesc },
    { value: 'oldest', label: 'Oldest First', icon: SortAsc },
    { value: 'rating-high', label: 'Highest Rated', icon: Star },
    { value: 'rating-low', label: 'Lowest Rated', icon: Star },
  ] as const;

  const filterOptions = [
    { value: 'all', label: 'All Reviews', count: totalReviews },
    { value: 'approved', label: 'Approved', count: approvedReviews },
    { value: 'pending', label: 'Pending', count: pendingReviews },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Filter Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Reviews</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                // variant={filterBy === option.value ? 'default' : 'outline'}
                size="sm"
                className={`flex items-center gap-2 ${
                  filterBy === option.value
                    ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                    : 'hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {option.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {option.count}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Section */}
        <div className="lg:w-64">
          <div className="flex items-center gap-2 mb-4">
            <SortAsc className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Sort By</h3>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{totalReviews}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{approvedReviews}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{pendingReviews}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewsFilter; 