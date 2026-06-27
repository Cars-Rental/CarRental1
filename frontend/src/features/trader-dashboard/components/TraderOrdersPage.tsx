"use client";

import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
  const orders = data?.data ?? [];

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.orders.title")}
        description={t("pages.orders.description")}
      />

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
      )}
    </div>
  );
}
