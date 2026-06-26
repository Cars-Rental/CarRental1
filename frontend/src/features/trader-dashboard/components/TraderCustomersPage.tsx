"use client";

import { Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
  const customers = data?.data ?? [];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.customers.title")}
        description={t("pages.customers.description")}
      />

      {customers.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={Users}
          title={t("empty.customers.title")}
          description={t("empty.customers.description")}
        />
      ) : (
        <DashboardTable<TraderCustomer>
          data={customers}
          getRowKey={(customer) => customer.id}
          isLoading={isLoading}
          columns={[
            {
              key: "name",
              header: t("tables.customer"),
              cell: (customer) => (
                <div>
                  <div className="font-medium text-foreground">
                    {customer.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
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
      )}
    </div>
  );
}
