"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTraderRecentActivity } from "../hooks";
import type { TraderRecentActivity } from "../types";
import { formatDashboardCurrency, formatDashboardDate } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatusBadge } from "./DashboardStatusBadge";

export function TraderRecentActivityPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data: activities = [], isLoading } = useTraderRecentActivity();

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.recentActivity.title")}
        description={t("pages.recentActivity.description")}
      />

      <RecentActivityList
        activities={activities}
        isLoading={isLoading}
        locale={locale}
        t={t}
      />
    </div>
  );
}

function RecentActivityList({
  activities,
  isLoading,
  locale,
  t,
}: {
  activities: TraderRecentActivity[];
  isLoading: boolean;
  locale: string;
  t: ReturnType<typeof useTranslations<"TraderDashboard">>;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 rounded-md bg-muted" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <DashboardEmptyState
        icon={CalendarDays}
        title={t("empty.activity.title")}
        description={t("empty.activity.description")}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("activity.title")}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border p-0">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {activity.image ? (
                  <Image
                    src={activity.image}
                    alt={activity.carTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {activity.carTitle}
                  </p>
                  <DashboardStatusBadge
                    status={activity.status}
                    label={t(`status.${activity.status}`)}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(`activity.type.${activity.type}`)} - {activity.customerName}
                </p>
              </div>
            </div>
            <div className="text-sm sm:text-end">
              <p className="font-semibold text-foreground">
                {formatDashboardCurrency(activity.amount, locale)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDashboardDate(activity.createdAt, locale)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
