"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/config/routes";

interface PaymentReturnPageProps {
  params: Record<string, string | string[] | undefined>;
}

const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
};

export function PaymentReturnPage({ params }: PaymentReturnPageProps) {
  const t = useTranslations("Payment");
  const locale = useLocale();
  const success = getParam(params, "success") === "true";
  const approvedMessage = getParam(params, "data.message") === "Approved";
  const approvedCode = getParam(params, "txn_response_code") === "APPROVED";
  const isApproved = success || approvedMessage || approvedCode;
  const amountCents =
    Number(getParam(params, "amount_cents_int") ?? getParam(params, "amount_cents")) || 0;
  const transactionId = getParam(params, "id") ?? getParam(params, "order");

  useEffect(() => {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.location.href;
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950">
      <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          className={`flex size-16 items-center justify-center rounded-full ${
            isApproved
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300"
          }`}
        >
          {isApproved ? (
            <CheckCircle2 className="size-9" />
          ) : (
            <AlertTriangle className="size-9" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {isApproved ? t("returnSuccessTitle") : t("returnFailedTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {isApproved ? t("returnSuccessMessage") : t("returnFailedMessage")}
        </p>

        <div className="mt-6 grid w-full gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-start text-sm dark:border-slate-800 dark:bg-slate-800/60">
          {amountCents > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                {t("paidAmount")}
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {(amountCents / 100).toLocaleString()} {t("egp")}
              </span>
            </div>
          )}
          {transactionId && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                {t("transactionId")}
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {transactionId}
              </span>
            </div>
          )}
        </div>

        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}${ROUTES.ORDERS}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
          >
            {t("viewOrders")}
          </Link>
          <Link
            href={`/${locale}${ROUTES.HOME}`}
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {t("backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
