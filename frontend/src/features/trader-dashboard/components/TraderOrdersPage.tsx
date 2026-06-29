"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTraderOrders } from "../hooks";
import type { TraderOrder } from "../types";
import { formatDashboardCurrency, formatDashboardDate } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { DashboardTable } from "./DashboardTable";

export function TraderOrdersPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data, isLoading } = useTraderOrders();
  const orders = useMemo(() => data?.data ?? [], [data?.data]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | TraderOrder["status"]
  >("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minimumPrice = Number(minPrice);
    const maximumPrice = Number(maxPrice);

    return orders.filter((order) => {
      const matchesSearch =
        query.length === 0 ||
        [order.customerName, order.carTitle, order.id]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesMinPrice =
        minPrice.trim().length === 0 ||
        (Number.isFinite(minimumPrice) && order.offerPrice >= minimumPrice);
      const matchesMaxPrice =
        maxPrice.trim().length === 0 ||
        (Number.isFinite(maximumPrice) && order.offerPrice <= maximumPrice);

      return (
        matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice
      );
    });
  }, [maxPrice, minPrice, orders, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  function resetPage() {
    setCurrentPage(1);
  }

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.orders.title")}
        description={t("pages.orders.description")}
      />

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(260px,1fr)_180px_150px_150px]">
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.searchOrders")}
          />
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as "all" | TraderOrder["status"]);
              resetPage();
            }}
            className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="pending">{t("status.pending")}</option>
            <option value="accepted">{t("status.accepted")}</option>
            <option value="negotiating">{t("status.negotiating")}</option>
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
          />
        </CardContent>
      </Card>

      {filteredOrders.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={ShoppingCart}
          title={t("empty.orders.title")}
          description={t("empty.orders.description")}
        />
      ) : (
        <>
          <DashboardTable<TraderOrder>
            data={paginatedOrders}
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
              key: "created",
              header: t("tables.createdAt"),
              cell: (order) => formatDashboardDate(order.createdAt, locale),
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
          <TablePagination
            currentPage={safeCurrentPage}
            pageSize={pageSize}
            totalItems={filteredOrders.length}
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
    <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
