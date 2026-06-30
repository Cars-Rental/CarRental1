"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  const { cars, isLoading } =
    mode === "rent"
      ? { cars: rentQuery.cars.slice(0, 3), isLoading: rentQuery.isLoading }
      : { cars: saleQuery.cars.slice(0, 3), isLoading: saleQuery.isLoading };

  const title = mode === "rent" ? t("titleRent") : t("titleBuy");
  const subtitle = mode === "rent" ? t("subtitleRent") : t("subtitleBuy");
  const targetLink =
    mode === "rent" ? `/${locale}${CARS.RENT}` : `/${locale}${CARS.SALE}`;

  return (
    <section
      className="py-20 bg-white dark:bg-slate-950"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto">
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} mode={mode} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
