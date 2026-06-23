import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Users,
  ShieldAlert,
  Sparkles,
  Briefcase,
  Settings,
} from "lucide-react";
import type { Car } from "../types/landing.types";
import { useLocale, useTranslations } from "next-intl";
import { useDirection } from "@/lib";

interface CarCardProps {
  car: Car;
  mode: "rent" | "buy";
}

export function CarCard({ car, mode }: CarCardProps) {
  const locale = useLocale();
  const t = useTranslations("Landing.featured");
  const { isRTL } = useDirection();

  const transmissionLabel = {
    automatic: t("automatic"),
    manual: t("manual"),
  };

  return (
    <div
      className="card group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Car Image with Badge */}
      <div className="relative h-48 w-full overflow-hidden select-none bg-slate-50 dark:bg-slate-900/60">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />

        {/* Availability Badge */}
        <span className="absolute top-4 start-4 flex items-center gap-1 bg-[#0d9e8f]/10 dark:bg-[#0d9e8f]/20 text-[#0d9e8f] text-[10px] font-bold py-1 px-2.5 rounded-full border border-[#0d9e8f]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0d9e8f] animate-pulse" />
          {t("badgeAvailable")}
        </span>

        {/* Premium Badge if rating is high */}
        {car.rating >= 4.8 && (
          <span className="absolute top-4 end-4 flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold py-1 px-2.5 rounded-full border border-amber-500/20">
            <Sparkles className="size-3" />
            {t("badgePremium")}
          </span>
        )}
      </div>

      {/* Card Info */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Brand and name */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
            {car.brand}
          </p>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-[var(--primary)] transition-colors duration-200 line-clamp-1">
              {car.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 shrink-0 text-amber-500 bg-amber-500/5 py-0.5 px-2 rounded-lg">
              <Star className="size-3.5 fill-current" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {car.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Specs Ribbon */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[var(--primary)]" />
            <span>
              {car.seats} {t("seats")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Settings className="size-4 text-[var(--primary)]" />
            <span>{transmissionLabel[car.transmission]}</span>
          </div>

          {car.category && (
            <div className="flex items-center gap-2 col-span-2 border-t border-slate-200/30 dark:border-slate-800/30 pt-2.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span className="capitalize">
                {car.category === "economy"
                  ? isRTL
                    ? "اقتصادية"
                    : "Economy"
                  : isRTL
                    ? "فاخرة"
                    : "Luxury"}
              </span>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {mode === "rent" ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                  {car.pricePerDay.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  {t("egp")} / {t("perDay")}
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                  {car.priceTotal?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                  {t("egp")}
                </span>
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/${mode === "rent" ? "cars" : "buy"}/${car.id}`}
            className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-[var(--primary)]/10 hover:shadow-[var(--primary)]/20 hover:scale-[1.02] transition-all duration-200 shrink-0"
          >
            {mode === "rent" ? t("bookNow") : t("buyNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}