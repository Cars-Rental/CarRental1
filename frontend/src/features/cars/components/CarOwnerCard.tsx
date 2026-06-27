"use client";

import React from "react";
import { Star, MessageCircle, UserCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CarOwner } from "@/features/cars/types/cars-api.types";

interface CarOwnerCardProps {
  owner: CarOwner;
}

export function CarOwnerCard({ owner }: CarOwnerCardProps) {
  const t = useTranslations("CarDetails");

  // Generate initials for avatar fallback
  const initials = owner.userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-4">
      {/* Owner info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-14 rounded-full bg-[var(--primary)]/10 dark:bg-emerald-400/10 flex items-center justify-center text-[var(--primary)] dark:text-emerald-400 font-extrabold text-lg select-none">
            {initials}
          </div>
          <span className="absolute bottom-0 end-0 size-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {owner.userName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              4.9
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              (120)
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <MessageCircle className="size-3.5" />
          {t("chat")}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] rounded-xl px-3 py-2 transition-colors">
          <UserCircle2 className="size-3.5" />
          {t("visitProfile")}
        </button>
      </div>
    </div>
  );
}
