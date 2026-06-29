"use client";

import Image from "next/image";
import { CalendarDays, Package } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";
import { UserAccountStatusBadge } from "./UserAccountStatusBadge";
import { Button } from "@/components/ui/button";
import { useUserOrders } from "../hooks/useUserOrders";
import type { Order } from "@/features/orders/types";

function formatDate(dateStr: string | undefined, locale: string) {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-EG",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

function formatCurrency(amount: number, locale: string) {
  return `${amount.toLocaleString(locale === "ar" ? "ar-EG" : "en-EG")} ${locale === "ar" ? "ج.م" : "EGP"}`;
}

function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
        <div className="aspect-video rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-3 w-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
      </CardContent>
    </Card>
  );
}

function OrderCard({ order, locale }: { order: Order; locale: string }) {
  const t = useTranslations("UserAccount");
  const image = order.car.carimage?.[0]?.secure_url;
  const totalDays = order.totalDays ?? 0;
  const totalPrice = order.totalPrice ?? 0;

  return (
    <Card>
      <CardContent className="grid gap-4 p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
        {/* Car image */}
        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
          {image ? (
            <Image
              src={image}
              alt={order.car.carname}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Package className="size-8 text-slate-300" />
            </div>
          )}
        </div>

        {/* Order info */}
        <div>
          <h2 className="font-semibold text-foreground">{order.car.carname}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {order.car.carbrand}
          </p>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Info
              label={t("bookings.pickupDate")}
              value={formatDate(order.startDate, locale)}
            />
            <Info
              label={t("bookings.returnDate")}
              value={formatDate(order.endDate, locale)}
            />
            <Info
              label={t("bookings.totalDays")}
              value={t("bookings.daysValue", { count: totalDays })}
            />
            <Info
              label={t("bookings.totalPrice")}
              value={formatCurrency(totalPrice, locale)}
            />
          </div>
        </div>

        {/* Status + action */}
        <div className="flex flex-col gap-3 md:items-end">
          <UserAccountStatusBadge
            status={order.status}
            label={t(`status.${order.status}`)}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            render={
              <Link href={`${ROUTES.CARS.RENT}/${order.car._id}?mode=rent`} />
            }
          >
            <CalendarDays className="h-4 w-4" />
            {t("actions.viewDetails")}
          </Button>
        </div>
      </CardContent>
    </Card>
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

export function UserBookingsPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const { data: orders, isLoading, isError } = useUserOrders();

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("bookings.title")}
        description={t("bookings.description")}
      />

      <div className="space-y-4">
        {/* Loading */}
        {isLoading && (
          <>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            {t("bookings.errorLoading")}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && (!orders || orders.length === 0) && (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <CalendarDays className="size-10 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-muted-foreground">
              {t("bookings.empty")}
            </p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href={ROUTES.CARS.RENT} />}
            >
              {t("bookings.browseRentals")}
            </Button>
          </div>
        )}

        {/* Orders list */}
        {!isLoading &&
          !isError &&
          orders?.map((order) => (
            <OrderCard key={order._id} order={order} locale={locale} />
          ))}
      </div>
    </UserAccountLayout>
  );
}
