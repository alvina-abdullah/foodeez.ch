"use client";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(12)
        .fill(null)
        .map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg overflow-hidden border border-gray-100"
          >
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
              <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
            </div>
          </div>
        ))}
    </div>
  );
} 