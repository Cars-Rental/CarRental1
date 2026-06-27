"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Settings, Fuel, Gauge, MapPin, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/lib";
import type { RawCar } from "@/features/cars/types/cars-api.types";

interface CarCardProps {
  car: RawCar;
  mode: "rent" | "sale";
}

export function CarCard({ car, mode }: CarCardProps) {
  const t = useTranslations("Cars");
  const { isRTL, locale } = useDirection();
  const [isFavorite, setIsFavorite] = useState(false);

  const image =
    car.carimage?.[0]?.secure_url ?? "/assets/images/landing/car1.png";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 w-full select-none bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
        <Link
          href={`/${locale}/cars/${car._id}?mode=${mode}`}
          className="block w-full h-full"
        >
          <Image
            src={image}
            alt={car.carname}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </Link>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute bottom-4 inset-e-4 size-9 rounded-full flex items-center justify-center border shadow-md backdrop-blur-md cursor-pointer transition-all duration-200 ${
            isFavorite
              ? "bg-rose-500 border-rose-500 text-white hover:scale-110"
              : "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-750 text-slate-550 dark:text-slate-350 hover:bg-white dark:hover:bg-slate-800 hover:scale-110"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart className={`size-4.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {car.carbrand} {car.carmodel}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {car.year}
            </span>
          </div>

          <div className="flex justify-between items-start gap-2 mb-3">
            <Link
              href={`/${locale}/cars/${car._id}?mode=${mode}`}
              className="text-base font-bold text-slate-800 dark:text-slate-100 hover:text-[var(--primary)] dark:hover:text-emerald-450 transition-colors line-clamp-1 flex-1"
            >
              {car.carname}
            </Link>
            <div className="flex items-center gap-1 shrink-0 text-amber-500 bg-amber-500/5 py-0.5 px-2 rounded-lg border border-amber-500/10">
              <Star className="size-3.5 fill-current" />
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
            <MapPin className="size-3.5 text-slate-400 dark:text-slate-500" />
            <span>{car.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 p-3 rounded-2xl text-slate-550 dark:text-slate-400 font-medium mb-5">
            <div className="flex flex-col items-center justify-center gap-1 text-[11px] text-center border-e border-slate-200/50 dark:border-slate-800/50">
              <Settings className="size-4 text-[var(--primary)] dark:text-emerald-400 mb-0.5" />
              <span className="line-clamp-1">{car.Transmission}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-[11px] text-center border-e border-slate-200/50 dark:border-slate-800/50">
              <Fuel className="size-4 text-[var(--primary)] dark:text-emerald-400 mb-0.5" />
              <span className="line-clamp-1">{car.fuel}</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-[11px] text-center">
              <Gauge className="size-4 text-primary dark:text-emerald-400 mb-0.5" />
              <span className="line-clamp-1">
                {Number(car.distance).toLocaleString()} {t("km")}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              {mode === "rent" ? t("rentPrice") : t("salePrice")}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                {car.carprice.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                {t("egp")}
                {mode === "rent" && ` / ${t("perDay")}`}
              </span>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <Link
              href={`/${locale}/cars/${car._id}?mode=${mode}`}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-250 dark:border-slate-750 flex items-center justify-center"
            >
              {t("viewDetails")}
            </Link>
            <Link
              href={`/${locale}/cars/${car._id}?mode=${mode}`}
              className="flex-1 bg-primary hover:bg-(--primary-dark) text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-(--primary)/10 hover:shadow-(--primary)/20 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              {mode === "rent" ? t("rentNow") : t("buyNow")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
