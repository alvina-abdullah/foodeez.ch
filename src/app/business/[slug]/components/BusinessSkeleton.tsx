import React from 'react';

const shimmer = 'animate-pulse bg-gray-200';

const BusinessSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background py-12 px-4">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Left: Image Skeleton */}
      <div className="md:w-1/2 w-full flex items-stretch">
        <div className={`w-full h-72 md:h-full rounded-xl overflow-hidden shadow ${shimmer}`}></div>
      </div>
      {/* Right: Info Skeleton */}
      <div className="md:w-1/2 w-full flex flex-col gap-6 p-6 md:p-10">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className={`h-8 w-2/3 mb-4 rounded ${shimmer}`}></div>
          <div className={`h-4 w-1/2 mb-6 rounded ${shimmer}`}></div>
          <div className={`h-12 w-40 rounded-lg ${shimmer}`}></div>
        </div>
        <div className="bg-background-card rounded-xl shadow p-6 mb-6">
          <div className={`h-4 w-1/3 mb-2 rounded ${shimmer}`}></div>
          <div className={`h-4 w-1/2 mb-2 rounded ${shimmer}`}></div>
          <div className={`h-4 w-1/4 rounded ${shimmer}`}></div>
        </div>
      </div>
    </div>
  </div>
);

export default BusinessSkeleton; 