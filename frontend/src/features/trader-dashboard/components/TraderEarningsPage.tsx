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
  const earningsBreakdown = earnings?.breakdown;

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.earnings.title")}
        description={t("pages.earnings.description")}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
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
        <div className="space-y-6">
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
              <Card key={item.label} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground dark:text-slate-400">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold text-foreground dark:text-slate-100">
                    {formatDashboardCurrency(item.value, locale)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {earningsBreakdown && (
            <div className="grid gap-4 md:grid-cols-2">
              {(["rent", "buy"] as const).map((key) => (
                <Card key={key} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
                  <CardHeader>
                    <CardTitle className="text-base text-slate-950 dark:text-slate-100">
                      {t(`earnings.breakdown.${key}`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground dark:text-slate-400">
                        {t("earnings.earned")}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground dark:text-slate-100">
                        {formatDashboardCurrency(
                          earningsBreakdown[key].earned,
                          locale
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground dark:text-slate-400">
                        {t("earnings.pending")}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground dark:text-slate-100">
                        {formatDashboardCurrency(
                          earningsBreakdown[key].pending,
                          locale
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
