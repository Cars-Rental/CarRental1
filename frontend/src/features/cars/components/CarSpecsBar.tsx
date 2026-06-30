"use client";

import React from "react";
import { Star, Users, Calendar, Car, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

interface CarSpecsBarProps {
  year: number;
  model: string;
  brand: string;
  bodyType: string;
  seatCount: number;
}

export function CarSpecsBar({
  year,
  model,
  brand,
  bodyType,
  seatCount,
}: CarSpecsBarProps) {
  const t = useTranslations("CarDetails");

  const specs = [
    { icon: Star, label: t("condition"), value: t("excellent") },
    { icon: Car, label: t("type"), value: bodyType },
    { icon: Calendar, label: t("year"), value: String(year) },
    { icon: Tag, label: t("modelLabel"), value: model },
    { icon: Tag, label: t("brand"), value: brand },
    { icon: Users, label: t("seats"), value: String(seatCount) },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {specs.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3 min-w-[80px]"
        >
          <Icon className="size-5 text-[var(--primary)] dark:text-emerald-400" />
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">
            {label}
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-center">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
