"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { mockUserOrders } from "../utils";
import { formatUserAccountCurrency, formatUserAccountDate } from "../utils";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";
import { UserAccountStatusBadge } from "./UserAccountStatusBadge";

export function UserOrdersPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("orders.title")}
        description={t("orders.description")}
      />

      <div className="space-y-4">
        {mockUserOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="grid gap-4 p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
              <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                <Image
                  src={order.carImage}
                  alt={order.carTitle}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  {order.carTitle}
                </h2>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <Info
                    label={t("orders.salePrice")}
                    value={formatUserAccountCurrency(order.salePrice, locale)}
                  />
                  <Info
                    label={t("orders.orderDate")}
                    value={formatUserAccountDate(order.orderDate, locale)}
                  />
                  <Info
                    label={t("orders.paymentStatus")}
                    value={t(`paymentStatus.${order.paymentStatus}`)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 md:items-end">
                <UserAccountStatusBadge
                  status={order.status}
                  label={t(`status.${order.status}`)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  render={<Link href={ROUTES.CARS.DETAILS(order.carId)} />}
                >
                  <ShoppingCart className="h-4 w-4" />
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
