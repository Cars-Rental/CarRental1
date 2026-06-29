"use client";

import Image from "next/image";
import { useState } from "react";
import { Loader2, ShoppingCart, XCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/config/routes";
import { formatUserAccountCurrency, formatUserAccountDate } from "../utils";
import { useCancelUserBuyOrder, useUserBuyOrders } from "../hooks";
import { UserAccountLayout } from "./UserAccountLayout";
import { UserAccountPageHeader } from "./UserAccountPageHeader";
import { UserAccountStatusBadge } from "./UserAccountStatusBadge";

export function UserOrdersPage() {
  const t = useTranslations("UserAccount");
  const locale = useLocale();
  const { data: orders = [], isLoading, isError } = useUserBuyOrders();
  const cancelOrder = useCancelUserBuyOrder();
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  function openCancelDialog(orderId: string) {
    setCancelOrderId(orderId);
    setCancellationReason("");
  }

  function submitCancelOrder() {
    if (!cancelOrderId) return;
    cancelOrder.mutate({
      id: cancelOrderId,
      cancellationReason: cancellationReason?.trim() || undefined,
    }, {
      onSuccess: () => {
        setCancelOrderId(null);
        setCancellationReason("");
      },
    });
  }

  return (
    <UserAccountLayout>
      <UserAccountPageHeader
        title={t("orders.title")}
        description={t("orders.description")}
      />

      <div className="space-y-4">
        {isLoading && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              {t("orders.loading")}
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card>
            <CardContent className="p-6 text-sm text-destructive">
              {t("orders.error")}
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              {t("orders.empty")}
            </CardContent>
          </Card>
        )}

        {orders.map((order) => {
          const carImage =
            order.car?.carimage?.[0]?.secure_url ??
            "/assets/images/landing/car1.png";
          const carTitle = order.car?.carname ?? t("orders.unknownCar");
          const carId = order.car?._id;
          const price =
            order.totalPrice ?? order.carprice ?? order.car?.carprice ?? 0;
          const isCancelling =
            cancelOrder.isPending && cancelOrder.variables?.id === order._id;

          return (
            <Card key={order._id}>
              <CardContent className="grid gap-4 p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  <Image
                    src={carImage}
                    alt={carTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h2 className="font-semibold text-foreground">{carTitle}</h2>
                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <Info
                      label={t("orders.salePrice")}
                      value={formatUserAccountCurrency(price, locale)}
                    />
                    <Info
                      label={t("orders.orderDate")}
                      value={formatUserAccountDate(order.createdAt, locale)}
                    />
                    <Info
                      label={t("orders.orderStatus")}
                      value={t(`status.${order.status}`)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <UserAccountStatusBadge
                    status={order.status}
                    label={t(`status.${order.status}`)}
                  />
                  {order.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      disabled={isCancelling}
                      onClick={() => openCancelDialog(order._id)}
                    >
                      {isCancelling ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {t("actions.cancel")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={!carId}
                    render={
                      carId ? <Link href={ROUTES.CARS.DETAILS(carId)} /> : undefined
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {t("actions.viewDetails")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={cancelOrderId !== null}
        onOpenChange={(open) => {
          if (!open && !cancelOrder.isPending) {
            setCancelOrderId(null);
            setCancellationReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("orders.cancelTitle")}</DialogTitle>
            <DialogDescription>
              {t("orders.cancelDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="cancellation-reason"
              className="text-sm font-medium text-foreground"
            >
              {t("orders.cancellationReason")}
            </label>
            <textarea
              id="cancellation-reason"
              value={cancellationReason}
              onChange={(event) => setCancellationReason(event.target.value)}
              placeholder={t("orders.cancellationReasonPlaceholder")}
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={cancelOrder.isPending}
              onClick={() => {
                setCancelOrderId(null);
                setCancellationReason("");
              }}
            >
              {t("actions.keepOrder")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelOrder.isPending}
              onClick={submitCancelOrder}
            >
              {cancelOrder.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {t("actions.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
