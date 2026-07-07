"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface CarLocationMapProps {
  location: string;
}

export function CarLocationMap({ location }: CarLocationMapProps) {
  const t = useTranslations("CarDetails");

  return (
    <div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">
        {t("locationTitle")}
      </h3>
      <div className="relative h-52 w-full rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800">
        {/* Map placeholder — replace iframe src with real map embed when ready */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="size-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-2">
              <MapPin className="size-6 text-[var(--primary)]" />
            </div>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
              {t("mapPlaceholder")}
            </p>
          </div>
        </div>

        {/* Location label overlay */}
        <div className="absolute bottom-4 end-4 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full px-3 py-1.5 shadow-md">
          <MapPin className="size-3.5 text-[var(--primary)]" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {location}
          </span>
        </div>
      </div>
    </div>
  );
}
