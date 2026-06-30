"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTraderBookings, useUpdateBookingStatus } from "../hooks";
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
  const updateBookingStatus = useUpdateBookingStatus();
  const bookings = useMemo(() => data?.data ?? [], [data?.data]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | TraderBooking["status"]
  >("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredBookings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minimumPrice = Number(minPrice);
    const maximumPrice = Number(maxPrice);

    return bookings.filter((booking) => {
      const matchesSearch =
        query.length === 0 ||
        [booking.customerName, booking.carTitle, booking.id]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesMinPrice =
        minPrice.trim().length === 0 ||
        (Number.isFinite(minimumPrice) && booking.totalPrice >= minimumPrice);
      const matchesMaxPrice =
        maxPrice.trim().length === 0 ||
        (Number.isFinite(maximumPrice) && booking.totalPrice <= maximumPrice);

      return (
        matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice
      );
    });
  }, [bookings, maxPrice, minPrice, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedBookings = filteredBookings.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  function resetPage() {
    setCurrentPage(1);
  }

  function acceptBooking(bookingId: string) {
    updateBookingStatus.mutate({ id: bookingId, status: "accepted" });
  }

  function rejectBooking(bookingId: string) {
    const rejectionReason = window.prompt(t("actions.rejectionReasonPrompt"));

    if (rejectionReason === null) return;

    updateBookingStatus.mutate({
      id: bookingId,
      status: "rejected",
      rejectionReason: rejectionReason?.trim() || undefined,
    });
  }

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.bookings.title")}
        description={t("pages.bookings.description")}
      />

      <Card className="mb-6 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(260px,1fr)_180px_150px_150px]">
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.searchOrders")}
            className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as "all" | TraderBooking["status"]);
              resetPage();
            }}
            className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="pending">{t("status.pending")}</option>
            <option value="accepted">{t("status.accepted")}</option>
            <option value="confirmed">{t("status.confirmed")}</option>
            <option value="completed">{t("status.completed")}</option>
            <option value="cancelled">{t("status.cancelled")}</option>
            <option value="rejected">{t("status.rejected")}</option>
          </select>
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => {
              setMinPrice(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.minPrice")}
            className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => {
              setMaxPrice(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.maxPrice")}
            className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </CardContent>
      </Card>

      {filteredBookings.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={CalendarDays}
          title={t("empty.bookings.title")}
          description={t("empty.bookings.description")}
        />
      ) : (
        <>
          <DashboardTable<TraderBooking>
            data={paginatedBookings}
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
            {
              key: "actions",
              header: t("tables.actions"),
              cell: (booking) => {
                const isMutatingThisBooking =
                  updateBookingStatus.isPending &&
                  updateBookingStatus.variables?.id === booking.id;

                if (booking.status !== "pending") {
                  return (
                    <span className="text-xs text-muted-foreground dark:text-slate-400">
                      {t("actions.noActions")}
                    </span>
                  );
                }

                return (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1"
                      disabled={isMutatingThisBooking}
                      onClick={() => acceptBooking(booking.id)}
                    >
                      {isMutatingThisBooking ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      {t("actions.accept")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive hover:text-destructive"
                      disabled={isMutatingThisBooking}
                      onClick={() => rejectBooking(booking.id)}
                    >
                      <XCircle className="size-4" />
                      {t("actions.reject")}
                    </Button>
                  </div>
                );
              },
            },
            ]}
          />
          <TablePagination
            currentPage={safeCurrentPage}
            pageSize={pageSize}
            totalItems={filteredBookings.length}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            t={t}
          />
        </>
      )}
    </div>
  );
}

function TablePagination({
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
  t,
}: {
  currentPage: number;
  onPageChange: (page: number | ((current: number) => number)) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  t: ReturnType<typeof useTranslations<"TraderDashboard">>;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <span>
        {t("pagination.summary", {
          current: totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1,
          end: Math.min(currentPage * pageSize, totalItems),
          total: totalItems,
        })}
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange((page) => Math.max(1, page - 1))}
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
            onPageChange((page) => Math.min(totalPages, page + 1))
          }
        >
          {t("pagination.next")}
        </Button>
      </div>
    </div>
  );
}
