"use client";

import { useState } from "react";
import { CalendarDays, Heart, ShoppingCart, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectUser } from "@/features/auth/store";
import { useAppSelector } from "@/store/hooks";
import type { Gender } from "@/features/auth/types";
import { formatUserAccountDate, getInitials } from "../utils";
import { useProfileDocument, useUpdateProfile } from "../hooks";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";
import { UserAccountStatusBadge } from "./UserAccountStatusBadge";

export function UserProfilePage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const user = useAppSelector(selectUser);
  const { data: documentCounts } = useProfileDocument();
  const updateProfile = useUpdateProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    userName: "",
    phone: "",
    gender: "Male" as Gender,
  });

  if (!user) {
    return null;
  }

  const status = user.status ?? "active";
  const joinedAt = user.joinedAt ?? user.createdAt;

  const summaryCards = [
    {
      label: t("profile.summary.bookings"),
      value: documentCounts?.orders ?? user.bookingsCount ?? 0,
      icon: CalendarDays,
    },
    {
      label: t("profile.summary.orders"),
      value: documentCounts?.booking ?? user.ordersCount ?? 0,
      icon: ShoppingCart,
    },
    {
      label: t("profile.summary.favorites"),
      value: documentCounts?.wishLIST ?? user.favoritesCount ?? 0,
      icon: Heart,
    },
  ];

  function submitProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateProfile.mutate(
      {
        userName: formValues.userName.trim(),
        phone: formValues.phone.trim(),
        gender: formValues.gender,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  }

  function openEditProfile() {
    setFormValues({
      userName: user.userName,
      phone: user.phone,
      gender: user.gender,
    });
    setIsEditOpen(true);
  }

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("profile.title")}
        description={t("profile.description")}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {getInitials(user.userName)}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground dark:text-slate-100">
              {user.userName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{user.email}</p>
            <div className="mt-4">
              <UserAccountStatusBadge
                status={status}
                label={t(`status.${status}`)}
              />
            </div>
            <Button
              className="mt-6 w-full gap-2"
              variant="outline"
              onClick={openEditProfile}
            >
              <UserRound className="h-4 w-4" />
              {t("profile.editProfile")}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
            <CardHeader>
              <CardTitle className="text-base text-slate-950 dark:text-slate-100">
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
                <div key={item.label} className="rounded-md border border-border bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                  <p className="text-xs font-medium text-muted-foreground dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground dark:text-slate-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {summaryCards.map((item) => (
              <Card key={item.label} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary dark:bg-emerald-400/10 dark:text-emerald-400">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground dark:text-slate-100">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-slate-400">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={submitProfileUpdate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="dark:text-slate-100">{t("profile.editProfile")}</DialogTitle>
              <DialogDescription className="dark:text-slate-400">
                {t("profile.editDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="profile-userName" className="dark:text-slate-200">{t("fields.name")}</Label>
              <Input
                id="profile-userName"
                value={formValues.userName}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    userName: event.target.value,
                  }))
                }
                required
                className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone" className="dark:text-slate-200">{t("fields.phone")}</Label>
              <Input
                id="profile-phone"
                value={formValues.phone}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                required
                className="dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-gender" className="dark:text-slate-200">{t("fields.gender")}</Label>
              <select
                id="profile-gender"
                value={formValues.gender}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    gender: event.target.value as Gender,
                  }))
                }
                className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
              >
                <option value="Male">{t("gender.Male")}</option>
                <option value="Female">{t("gender.Female")}</option>
              </select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={updateProfile.isPending}
                onClick={() => setIsEditOpen(false)}
              >
                {t("actions.cancel")}
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending
                  ? t("profile.saving")
                  : t("profile.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </UserAccountLayout>
  );
}
