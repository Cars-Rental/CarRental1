"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, RefreshCw, WifiOff } from "lucide-react";
import { useDirection } from "@/lib";
import { ROUTES } from "@/config/routes";
import {
  useGetAllRentCars,
  useGetAllSaleCars,
} from "@/features/cars/hooks/useGetAllCars";
import { CarCard } from "@/components/shared/CarCard";

interface FeaturedCarsProps {
  mode: "rent" | "sale";
}

export function FeaturedCars({ mode }: FeaturedCarsProps) {
  const { CARS } = ROUTES;
  const locale = useLocale();
  const t = useTranslations("Landing.featured");
  const { isRTL } = useDirection();

  const rentQuery = useGetAllRentCars();
  const saleQuery = useGetAllSaleCars();

  const { cars, isLoading, isError, refetch } =
    mode === "rent"
      ? {
          cars: rentQuery.cars.slice(0, 3),
          isLoading: rentQuery.isLoading,
          isError: rentQuery.isError,
          refetch: rentQuery.refetch,
        }
      : {
          cars: saleQuery.cars.slice(0, 3),
          isLoading: saleQuery.isLoading,
          isError: saleQuery.isError,
          refetch: saleQuery.refetch,
        };

  const title = mode === "rent" ? t("titleRent") : t("titleBuy");
  const subtitle = mode === "rent" ? t("subtitleRent") : t("subtitleBuy");
  const targetLink =
    mode === "rent" ? `/${locale}${CARS.RENT}` : `/${locale}${CARS.SALE}`;

  return (
    <section
      className="py-20 bg-white dark:bg-slate-950"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>
          <Link
            href={targetLink}
            className="flex items-center gap-1 text-primary hover:text-(--primary-dark) text-sm font-bold transition-colors duration-150"
          >
            <span>{t("showAll")}</span>
            {isRTL ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="relative h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse overflow-hidden border border-slate-200/60 dark:border-slate-800/60"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="max-w-5xl mx-auto rounded-3xl border border-rose-200/80 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-10 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="size-14 rounded-full bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-300 mb-4">
              <WifiOff className="size-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {t("loadErrorTitle")}
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {t("loadErrorDescription")}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-(--primary)/15 transition-all duration-200 hover:bg-(--primary-dark) hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="size-4" />
              <span>{t("retry")}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
