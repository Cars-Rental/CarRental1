"use client";

import { useState } from "react";
import { AlertCircle, CreditCard, ExternalLink, Loader2, Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";
import type { Order } from "../types/order.types";
import { useCreatePayment } from "../hooks";

interface PaymentFormProps {
  order: Order;
  mode: "rent" | "sale";
  onChat?: () => void;
}

const SESSION_FEE = 300;

export function PaymentForm({ order, mode }: PaymentFormProps) {
  const t = useTranslations("Payment");
  const locale = useLocale();
  const createPayment = useCreatePayment();
  const isRent = mode === "rent";
  const totalAmount = isRent
    ? (order.totalPrice ?? 0)
    : (order.carprice ?? SESSION_FEE);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getRedirectUrl = () => {
    if (typeof window === "undefined") return undefined;

    const params = new URLSearchParams({
      orderId: order._id,
      mode,
    });

    return `${window.location.origin}/${locale}${ROUTES.PAYMENT.RETURN}?${params.toString()}`;
  };

  const handleCreatePayment = () => {
    setErrorMessage(null);
    createPayment.mutate(
      {
        orderId: order._id,
        type: mode,
        redirectUrl: getRedirectUrl(),
      },
      {
        onSuccess: (response) => {
          if (response.success && response.iframeUrl) {
            setIframeUrl(response.iframeUrl);
            return;
          }

          setErrorMessage(response.message ?? t("errors.gatewayFailed"));
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string; error?: string } } })
              ?.response?.data?.message ??
            (error as { response?: { data?: { error?: string } } })?.response
              ?.data?.error ??
            t("errors.gatewayFailed");
          setErrorMessage(message);
        },
      },
    );
  };

  if (iframeUrl) {
    return (
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-start gap-3 px-2 pt-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
            <Lock className="size-5 text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
              {t("gatewayTitle")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("gatewaySubtitle")}
            </p>
          </div>
          <a
            href={iframeUrl}
            target="_blank"
            rel="noreferrer"
            className="ms-auto inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-[var(--primary)] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={t("openGateway")}
          >
            <ExternalLink className="size-4" />
          </a>
        </div>

        <iframe
          src={iframeUrl}
          title={t("gatewayTitle")}
          className="h-[620px] w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800"
          allow="payment *"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
          <CreditCard className="size-5 text-[var(--primary)]" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
            {t("formTitle")}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isRent ? t("gatewayFormSubtitle") : t("sessionGatewayFormSubtitle")}
          </p>
        </div>
        <div className="ms-auto flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          <Lock className="size-3" />
          {t("secure")}
        </div>
      </div>

      {!isRent && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/20">
          <p className="text-xs font-medium leading-relaxed text-amber-700 dark:text-amber-400">
            {t("sessionNotice")}
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {t("totalDue")}
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {totalAmount.toLocaleString()} {t("egp")}
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:border-rose-800/40 dark:bg-rose-900/20 dark:text-rose-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleCreatePayment}
        disabled={createPayment.isPending}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-4 text-sm font-bold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:scale-[1.01] hover:bg-[var(--primary-dark)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
      >
        {createPayment.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Lock className="size-4" />
        )}
        {createPayment.isPending
          ? t("processing")
          : `${t("payNow")} ${totalAmount.toLocaleString()} ${t("egp")}`}
      </button>

      <p className="flex items-center justify-center gap-1 text-center text-[10px] text-slate-400 dark:text-slate-500">
        <Lock className="size-3" />
        {t("secureNote")}
      </p>
    </div>
  );
}
