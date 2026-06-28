"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight, Heart, Share2, Star } from "lucide-react";
import { useDirection } from "@/lib";
import {
  useGetRentCarById,
  useGetSaleCarById,
} from "@/features/cars/hooks/useGetCarById";
import { CarImageGallery } from "./CarImageGallery";
import { CarSpecsBar } from "./CarSpecsBar";
import { CarFeaturesTags } from "./CarFeaturesTags";
import { CarOwnerCard } from "./CarOwnerCard";
import { CarLocationMap } from "./CarLocationMap";
import { CarReviews } from "./CarReviews";
import { BookingCard } from "./BookingCard";
import { CarDetailsSkeleton } from "./CarDetailsSkeleton";
import { ROUTES } from "@/config/routes";
import {
  useAddFavorite,
  useRemoveFavorite,
  useUserFavorites,
} from "@/features/user-account/hooks";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/features/auth/store";

interface CarDetailsPageProps {
  id: string;
  mode: "rent" | "sale";
}

export function CarDetailsPage({ id, mode }: CarDetailsPageProps) {
  const t = useTranslations("CarDetails");
  const { locale } = useDirection();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: favorites = [] } = useUserFavorites({
    enabled: isAuthenticated,
  });
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const isFavorite = favorites.some((favorite) => favorite.id === id);
  const isFavoritePending = addFavorite.isPending || removeFavorite.isPending;

  const rentQuery = useGetRentCarById(mode === "rent" ? id : "");
  const saleQuery = useGetSaleCarById(mode === "sale" ? id : "");

  const query = mode === "rent" ? rentQuery : saleQuery;
  const { data: car, isLoading, isError } = query;

  if (isLoading) return <CarDetailsSkeleton />;

  if (isError || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {t("errorLoading")}
          </p>
          <Link
            href={`/${locale}${mode === "rent" ? ROUTES.CARS.RENT : ROUTES.CARS.SALE}`}
            className="text-[var(--primary)] text-sm font-bold hover:underline mt-2 inline-block"
          >
            {t("goBack")}
          </Link>
        </div>
      </div>
    );
  }

  const carName = car.carname;
  const subtitle = `${car.Body_Type} • ${car.carmodel}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium flex-wrap">
          <Link
            href={`/${locale}`}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <Link
            href={`/${locale}${mode === "rent" ? ROUTES.CARS.RENT : ROUTES.CARS.SALE}`}
            className="hover:text-[var(--primary)] transition-colors"
          >
            {mode === "rent"
              ? t("breadcrumb.rentCars")
              : t("breadcrumb.saleCars")}
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <span className="text-slate-600 dark:text-slate-300 line-clamp-1">
            {carName}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT — Sticky Booking / Price Card */}
          <div className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-8">
            <BookingCard
              mode={mode}
              pricePerDay={car.carprice}
              priceTotal={car.carprice}
              blockedDates={[]}
              carId={id}
            />
          </div>

          {/* RIGHT — Car details */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            {/* Gallery */}
            <CarImageGallery
              images={car.carimage}
              carName={carName}
              isAvailable={
                car.isavailable === "avilable" ||
                car.isavailable === "available"
              }
            />

            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-tight">
                  {carName}
                </h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">
                  {subtitle}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    4.9
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    (120 {t("reviews")})
                  </span>
                </div>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (!isAuthenticated || isFavoritePending) return;
                    if (isFavorite) {
                      removeFavorite.mutate(id);
                      return;
                    }
                    addFavorite.mutate({
                      carId: id,
                      carModel: mode === "sale" ? "carBuy" : "car",
                    });
                  }}
                  disabled={isFavoritePending}
                  className={`size-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    isFavorite
                      ? "bg-rose-500 border-rose-500 text-white"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                  aria-label={t("toggleFavorite")}
                >
                  <Heart
                    className={`size-4 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
                <button className="size-10 rounded-full border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 flex items-center justify-center hover:scale-110 transition-all duration-200">
                  <Share2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Specs chips */}
            <CarSpecsBar
              year={car.year}
              model={car.carmodel}
              brand={car.carbrand}
              bodyType={car.Body_Type}
              seatCount={car.seatCount}
            />

            {/* Divider */}
            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Features */}
            <CarFeaturesTags
              transmission={car.Transmission}
              fuelType={car.fuel}
            />

            {/* Divider */}
            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Owner */}
            {car.owner && <CarOwnerCard owner={car.owner} />}
            {/* Location Map */}
            <CarLocationMap location={car.location} />

            {/* Divider */}
            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Reviews */}
            <CarReviews carId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
