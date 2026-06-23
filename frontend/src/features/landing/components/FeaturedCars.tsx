"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarCard } from "./CarCard";
import {
  FEATURED_RENTAL_CARS,
  FEATURED_BUY_CARS,
} from "../constants/landing.constants";
import { useDirection } from "@/lib";

interface FeaturedCarsProps {
  mode: "rent" | "buy";
}

export function FeaturedCars({ mode }: FeaturedCarsProps) {
  const locale = useLocale();
  const t = useTranslations("Landing.featured");
  const { isRTL } = useDirection();
  const cars = mode === "rent" ? FEATURED_RENTAL_CARS : FEATURED_BUY_CARS;

  const title = mode === "rent" ? t("titleRent") : t("titleBuy");
  const subtitle = mode === "rent" ? t("subtitleRent") : t("subtitleBuy");
  const targetLink = mode === "rent" ? `/${locale}/cars` : `/${locale}/buy`;

  return (
    <section
      className="py-20 bg-white dark:bg-slate-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container-main">
        {/* Header Grid */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Show All Link */}
          <Link
            href={targetLink}
            className="flex items-center gap-1 text-[var(--primary)] hover:text-[var(--primary-dark)] text-sm font-bold transition-colors duration-150"
          >
            <span>{t("showAll")}</span>
            {isRTL ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Link>
        </div>

        {/* Cars Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} mode={mode} />
          ))}
        </div>
      </div>
    </section>
  );
}
