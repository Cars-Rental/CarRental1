"use client";

import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTraderReviews } from "../hooks";
import type { TraderReview } from "../types";
import { formatDashboardDate } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardTable } from "./DashboardTable";

export function TraderReviewsPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data, isLoading } = useTraderReviews();
  const reviews = data?.data ?? [];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.reviews.title")}
        description={t("pages.reviews.description")}
      />

      {reviews.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={Star}
          title={t("empty.reviews.title")}
          description={t("empty.reviews.description")}
        />
      ) : (
        <DashboardTable<TraderReview>
          data={reviews}
          getRowKey={(review) => review.id}
          isLoading={isLoading}
          columns={[
            {
              key: "customer",
              header: t("tables.customer"),
              cell: (review) => review.customerName,
            },
            {
              key: "car",
              header: t("tables.car"),
              cell: (review) => review.carTitle,
            },
            {
              key: "rating",
              header: t("tables.rating"),
              cell: (review) => t("stats.ratingValue", { value: review.rating }),
            },
            {
              key: "comment",
              header: t("tables.comment"),
              cell: (review) => (
                <span className="line-clamp-2 max-w-md">{review.comment}</span>
              ),
            },
            {
              key: "created",
              header: t("tables.createdAt"),
              cell: (review) => formatDashboardDate(review.createdAt, locale),
            },
          ]}
        />
      )}
    </div>
  );
}
