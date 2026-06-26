"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useTranslations } from "next-intl";
import { CalendarIcon, Key } from "lucide-react";

interface BookingCardProps {
  mode: "rent" | "sale";
  pricePerDay?: number;
  priceTotal?: number;
  blockedDates?: Date[];
  carId: string;
}

const SERVICE_FEE = 150;

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isDateBlocked(date: Date, blockedDates: Date[]) {
  return blockedDates.some((blocked) => isSameDay(date, blocked));
}

function daysBetween(from: Date, to: Date) {
  return Math.max(
    1,
    Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function formatDate(date: Date, locale = "ar-EG") {
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
  });
}

export function BookingCard({
  mode,
  pricePerDay = 0,
  priceTotal = 0,
  blockedDates = [],
  carId: _,
}: BookingCardProps) {
  const t = useTranslations("CarDetails");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [fromDate, setFromDate] = useState<Date>(today);
  const [toDate, setToDate] = useState<Date>(tomorrow);
  const [selectingFrom, setSelectingFrom] = useState(true);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (isDateBlocked(date, blockedDates)) return;

    if (selectingFrom) {
      setFromDate(date);
      const newTo = new Date(date);
      newTo.setDate(date.getDate() + 1);
      setToDate(newTo);
      setSelectingFrom(false);
    } else {
      if (date <= fromDate) {
        setFromDate(date);
        setSelectingFrom(false);
      } else {
        setToDate(date);
        setSelectingFrom(true);
      }
    }
  };

  const totalDays = daysBetween(fromDate, toDate);
  const subtotal = pricePerDay * totalDays;
  const grandTotal = subtotal + SERVICE_FEE;

  // --- SALE MODE ---
  if (mode === "sale") {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
        <div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            {t("salePrice")}
          </p>
          <p className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {priceTotal.toLocaleString()}
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 ms-1">
              {t("egp")}
            </span>
          </p>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm py-4 rounded-2xl shadow-md shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 transition-all hover:scale-[1.01] active:scale-[0.99]">
          <Key className="size-4" />
          {t("buyNow")}
        </button>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
          {t("noChargeNote")}
        </p>
      </div>
    );
  }

  // --- RENT MODE ---
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm flex flex-col gap-4">
      {/* Price */}
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-800 dark:text-white">
            {pricePerDay.toLocaleString()}
          </span>
          <span className="text-sm text-slate-400 dark:text-slate-500 font-semibold">
            {t("egp")} / {t("perDay")}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
          {t("preferredDate")}
        </p>
      </div>

      {/* Date display */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectingFrom(true)}
          className={`flex-1 flex items-center gap-2 text-xs font-semibold rounded-xl border px-3 py-2.5 transition-all ${
            selectingFrom
              ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <CalendarIcon className="size-3.5 shrink-0" />
          <span>{formatDate(fromDate)}</span>
        </button>
        <span className="text-slate-400 text-xs shrink-0">→</span>
        <button
          onClick={() => setSelectingFrom(false)}
          className={`flex-1 flex items-center gap-2 text-xs font-semibold rounded-xl border px-3 py-2.5 transition-all ${
            !selectingFrom
              ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
        >
          <CalendarIcon className="size-3.5 shrink-0" />
          <span>{formatDate(toDate)}</span>
        </button>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <Calendar
          mode="single"
          selected={selectingFrom ? fromDate : toDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < today || isDateBlocked(date, blockedDates)}
          modifiers={{
            booked: blockedDates,
            inRange: (date) => date > fromDate && date < toDate,
            rangeStart: fromDate,
            rangeEnd: toDate,
          }}
          modifiersClassNames={{
            booked:
              "bg-slate-100 dark:bg-slate-800 text-slate-400 line-through",
            inRange:
              "bg-[var(--primary)]/10 text-[var(--primary)] rounded-none",
            rangeStart: "bg-[var(--primary)] text-white rounded-l-full",
            rangeEnd: "bg-[var(--primary)] text-white rounded-r-full",
          }}
          className="w-full"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-[var(--primary)] inline-block" />
          {t("legend.selected")}
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-rose-400 inline-block" />
          {t("legend.reserved")}
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" />
          {t("legend.available")}
        </span>
      </div>

      {/* Price breakdown */}
      <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {pricePerDay.toLocaleString()} {t("egp")} × {totalDays} {t("days")}
          </span>
          <span className="font-semibold">{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{t("serviceFee")}</span>
          <span className="font-semibold">{SERVICE_FEE}</span>
        </div>
        <div className="flex justify-between text-sm font-extrabold text-slate-800 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
          <span>{t("total")}</span>
          <span>
            {grandTotal.toLocaleString()} {t("egp")}
          </span>
        </div>
      </div>

      {/* CTA */}
      <button className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm py-4 rounded-2xl shadow-md shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30 transition-all hover:scale-[1.01] active:scale-[0.99]">
        <Key className="size-4" />
        {t("bookNow")}
      </button>

      <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
        {t("noChargeNote")}
      </p>
    </div>
  );
}
