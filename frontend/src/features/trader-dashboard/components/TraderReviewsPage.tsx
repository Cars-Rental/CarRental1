"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTraderReviews } from "../hooks";
import type { TraderReview } from "../types";
import { formatDashboardDate } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardTable } from "./DashboardTable";

export function TraderReviewsPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading } = useTraderReviews(currentPage, pageSize);
  const reviews = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.reviews.title")}
        description={t("pages.reviews.description")}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t("stats.averageRating")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {t("stats.ratingValue", { value: data?.average ?? 0 })}
            </div>
          </CardContent>
        </Card>
        {(["5", "4", "3"] as const).map((rating) => (
          <Card key={rating}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("reviews.ratingCount", { rating })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {data?.distribution[rating] ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              cell: (review) =>
                review.createdAt
                  ? formatDashboardDate(review.createdAt, locale)
                  : t("tables.notAvailable"),
            },
          ]}
        />
      )}

      {reviews.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            {t("pagination.summary", {
              current: data?.total === 0 ? 0 : (currentPage - 1) * pageSize + 1,
              end: Math.min(currentPage * pageSize, data?.total ?? 0),
              total: data?.total ?? 0,
            })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            >
              {t("pagination.previous")}
            </Button>
            <span className="min-w-20 text-center">
              {t("pagination.page", { page: currentPage, totalPages })}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
