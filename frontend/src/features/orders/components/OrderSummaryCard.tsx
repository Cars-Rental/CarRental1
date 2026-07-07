"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Order } from "../types/order.types";

interface OrderSummaryCardProps {
  order: Order;
  mode: "rent" | "sale";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const SESSION_FEE = 300;

export function OrderSummaryCard({ order, mode }: OrderSummaryCardProps) {
  const t = useTranslations("Payment");
  const image = order.car.carimage?.[0]?.secure_url;

  const isRent = mode === "rent";
  const totalAmount = isRent ? order.totalPrice : SESSION_FEE;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm">
      {/* Car image */}
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={order.car.carname}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 start-4">
            <p className="text-white font-extrabold text-lg leading-tight">
              {order.car.carname}
            </p>
            <p className="text-white/80 text-xs font-medium">
              {order.car.carbrand}
            </p>
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col gap-4">
        {/* Order meta */}
        <div className="flex flex-col gap-2">
          {isRent ? (
            <>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Calendar className="size-4 text-[var(--primary)] shrink-0" />
                <span className="font-medium">
                  {formatDate(order.startDate)} → {formatDate(order.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Clock className="size-4 text-[var(--primary)] shrink-0" />
                <span className="font-medium">
                  {order.totalDays} {t("days")}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="size-4 text-[var(--primary)] shrink-0" />
              <span className="font-medium">{t("sessionFeeNote")}</span>
            </div>
          )}
        </div>

        {/* Price breakdown */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-2">
          {isRent ? (
            <>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  {order.priceperDay.toLocaleString()} {t("egp")} ×{" "}
                  {order.totalDays} {t("days")}
                </span>
                <span className="font-semibold">
                  {(order.priceperDay * order.totalDays).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{t("serviceFee")}</span>
                <span className="font-semibold">
                  {(
                    order.totalPrice -
                    order.priceperDay * order.totalDays
                  ).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Tag className="size-3.5 text-[var(--primary)]" />
              <span>{t("sessionFeeDesc")}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-extrabold text-slate-800 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
            <span>{t("totalDue")}</span>
            <span>
              {totalAmount.toLocaleString()} {t("egp")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
