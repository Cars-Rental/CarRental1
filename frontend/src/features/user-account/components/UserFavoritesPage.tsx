"use client";

import Image from "next/image";
import { useState } from "react";
import { HeartOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { mockUserFavorites } from "../utils";
import { formatUserAccountCurrency } from "../utils";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";

export function UserFavoritesPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const [favorites, setFavorites] = useState(mockUserFavorites);

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("favorites.title")}
        description={t("favorites.description")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
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
                  <h2 className="font-semibold text-foreground">{car.title}</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {t(`carType.${car.type}`)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
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
                  href={ROUTES.CARS.DETAILS(car.id)}
                  className="inline-flex h-7 flex-1 items-center justify-center rounded-md border border-border bg-background px-2.5 text-[0.8rem] font-semibold transition hover:bg-muted"
                >
                  {t("actions.viewDetails")}
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={() =>
                    setFavorites((current) =>
                      current.filter((item) => item.id !== car.id)
                    )
                  }
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
