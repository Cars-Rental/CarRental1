"use client";

import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTraderBookings } from "../hooks";
import type { TraderBooking } from "../types";
import { formatDashboardCurrency, formatDashboardDate } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { DashboardTable } from "./DashboardTable";

export function TraderBookingsPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data, isLoading } = useTraderBookings();
  const bookings = data?.data ?? [];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.bookings.title")}
        description={t("pages.bookings.description")}
      />

      {bookings.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={CalendarDays}
          title={t("empty.bookings.title")}
          description={t("empty.bookings.description")}
        />
      ) : (
        <DashboardTable<TraderBooking>
          data={bookings}
          getRowKey={(booking) => booking.id}
          isLoading={isLoading}
          columns={[
            {
              key: "customer",
              header: t("tables.customer"),
              cell: (booking) => booking.customerName,
            },
            {
              key: "car",
              header: t("tables.car"),
              cell: (booking) => booking.carTitle,
            },
            {
              key: "dates",
              header: t("tables.dates"),
              cell: (booking) =>
                t("tables.dateRange", {
                  start: formatDashboardDate(booking.startDate, locale),
                  end: formatDashboardDate(booking.endDate, locale),
                }),
            },
            {
              key: "total",
              header: t("tables.total"),
              cell: (booking) =>
                formatDashboardCurrency(booking.totalPrice, locale),
            },
            {
              key: "status",
              header: t("tables.status"),
              cell: (booking) => (
                <DashboardStatusBadge
                  status={booking.status}
                  label={t(`status.${booking.status}`)}
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
