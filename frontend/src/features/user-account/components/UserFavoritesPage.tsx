"use client";

import Image from "next/image";
import { HeartOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { formatUserAccountCurrency } from "../utils";
import { useRemoveFavorite, useUserFavorites } from "../hooks";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";

export function UserFavoritesPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const { data: favorites = [], isError, isLoading } = useUserFavorites();
  const removeFavorite = useRemoveFavorite();

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("favorites.title")}
        description={t("favorites.description")}
      />

      {isLoading && <FavoritesSkeleton />}

      {isError && (
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
          <CardContent className="p-6 text-sm text-muted-foreground dark:text-slate-400">
            {t("favorites.error")}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && favorites.length === 0 && (
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
          <CardContent className="p-6 text-sm text-muted-foreground dark:text-slate-400">
            {t("favorites.empty")}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((car) => (
          <Card key={car.id} className="overflow-hidden border-slate-200 bg-white py-0 pb-4 dark:border-slate-800 dark:bg-slate-900/90">
            <div className="relative aspect-video bg-muted dark:bg-slate-800">
              <Image
                src={car.image}
                alt={car.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="space-y-4 p-4">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold text-foreground dark:text-slate-100">{car.title}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary dark:bg-emerald-400/10 dark:text-emerald-300">
                    {t(`carType.${car.type}`)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">
                  {car.brand} {car.model} - {car.year}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label={t("favorites.location")} value={car.location} />
                <Info
                  label={t("favorites.price")}
                  value={formatUserAccountCurrency(car.price, locale)}
                />
              </div>

              <div className="flex gap-2">
                <Link
                  href={`${ROUTES.CARS.DETAILS(car.id)}?mode=${car.type}`}
                  className="inline-flex h-7 flex-1 items-center justify-center rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-semibold transition hover:bg-muted dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {t("actions.viewDetails")}
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  disabled={removeFavorite.isPending}
                  onClick={() => removeFavorite.mutate(car.id)}
                >
                  <HeartOff className="h-4 w-4" />
                  <span className="sr-only">{t("actions.removeFavorite")}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </UserAccountLayout>
  );
}

function FavoritesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90">
          <Skeleton className="aspect-video w-full rounded-none" />
          <CardContent className="space-y-4 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground dark:text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-foreground dark:text-slate-100">{value}</p>
    </div>
  );
}
