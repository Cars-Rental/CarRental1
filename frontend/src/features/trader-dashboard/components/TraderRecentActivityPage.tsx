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
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
        <CardContent className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 rounded-md bg-muted dark:bg-slate-800" />
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
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
      <CardHeader>
        <CardTitle className="text-base text-slate-950 dark:text-slate-100">{t("activity.title")}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border p-0 dark:divide-slate-800">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted dark:bg-slate-800">
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
                  <p className="truncate text-sm font-medium text-foreground dark:text-slate-100">
                    {activity.carTitle}
                  </p>
                  <DashboardStatusBadge
                    status={activity.status}
                    label={t(`status.${activity.status}`)}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                  {t(`activity.type.${activity.type}`)} - {activity.customerName}
                </p>
              </div>
            </div>
            <div className="text-sm sm:text-end">
              <p className="font-semibold text-foreground dark:text-slate-100">
                {formatDashboardCurrency(activity.amount, locale)}
              </p>
              <p className="text-xs text-muted-foreground dark:text-slate-400">
                {formatDashboardDate(activity.createdAt, locale)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
