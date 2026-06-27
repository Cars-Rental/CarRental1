"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { mockUserBookings } from "../utils";
import { formatUserAccountCurrency, formatUserAccountDate } from "../utils";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";
import { UserAccountStatusBadge } from "./UserAccountStatusBadge";
import { Button } from "@/components/ui/button";

export function UserBookingsPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("bookings.title")}
        description={t("bookings.description")}
      />

      <div className="space-y-4">
        {mockUserBookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                <Image
                  src={booking.carImage}
                  alt={booking.carTitle}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  {booking.carTitle}
                </h2>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <Info label={t("bookings.pickupDate")} value={formatUserAccountDate(booking.pickupDate, locale)} />
                  <Info label={t("bookings.returnDate")} value={formatUserAccountDate(booking.returnDate, locale)} />
                  <Info label={t("bookings.totalDays")} value={t("bookings.daysValue", { count: booking.totalDays })} />
                  <Info label={t("bookings.totalPrice")} value={formatUserAccountCurrency(booking.totalPrice, locale)} />
                </div>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <UserAccountStatusBadge
                  status={booking.status}
                  label={t(`status.${booking.status}`)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  render={<Link href={ROUTES.CARS.DETAILS(booking.carId)} />}
                >
                  <CalendarDays className="h-4 w-4" />
                  {t("actions.viewDetails")}
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
