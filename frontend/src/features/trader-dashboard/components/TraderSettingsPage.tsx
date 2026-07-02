"use client";

import { Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/features/auth/store";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";

export function TraderSettingsPage() {
  const t = useTranslations("TraderDashboard");
  const user = useAppSelector(selectUser);

  return (
    <div>
      <DashboardPageHeader
        title={t("pages.settings.title")}
        description={t("pages.settings.description")}
      />

      {user ? (
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-base text-slate-950 dark:text-slate-100">
              {t("settings.accountInformation")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              { label: t("settings.name"), value: user.userName },
              { label: t("settings.email"), value: user.email },
              { label: t("settings.phone"), value: user.phone },
              { label: t("settings.role"), value: user.role },
            ].map((item) => (
              <div key={item.label} className="rounded-md border border-border bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <div className="text-xs font-medium text-muted-foreground dark:text-slate-400">
                  {item.label}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground dark:text-slate-100">
                  {item.value}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <DashboardEmptyState
          icon={Settings}
          title={t("empty.settings.title")}
          description={t("empty.settings.description")}
        />
      )}
    </div>
  );
}
