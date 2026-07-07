"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/lib";
import {
  ChatProvider,
  useChatSocket,
} from "@/features/chat/hooks/useChatSocket";
import { useGetOrderById } from "@/features/orders/hooks/useGetOrderById";
import { ROUTES } from "@/config/routes";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { PaymentForm } from "./PaymentForm";

interface PaymentPageProps {
  orderId: string;
  mode: "rent" | "sale";
}

function PaymentSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[420px] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="h-[480px] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function PaymentRoute({ orderId, mode }: PaymentPageProps) {
  const t = useTranslations("Payment");
  const { locale } = useDirection();
  const { createPrivateChat } = useChatSocket();

  const { data: response, isLoading, isError } = useGetOrderById(orderId, mode);
  const order = response?.data;

  const handleOpenChat = () => {
    if (order) {
      createPrivateChat(order.owner._id);
    }
  };

  if (isLoading) return <PaymentSkeleton />;

  if (isError || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <AlertCircle className="size-10 text-rose-400" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {t("errorLoading")}
          </p>
          <Link
            href={`/${locale}${mode === "rent" ? ROUTES.CARS.RENT : ROUTES.CARS.SALE}`}
            className="text-[var(--primary)] text-sm font-bold hover:underline"
          >
            {t("goBack")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium flex-wrap">
          <Link
            href={`/${locale}`}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <Link
            href={`/${locale}${mode === "rent" ? ROUTES.CARS.RENT : ROUTES.CARS.SALE}`}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {mode === "rent"
              ? t("breadcrumb.rentCars")
              : t("breadcrumb.saleCars")}
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <Link
            href={`/${locale}/cars/${order.car._id}?mode=${mode}`}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {order.car.carname}
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300">
            {t("breadcrumb.payment")}
          </span>
        </nav>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
            {mode === "rent" ? t("pageTitle") : t("sessionPageTitle")}
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {mode === "rent" ? t("pageSubtitle") : t("sessionPageSubtitle")}
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — Order summary */}
          <div className="lg:sticky lg:top-8">
            <OrderSummaryCard order={order} mode={mode} />
          </div>

          {/* Right — Payment form */}
          <div>
            <PaymentForm order={order} mode={mode} onChat={handleOpenChat} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentPage(props: PaymentPageProps) {
  return (
    <ChatProvider>
      <PaymentRoute {...props} />
    </ChatProvider>
  );
}
