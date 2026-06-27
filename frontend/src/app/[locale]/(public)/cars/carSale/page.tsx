"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setMode } from "@/features/cars/store";
import { useGetAllSaleCars } from "@/features/cars/hooks/useGetAllCars";
import { MarketplaceLayout } from "@/features/cars/components/MarketplaceLayout";
import { CarCard } from "@/components/shared/CarCard";

export default function SaleCarsPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setMode("sale"));
  }, [dispatch]);

  const { cars, total, isLoading } = useGetAllSaleCars();
  return (
    <MarketplaceLayout totalCount={total} isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} mode="sale" />
        ))}
      </div>
    </MarketplaceLayout>
  );
}
