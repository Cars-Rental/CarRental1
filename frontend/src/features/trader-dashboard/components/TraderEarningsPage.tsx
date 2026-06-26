"use client";

import { Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTraderEarnings } from "../hooks";
import { formatDashboardCurrency } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";

export function TraderEarningsPage() {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data: earnings, isLoading } = useTraderEarnings();

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.earnings.title")}
        description={t("pages.earnings.description")}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : earnings ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: t("earnings.availableBalance"),
              value: earnings.availableBalance,
            },
            {
              label: t("earnings.pendingBalance"),
              value: earnings.pendingBalance,
            },
            {
              label: t("earnings.totalEarnings"),
              value: earnings.totalEarnings,
            },
          ].map((item) => (
            <Card key={item.label}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {formatDashboardCurrency(item.value, locale)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          icon={Wallet}
          title={t("empty.earnings.title")}
          description={t("empty.earnings.description")}
        />
      )}
    </div>
  );
}
