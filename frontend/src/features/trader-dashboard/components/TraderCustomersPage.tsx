"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTraderCustomers } from "../hooks";
import type { TraderCustomer } from "../types";
import { formatDashboardCurrency } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { DashboardTable } from "./DashboardTable";

export function TraderCustomersPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data, isLoading } = useTraderCustomers();
  const customers = useMemo(() => data?.data ?? [], [data?.data]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minOrders, setMinOrders] = useState("");
  const [minSpent, setMinSpent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredCustomers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minimumOrders = Number(minOrders);
    const minimumSpent = Number(minSpent);

    return customers.filter((customer) => {
      const matchesSearch =
        query.length === 0 ||
        [customer.name, customer.email, customer.phone]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesOrders =
        minOrders.trim().length === 0 ||
        (Number.isFinite(minimumOrders) && customer.ordersCount >= minimumOrders);
      const matchesSpent =
        minSpent.trim().length === 0 ||
        (Number.isFinite(minimumSpent) && customer.totalSpent >= minimumSpent);

      return matchesSearch && matchesOrders && matchesSpent;
    });
  }, [customers, minOrders, minSpent, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  function resetPage() {
    setCurrentPage(1);
  }

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.customers.title")}
        description={t("pages.customers.description")}
      />

      <Card className="mb-6 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[minmax(260px,1fr)_160px_160px]">
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.searchCustomers")}
            className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <Input
            type="number"
            min={0}
            value={minOrders}
            onChange={(event) => {
              setMinOrders(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.minOrders")}
            className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <Input
            type="number"
            min={0}
            value={minSpent}
            onChange={(event) => {
              setMinSpent(event.target.value);
              resetPage();
            }}
            placeholder={t("filters.minSpent")}
            className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={Users}
          title={t("empty.customers.title")}
          description={t("empty.customers.description")}
        />
      ) : (
        <>
          <DashboardTable<TraderCustomer>
            data={paginatedCustomers}
            getRowKey={(customer) => customer.id}
            isLoading={isLoading}
            columns={[
            {
              key: "name",
              header: t("tables.customer"),
              cell: (customer) => (
                <div>
                  <div className="font-medium text-foreground dark:text-slate-100">
                    {customer.name}
                  </div>
                  <div className="text-xs text-muted-foreground dark:text-slate-400">
                    {customer.email}
                  </div>
                </div>
              ),
            },
            {
              key: "phone",
              header: t("tables.phone"),
              cell: (customer) => customer.phone,
            },
            {
              key: "activity",
              header: t("tables.activity"),
              cell: (customer) =>
                t("tables.customerActivity", {
                  bookings: customer.bookingsCount,
                  orders: customer.ordersCount,
                }),
            },
            {
              key: "spent",
              header: t("tables.totalSpent"),
              cell: (customer) =>
                formatDashboardCurrency(customer.totalSpent, locale),
            },
              {
                key: "status",
                header: t("tables.status"),
                cell: (customer) => (
                  <DashboardStatusBadge
                    status={customer.status}
                    label={t(`status.${customer.status}`)}
                  />
                ),
              },
            ]}
          />
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              {t("pagination.summary", {
                current:
                  filteredCustomers.length === 0
                    ? 0
                    : (safeCurrentPage - 1) * pageSize + 1,
                end: Math.min(safeCurrentPage * pageSize, filteredCustomers.length),
                total: filteredCustomers.length,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                {t("pagination.previous")}
              </Button>
              <span className="min-w-20 text-center">
                {t("pagination.page", {
                  page: safeCurrentPage,
                  totalPages,
                })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                {t("pagination.next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
