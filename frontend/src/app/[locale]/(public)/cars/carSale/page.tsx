"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMode, selectSaleState } from "@/features/cars/store";
import { useSaleCars } from "@/features/cars/hooks/useSaleCars";
// import { useGetAllSaleCars } from "@/features/cars/hooks/useGetAllCars";
import { MarketplaceLayout } from "@/features/cars/components/MarketplaceLayout";
// import { CarCard } from "@/features/cars/components/CarCard";
import { CarCard } from "@/components/shared/CarCard";

import type { GetCarsParams } from "@/features/cars/types/cars-filter.types";

export default function SaleCarsPage() {
  const dispatch = useAppDispatch();
  const { filters, search, sortBy, page } = useAppSelector(selectSaleState);

  // Set marketplace mode to "sale" whenever this page is active
  useEffect(() => {
    dispatch(setMode("sale"));
  }, [dispatch]);

  // Build query params from Redux state
  const params: GetCarsParams = {
    search: search || undefined,
    brands: filters.brands.length > 0 ? filters.brands : undefined,
    priceMin: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
    priceMax:
      filters.priceRange.max < 10000000 ? filters.priceRange.max : undefined,
    yearMin: filters.yearRange.min > 2020 ? filters.yearRange.min : undefined,
    yearMax: filters.yearRange.max < 2025 ? filters.yearRange.max : undefined,
    transmission: filters.transmission || undefined,
    fuelType: filters.fuelType || undefined,
    bodyType: filters.bodyType || undefined,
    seats: filters.seats > 0 ? filters.seats : undefined,
    location: filters.location || undefined,
    sortBy,
    page,
    limit: 9,
  };

  const { data, isLoading } = useSaleCars(params);
  // const { cars, total, isLoading } = useGetAllSaleCars();
  const cars = data?.cars ?? [];
  const total = data?.total ?? 0;
  return (
    <MarketplaceLayout totalCount={total} isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} mode="sale" />
        ))}
      </div>
    </MarketplaceLayout>
  );
}
