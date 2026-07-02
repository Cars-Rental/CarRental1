"use client";

import React from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface Review {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  comment: string;
  date: string;
  color: string;
}

// Mock reviews — replace with real API data when available
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    authorName: "Mohamed Adel",
    authorInitials: "MA",
    rating: 5,
    comment:
      "The car was in excellent condition and very clean. Ahmed was extremely professional and punctual with appointments. I'll definitely book again.",
    date: "2 days ago",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    id: "2",
    authorName: "Sara Mahmoud",
    authorInitials: "SM",
    rating: 4,
    comment:
      "A wonderful and comfortable experience. The car is luxurious and perfect for formal occasions.",
    date: "1 week ago",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

interface CarReviewsProps {
  carId: string; // ready for real reviews API call
}

export function CarReviews({ carId }: CarReviewsProps) {
  const t = useTranslations("CarDetails");
  void carId;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          {t("reviewsTitle")}
        </h3>
        <button className="text-xs font-bold text-[var(--primary)] hover:underline">
          {t("viewAll")}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="flex gap-3">
            <div
              className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${review.color}`}
            >
              {review.authorInitials}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {review.authorName}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {review.date}
                </span>
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-3 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
