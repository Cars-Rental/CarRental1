"use client";

import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Order } from "../types/order.types";

interface PaymentFormProps {
  order: Order;
  mode: "rent" | "sale";
  onChat?: () => void;
}

interface CardForm {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const SESSION_FEE = 300;

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function PaymentForm({ order, mode, onChat }: PaymentFormProps) {
  const t = useTranslations("Payment");
  const isRent = mode === "rent";
  const totalAmount = isRent
    ? (order.totalPrice ?? 0)
    : (order.carprice ?? SESSION_FEE);

  const [form, setForm] = useState<CardForm>({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<CardForm>>({});

  const validate = (): boolean => {
    const newErrors: Partial<CardForm> = {};
    if (!form.cardName.trim()) newErrors.cardName = t("errors.nameRequired");
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      newErrors.cardNumber = t("errors.cardRequired");
    if (form.expiry.length < 5) newErrors.expiry = t("errors.expiryRequired");
    if (form.cvv.length < 3) newErrors.cvv = t("errors.cvvRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsPaying(true);

    // Simulate payment processing — replace with real gateway call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPaying(false);
    setIsSuccess(true);
  };

  // --- SUCCESS STATE ---
  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm flex flex-col items-center gap-5 text-center">
        <div className="size-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <CheckCircle2 className="size-8 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">
            {isRent ? t("successTitle") : t("sessionSuccessTitle")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
            {isRent
              ? t("successMessage", {
                  car: order.car.carname,
                  from: order.startDate
                    ? new Date(order.startDate).toLocaleDateString("en-EG", {
                        day: "numeric",
                        month: "long",
                      })
                    : "",
                  to: order.endDate
                    ? new Date(order.endDate).toLocaleDateString("en-EG", {
                        day: "numeric",
                        month: "long",
                      })
                    : "",
                  amount: (order.totalPrice ?? 0).toLocaleString(),
                })
              : t("sessionSuccessMessage", { car: order.car.carname })}
          </p>
        </div>
        <div className="text-2xl font-extrabold text-[var(--primary)]">
          {totalAmount.toLocaleString()} {t("egp")}
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {onChat && (
            <button
              type="button"
              onClick={onChat}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-white font-bold py-3 shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary-dark)] transition-all"
            >
              {t("startChatWith", { name: order.car.carname })}
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- FORM STATE ---
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
          <CreditCard className="size-5 text-[var(--primary)]" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
            {t("formTitle")}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {isRent ? t("formSubtitle") : t("sessionFormSubtitle")}
          </p>
        </div>
        <div className="ms-auto flex items-center gap-1 text-[10px] text-slate-400 font-medium">
          <Lock className="size-3" />
          {t("secure")}
        </div>
      </div>

      {/* Sale mode notice */}
      {!isRent && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 rounded-2xl px-4 py-3">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
            {t("sessionNotice")}
          </p>
        </div>
      )}

      {/* Card Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          {t("cardName")}
        </label>
        <input
          type="text"
          value={form.cardName}
          onChange={(e) => {
            setForm((f) => ({ ...f, cardName: e.target.value }));
            setErrors((er) => ({ ...er, cardName: undefined }));
          }}
          placeholder={t("cardNamePlaceholder")}
          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${
            errors.cardName
              ? "border-rose-400 dark:border-rose-500"
              : "border-slate-200 dark:border-slate-700"
          }`}
        />
        {errors.cardName && (
          <p className="text-xs text-rose-500">{errors.cardName}</p>
        )}
      </div>

      {/* Card Number */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          {t("cardNumber")}
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={form.cardNumber}
            onChange={(e) => {
              setForm((f) => ({
                ...f,
                cardNumber: formatCardNumber(e.target.value),
              }));
              setErrors((er) => ({ ...er, cardNumber: undefined }));
            }}
            placeholder="1234 5678 9012 3456"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${
              errors.cardNumber
                ? "border-rose-400 dark:border-rose-500"
                : "border-slate-200 dark:border-slate-700"
            }`}
          />
          <CreditCard className="absolute end-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        </div>
        {errors.cardNumber && (
          <p className="text-xs text-rose-500">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            {t("expiry")}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={form.expiry}
            onChange={(e) => {
              setForm((f) => ({
                ...f,
                expiry: formatExpiry(e.target.value),
              }));
              setErrors((er) => ({ ...er, expiry: undefined }));
            }}
            placeholder="MM/YY"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${
              errors.expiry
                ? "border-rose-400 dark:border-rose-500"
                : "border-slate-200 dark:border-slate-700"
            }`}
          />
          {errors.expiry && (
            <p className="text-xs text-rose-500">{errors.expiry}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            {t("cvv")}
          </label>
          <input
            type="password"
            inputMode="numeric"
            value={form.cvv}
            onChange={(e) => {
              setForm((f) => ({
                ...f,
                cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
              }));
              setErrors((er) => ({ ...er, cvv: undefined }));
            }}
            placeholder="•••"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${
              errors.cvv
                ? "border-rose-400 dark:border-rose-500"
                : "border-slate-200 dark:border-slate-700"
            }`}
          />
          {errors.cvv && <p className="text-xs text-rose-500">{errors.cvv}</p>}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isPaying}
        className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm py-4 rounded-2xl shadow-md shadow-[var(--primary)]/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none mt-1"
      >
        {isPaying ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Lock className="size-4" />
        )}
        {isPaying
          ? t("processing")
          : `${t("payNow")} ${totalAmount.toLocaleString()} ${t("egp")}`}
      </button>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1">
        <Lock className="size-3" />
        {t("secureNote")}
      </p>
    </div>
  );
}
