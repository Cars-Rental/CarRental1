"use client";

import { ArrowUpRight, CalendarCheck, Eye, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatDashboardCurrency,
  mockTraderAnalyticsCarPerformance,
  mockTraderAnalyticsSources,
  mockTraderAnalyticsTrend,
  mockTraderDashboardStats,
} from "../utils";
import { DashboardPageHeader } from "./DashboardPageHeader";

const chartHeight = 180;
const chartWidth = 640;
const chartPadding = 28;

function buildLinePath(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = (chartWidth - chartPadding * 2) / (values.length - 1);

  return values
    .map((value, index) => {
      const x = chartPadding + index * step;
      const y =
        chartPadding +
        ((max - value) / range) * (chartHeight - chartPadding * 2);

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

export function TraderAnalyticsPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const revenueValues = mockTraderAnalyticsTrend.map((point) => point.revenue);
  const maxBookings = Math.max(
    ...mockTraderAnalyticsTrend.map((point) => point.bookings)
  );
  const path = buildLinePath(revenueValues);
  const totalViews = mockTraderAnalyticsCarPerformance.reduce(
    (sum, item) => sum + item.views,
    0
  );
  const averageConversion =
    mockTraderAnalyticsCarPerformance.reduce(
      (sum, item) => sum + item.conversionRate,
      0
    ) / mockTraderAnalyticsCarPerformance.length;

  const kpis = [
    {
      label: t("analytics.kpis.monthlyRevenue"),
      value: formatDashboardCurrency(
        mockTraderDashboardStats.monthlyRevenue,
        locale
      ),
      helper: t("analytics.kpis.monthlyRevenueHelper"),
      icon: Wallet,
    },
    {
      label: t("analytics.kpis.totalViews"),
      value: totalViews.toLocaleString(locale),
      helper: t("analytics.kpis.totalViewsHelper"),
      icon: Eye,
    },
    {
      label: t("analytics.kpis.conversionRate"),
      value: `${averageConversion.toFixed(1)}%`,
      helper: t("analytics.kpis.conversionRateHelper"),
      icon: ArrowUpRight,
    },
    {
      label: t("analytics.kpis.completedDemand"),
      value: String(
        mockTraderDashboardStats.completedOrders +
          mockTraderDashboardStats.pendingBookings
      ),
      helper: t("analytics.kpis.completedDemandHelper"),
      icon: CalendarCheck,
    },
  ];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.analytics.title")}
        description={t("pages.analytics.description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                {mockTraderAnalyticsTrend.map((point, index) => {
                  const step =
                    (chartWidth - chartPadding * 2) /
                    (mockTraderAnalyticsTrend.length - 1);
                  const max = Math.max(...revenueValues);
                  const min = Math.min(...revenueValues);
                  const range = max - min || 1;
                  const x = chartPadding + index * step;
                  const y =
                    chartPadding +
                    ((max - point.revenue) / range) *
                      (chartHeight - chartPadding * 2);

                  return (
                    <g key={point.labelKey}>
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
                        {t(`analytics.months.${point.labelKey}`)}
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
              {mockTraderAnalyticsSources.map((segment) => (
                <div
                  key={segment.labelKey}
                  className={segment.colorClass}
                  style={{ width: `${segment.value}%` }}
                />
              ))}
            </div>
            <div className="space-y-3">
              {mockTraderAnalyticsSources.map((segment) => (
                <div
                  key={segment.labelKey}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn("h-2.5 w-2.5 rounded-full", segment.colorClass)}
                    />
                    <span>{t(`analytics.sources.${segment.labelKey}`)}</span>
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
              {mockTraderAnalyticsTrend.map((point) => (
                <div
                  key={point.labelKey}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all"
                    style={{
                      height: `${Math.max((point.bookings / maxBookings) * 190, 16)}px`,
                    }}
                    title={String(point.bookings)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t(`analytics.months.${point.labelKey}`)}
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
            {mockTraderAnalyticsCarPerformance.map((car) => (
              <div key={car.carTitle} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {car.carTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("analytics.carMeta", {
                        views: car.views.toLocaleString(locale),
                        conversion: car.conversionRate,
                      })}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {formatDashboardCurrency(car.revenue, locale)}
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${car.conversionRate * 4}%` }}
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
