import React from 'react'

const LoadingSkeleton = () => {
  return (
    <div className="my-10">
    <div className="mb-6">
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
    </div>
    
    {/* Hero Skeleton */}
    <div className="mb-8">
      <div className="h-20 py-20  bg-gray-200 rounded animate-pulse mb-4" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
      {/* Left: Image Skeleton */}
      <div className="flex items-center justify-center h-full">
        <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse" />
      </div>

      {/* Right: Form Skeleton */}
      <div className="flex flex-col">
        {/* Contact Info Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse mb-8" />
              
              {/* Form Fields */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
              
              {/* Submit Button */}
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse mt-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default LoadingSkeleton