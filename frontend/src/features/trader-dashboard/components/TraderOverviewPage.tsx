"use client";

import { CalendarDays, ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTraderOverview } from "../hooks";
import type {
  TraderBooking,
  TraderBookingStatus,
  TraderOrder,
  TraderOrderStatus,
  TraderOverviewOrder,
} from "../types";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { DashboardTable } from "./DashboardTable";
import { formatDashboardCurrency } from "../utils";

export function TraderOverviewPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data: overview, isLoading } = useTraderOverview();

  const stats = overview
    ? {
        totalRevenue: overview.revenue.total,
        monthlyRevenue: overview.revenue.total,
        activeRentalCars: overview.activeRentals,
        carsForSale: 0,
        pendingBookings: overview.pendingOrders.total,
        completedOrders: overview.completedOrders.total,
        totalCustomers: overview.totalCustomers,
        averageRating: overview.reviews.average,
      }
    : undefined;

  const bookings = overview?.recentRentOrders.map(mapOverviewRentOrder) ?? [];
  const orders = overview?.recentBuyOrders.map(mapOverviewBuyOrder) ?? [];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.overview.title")}
        description={t("pages.overview.description")}
      />

      <DashboardStatsCards stats={stats} isLoading={isLoading} />

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            {t("pages.overview.recentBookings")}
          </h2>
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
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">
            {t("pages.overview.recentOrders")}
          </h2>
          {orders.length === 0 && !isLoading ? (
            <DashboardEmptyState
              icon={ShoppingCart}
              title={t("empty.orders.title")}
              description={t("empty.orders.description")}
            />
          ) : (
            <DashboardTable<TraderOrder>
              data={orders}
              getRowKey={(order) => order.id}
              isLoading={isLoading}
              columns={[
                {
                  key: "customer",
                  header: t("tables.customer"),
                  cell: (order) => order.customerName,
                },
                {
                  key: "car",
                  header: t("tables.car"),
                  cell: (order) => order.carTitle,
                },
                {
                  key: "offer",
                  header: t("tables.offer"),
                  cell: (order) =>
                    formatDashboardCurrency(order.offerPrice, locale),
                },
                {
                  key: "status",
                  header: t("tables.status"),
                  cell: (order) => (
                    <DashboardStatusBadge
                      status={order.status}
                      label={t(`status.${order.status}`)}
                    />
                  ),
                },
              ]}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function normalizeOverviewStatus(status: string) {
  return status.toLowerCase();
}

function mapOverviewRentOrder(order: TraderOverviewOrder): TraderBooking {
  return {
    id: order.id,
    carId: order.id,
    customerId: order.id,
    startDate: "",
    endDate: "",
    totalPrice: order.totalPrice,
    status: normalizeOverviewStatus(order.status) as TraderBookingStatus,
    customerName: order.customerName,
    carTitle: order.carTitle,
  };
}

function mapOverviewBuyOrder(order: TraderOverviewOrder): TraderOrder {
  return {
    id: order.id,
    carId: order.id,
    customerId: order.id,
    offerPrice: order.totalPrice,
    status: normalizeOverviewStatus(order.status) as TraderOrderStatus,
    createdAt: "",
    customerName: order.customerName,
    carTitle: order.carTitle,
  };
}
