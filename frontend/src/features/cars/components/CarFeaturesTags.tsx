"use client";

import React from "react";
import { Snowflake, Bluetooth, Map, Fuel, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";

interface CarFeaturesTagsProps {
  transmission: string;
  fuelType: string;
}

// Static features derived from car type — ready to accept real features array from API later
const FEATURE_ICONS: Record<string, React.ElementType> = {
  ac: Snowflake,
  bluetooth: Bluetooth,
  gps: Map,
  fuelSaver: Fuel,
  smartEntry: KeyRound,
};

export function CarFeaturesTags({
  transmission,
  fuelType,
}: CarFeaturesTagsProps) {
  const t = useTranslations("CarDetails");

  const features = [
    { key: "ac", label: t("features.ac") },
    { key: "fuelSaver", label: t("features.fuelSaver") },
    { key: "gps", label: t("features.gps") },
    { key: "bluetooth", label: t("features.bluetooth") },
    { key: "smartEntry", label: t("features.smartEntry") },
  ];

  return (
    <div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">
        {t("featuresTitle")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {features.map(({ key, label }) => {
          const Icon = FEATURE_ICONS[key] ?? KeyRound;
          return (
            <span
              key={key}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
            >
              <Icon className="size-3.5 text-[var(--primary)] dark:text-emerald-400" />
              {label}
            </span>
          );
        })}
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
          {transmission}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
          {fuelType}
        </span>
      </div>
    </div>
  );
}
