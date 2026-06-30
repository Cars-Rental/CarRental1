"use client";

import { ArrowUpRight, CalendarCheck, Car, ShoppingCart, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTraderAnalytics } from "../hooks";
import type { TraderDashboardAnalyticsResponse } from "../types";
import { formatDashboardCurrency } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";

const chartHeight = 180;
const chartWidth = 640;
const chartPadding = 28;

function buildLinePath(values: number[]) {
  if (values.length === 0) return "";

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step =
    values.length === 1 ? 0 : (chartWidth - chartPadding * 2) / (values.length - 1);

  return values
    .map((value, index) => {
      const x =
        values.length === 1
          ? chartWidth / 2
          : chartPadding + index * step;
      const y =
        chartPadding +
        ((max - value) / range) * (chartHeight - chartPadding * 2);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function formatMonth(value: string, locale: string) {
  const date = new Date(`${value}-01T00:00:00.000Z`);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
  }).format(date);
}

function getOrderVolume(data: TraderDashboardAnalyticsResponse) {
  return data.revenueTimeline.map((point) => ({
    month: point.month,
    count: point.rentOrders + point.buyOrders,
  }));
}

export function TraderAnalyticsPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data: analytics, isLoading } = useTraderAnalytics();

  if (isLoading) {
    return (
      <div>
        <DashboardPageHeader
          title={t("pages.analytics.title")}
          description={t("pages.analytics.description")}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-28" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div>
        <DashboardPageHeader
          title={t("pages.analytics.title")}
          description={t("pages.analytics.description")}
        />
        <DashboardEmptyState
          icon={ArrowUpRight}
          title={t("empty.analytics.title")}
          description={t("empty.analytics.description")}
        />
      </div>
    );
  }

  const revenueValues = analytics.revenueTimeline.map(
    (point) => point.totalRevenue
  );
  const orderVolume = getOrderVolume(analytics);
  const maxOrders = Math.max(...orderVolume.map((point) => point.count), 1);
  const path = buildLinePath(revenueValues);
  const topCars = [
    ...analytics.topPerformingCars.rent.map((item) => ({
      id: item._id,
      title: `${item.car.carbrand} ${item.car.carname}`,
      meta: t("analytics.carBookings", { count: item.bookings }),
      revenue: item.revenue,
    })),
    ...analytics.topPerformingCars.buy.map((item) => ({
      id: item._id,
      title: `${item.car.carbrand} ${item.car.carname}`,
      meta: t("analytics.carSales", { count: item.sales }),
      revenue: item.revenue,
    })),
  ]
    .sort((first, second) => second.revenue - first.revenue)
    .slice(0, 5);
  const highestCarRevenue = Math.max(...topCars.map((car) => car.revenue), 1);

  const kpis = [
    {
      label: t("analytics.kpis.monthlyRevenue"),
      value: formatDashboardCurrency(analytics.summary.monthlyRevenue, locale),
      helper: t("analytics.kpis.monthlyRevenueHelper"),
      icon: Wallet,
    },
    {
      label: t("analytics.kpis.totalRentRevenue"),
      value: formatDashboardCurrency(analytics.summary.totalRentRevenue, locale),
      helper: t("analytics.kpis.totalRentRevenueHelper"),
      icon: Car,
    },
    {
      label: t("analytics.kpis.totalBuyRevenue"),
      value: formatDashboardCurrency(analytics.summary.totalBuyRevenue, locale),
      helper: t("analytics.kpis.totalBuyRevenueHelper"),
      icon: ShoppingCart,
    },
    {
      label: t("analytics.kpis.conversionRate"),
      value: `${analytics.summary.conversionRate.toFixed(1)}%`,
      helper: t("analytics.kpis.conversionRateHelper"),
      icon: ArrowUpRight,
    },
    {
      label: t("analytics.kpis.completedDemand"),
      value: analytics.summary.openDemand.toLocaleString(locale),
      helper: t("analytics.kpis.completedDemandHelper"),
      icon: CalendarCheck,
    },
  ];

  const revenueMix = [
    {
      label: t("analytics.sources.rentals"),
      value: analytics.revenueMix.rentPercent,
      colorClass: "bg-primary",
    },
    {
      label: t("analytics.sources.sales"),
      value: analytics.revenueMix.buyPercent,
      colorClass: "bg-amber-500",
    },
  ];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.analytics.title")}
        description={t("pages.analytics.description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {item.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.helper}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("analytics.revenueTrend")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-64 min-w-[640px] text-muted-foreground"
                role="img"
                aria-label={t("analytics.revenueTrend")}
              >
                {[0, 1, 2, 3].map((line) => {
                  const y =
                    chartPadding +
                    (line * (chartHeight - chartPadding * 2)) / 3;

                  return (
                    <line
                      key={line}
                      x1={chartPadding}
                      x2={chartWidth - chartPadding}
                      y1={y}
                      y2={y}
                      className="stroke-border"
                      strokeWidth="1"
                    />
                  );
                })}
                <path
                  d={path}
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {analytics.revenueTimeline.map((point, index) => {
                  const step =
                    analytics.revenueTimeline.length === 1
                      ? 0
                      : (chartWidth - chartPadding * 2) /
                        (analytics.revenueTimeline.length - 1);
                  const max = Math.max(...revenueValues, 1);
                  const min = Math.min(...revenueValues, 0);
                  const range = max - min || 1;
                  const x =
                    analytics.revenueTimeline.length === 1
                      ? chartWidth / 2
                      : chartPadding + index * step;
                  const y =
                    chartPadding +
                    ((max - point.totalRevenue) / range) *
                      (chartHeight - chartPadding * 2);

                  return (
                    <g key={point.month}>
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        className="fill-background stroke-primary"
                        strokeWidth="3"
                      />
                      <text
                        x={x}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[11px]"
                      >
                        {formatMonth(point.month, locale)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("analytics.revenueMix")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex h-4 overflow-hidden rounded-full bg-muted">
              {revenueMix.map((segment) => (
                <div
                  key={segment.label}
                  className={segment.colorClass}
                  style={{ width: `${segment.value}%` }}
                />
              ))}
            </div>
            <div className="space-y-3">
              {revenueMix.map((segment) => (
                <div
                  key={segment.label}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-2.5 w-2.5 rounded-full", segment.colorClass)}
                    />
                    <span>{segment.label}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {segment.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("analytics.bookingVolume")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-end gap-3">
              {orderVolume.map((point) => (
                <div
                  key={point.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all"
                    style={{
                      height: `${Math.max((point.count / maxOrders) * 190, 16)}px`,
                    }}
                    title={String(point.count)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatMonth(point.month, locale)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("analytics.topCars")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCars.map((car) => (
              <div key={car.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {car.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {car.meta}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatDashboardCurrency(car.revenue, locale)}
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.max((car.revenue / highestCarRevenue) * 100, 6)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
