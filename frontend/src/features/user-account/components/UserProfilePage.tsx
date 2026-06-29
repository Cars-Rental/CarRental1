"use client";

import { CalendarDays, Heart, ShoppingCart, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectUser } from "@/features/auth/store";
import { useAppSelector } from "@/store/hooks";
import { formatUserAccountDate, getInitials } from "../utils";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";
import { UserAccountStatusBadge } from "./UserAccountStatusBadge";

export function UserProfilePage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }

  const status = user.status ?? "active";
  const joinedAt = user.joinedAt ?? user.createdAt;

  const summaryCards = [
    {
      label: t("profile.summary.bookings"),
      value: user.bookingsCount ?? 0,
      icon: CalendarDays,
    },
    {
      label: t("profile.summary.orders"),
      value: user.ordersCount ?? 0,
      icon: ShoppingCart,
    },
    {
      label: t("profile.summary.favorites"),
      value: user.favoritesCount ?? 0,
      icon: Heart,
    },
  ];

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("profile.title")}
        description={t("profile.description")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {getInitials(user.userName)}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {user.userName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-4">
              <UserAccountStatusBadge
                status={status}
                label={t(`status.${status}`)}
              />
            </div>
            <Button className="mt-6 w-full gap-2" variant="outline">
              <UserRound className="h-4 w-4" />
              {t("profile.editProfile")}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("profile.personalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                { label: t("fields.name"), value: user.userName },
                { label: t("fields.email"), value: user.email },
                { label: t("fields.phone"), value: user.phone },
                { label: t("fields.gender"), value: t(`gender.${user.gender}`) },
                { label: t("fields.role"), value: t(`role.${user.role}`) },
                {
                  label: t("fields.joinedAt"),
                  value: joinedAt ? formatUserAccountDate(joinedAt, locale) : "-",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-md border border-border p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {summaryCards.map((item) => (
              <Card key={item.label}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </UserAccountLayout>
  );
}
