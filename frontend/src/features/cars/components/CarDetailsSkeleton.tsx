import React from "react";

function SkeletonBox({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl ${className}`}
    />
  );
}

export function CarDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <SkeletonBox className="h-4 w-48 mb-6" />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left - Booking card skeleton */}
          <div className="w-full lg:w-[300px] shrink-0">
            <SkeletonBox className="h-[500px] w-full" />
          </div>

          {/* Right - Content */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Gallery */}
            <div className="flex gap-3 h-[420px]">
              <div className="flex flex-col gap-3 w-[160px]">
                <SkeletonBox className="flex-1" />
                <SkeletonBox className="flex-1" />
                <SkeletonBox className="flex-1" />
              </div>
              <SkeletonBox className="flex-1 rounded-3xl" />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-8 w-64" />
              <SkeletonBox className="h-4 w-40" />
            </div>

            {/* Specs bar */}
            <div className="flex gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBox key={i} className="h-20 w-20" />
              ))}
            </div>

            {/* Features */}
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBox key={i} className="h-8 w-24" />
              ))}
            </div>

            {/* Owner */}
            <SkeletonBox className="h-20 w-full" />

            {/* Map */}
            <SkeletonBox className="h-52 w-full" />

            {/* Reviews */}
            <div className="flex flex-col gap-4">
              <SkeletonBox className="h-6 w-32" />
              <SkeletonBox className="h-16 w-full" />
              <SkeletonBox className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
