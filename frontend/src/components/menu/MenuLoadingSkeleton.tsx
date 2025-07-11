import React from "react";

export default function MenuLoadingSkeleton() {
  return (
    <div className=" px-4 lg:px-0">
      {/* Hero Section Skeleton */}
      <section className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white py-20 px-4 sm:px-8 text-center overflow-hidden">
        <div className="mx-auto w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-white/30 border-8 border-white mb-6" />
        <div className="h-10 w-2/3 mx-auto bg-white/30 rounded mb-4" />
        <div className="h-5 w-1/2 mx-auto bg-white/20 rounded mb-2" />
        <div className="h-4 w-1/3 mx-auto bg-white/10 rounded" />
      </section>
      {/* Menu Tabs Skeleton */}
      <div className="flex gap-4 justify-center mt-8 mb-8">
        {[1,2,3].map((i) => (
          <div key={i} className="h-10 w-32 bg-white/20 rounded-full" />
        ))}
      </div>
      {/* Category/Product Cards Skeleton */}
      <div className="space-y-12">
        {[1,2].map((cat) => (
          <div key={cat}>
            <div className="h-6 w-40 bg-white/20 rounded mb-6 mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white/10 rounded-xl p-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full mb-4" />
                  <div className="h-4 w-2/3 bg-white/20 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 