"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setMode } from "@/features/cars/store";
import { useGetAllRentCars } from "@/features/cars/hooks/useGetAllCars";
import { MarketplaceLayout } from "@/features/cars/components/MarketplaceLayout";
import { CarCard } from "@/components/shared/CarCard";

export default function RentCarsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setMode("rent"));
  }, [dispatch]);

  const { cars, total, isLoading } = useGetAllRentCars();

  return (
    <MarketplaceLayout totalCount={total} isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} mode="rent" />
        ))}
      </div>
    </MarketplaceLayout>
  );
}
