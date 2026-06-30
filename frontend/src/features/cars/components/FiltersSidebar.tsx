"use client";

import React from "react";
import { Search, MapPin, Calendar, CircleDollarSign, Filter, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectMarketplaceMode,
  selectRentState,
  selectSaleState,
  setRentFilters,
  resetRentFilters,
  setRentSearch,
  setSaleFilters,
  resetSaleFilters,
  setSaleSearch,
} from "../store";
import { BrandCombobox } from "./BrandCombobox";
import type { BodyType, CarsFilterState, FuelType, Transmission } from "../types/cars-api.types";

const YEAR_OPTIONS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];

export function FiltersSidebar() {
  const t = useTranslations("Cars");
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMarketplaceMode);
  
  const rentState = useAppSelector(selectRentState);
  const saleState = useAppSelector(selectSaleState);

  // Active state based on mode
  const activeState = mode === "rent" ? rentState : saleState;
  const { filters, search } = activeState;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (mode === "rent") {
      dispatch(setRentSearch(val));
    } else {
      dispatch(setSaleSearch(val));
    }
  };

  const updateFilters = (updated: Partial<CarsFilterState>) => {
    if (mode === "rent") {
      dispatch(setRentFilters(updated));
    } else {
      dispatch(setSaleFilters(updated));
    }
  };

  const handleReset = () => {
    if (mode === "rent") {
      dispatch(resetRentFilters());
    } else {
      dispatch(resetSaleFilters());
    }
  };

  const transmissions: (Transmission | "")[] = ["", "automatic", "manual"];
  const fuelTypes: (FuelType | "")[] = ["", "petrol", "diesel", "electric", "hybrid"];
  const bodyTypes: (BodyType | "")[] = ["", "sedan", "suv", "hatchback", "coupe", "pickup", "van", "convertible"];
  const seatOptions = [0, 4, 5, 7];

  return (
    <aside className="w-full bg-white dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4.5 text-[var(--primary)]" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {t("filters")}
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[var(--primary)] dark:text-slate-400 dark:hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40"
        >
          <RefreshCw className="size-3" />
          {t("clearFilters")}
        </button>
      </div>

      {/* 1. Keyword Search */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("searchPlaceholder").replace("...", "")}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={handleSearchChange}
            className="w-full h-11 ps-10 pe-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
          <Search className="absolute top-1/2 start-3.5 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* 2. Brand Combobox */}
      <BrandCombobox
        selectedBrands={filters.brands}
        onChange={(brands) => updateFilters({ brands })}
      />

      {/* 3. Location Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("location")}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={t("locationPlaceholder")}
            value={filters.location}
            onChange={(e) => updateFilters({ location: e.target.value })}
            className="w-full h-11 ps-10 pe-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
          <MapPin className="absolute top-1/2 start-3.5 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* 4. Price Range */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <CircleDollarSign className="size-3.5 text-slate-400" />
          {t("priceRange")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min || ""}
              onChange={(e) =>
                updateFilters({
                  priceRange: { ...filters.priceRange, min: Number(e.target.value) },
                })
              }
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max || ""}
              onChange={(e) =>
                updateFilters({
                  priceRange: { ...filters.priceRange, max: Number(e.target.value) },
                })
              }
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Year Range */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Calendar className="size-3.5 text-slate-400" />
          {t("year")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={filters.yearRange.min}
            onChange={(e) =>
              updateFilters({
                yearRange: { ...filters.yearRange, min: Number(e.target.value) },
              })
            }
            className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500/50 focus:outline-none"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900">
                {y}
              </option>
            ))}
          </select>
          <select
            value={filters.yearRange.max}
            onChange={(e) =>
              updateFilters({
                yearRange: { ...filters.yearRange, max: Number(e.target.value) },
              })
            }
            className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500/50 focus:outline-none"
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900">
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 6. Transmission */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("transmission")}
        </label>
        <div className="flex gap-2">
          {transmissions.map((option) => {
            const isActive = filters.transmission === option;
            return (
              <button
                key={option}
                onClick={() => updateFilters({ transmission: option })}
                className={`flex-1 py-2 px-3 border rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center ${
                  isActive
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-550/20"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {option === "" ? t("any") : t(option)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Fuel Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("fuelType")}
        </label>
        <select
          value={filters.fuelType}
          onChange={(e) => updateFilters({ fuelType: e.target.value as FuelType | "" })}
          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500/50 focus:outline-none"
        >
          {fuelTypes.map((type) => (
            <option key={type} value={type} className="bg-white dark:bg-slate-900">
              {type === "" ? t("any") : t(type)}
            </option>
          ))}
        </select>
      </div>

      {/* 8. Body Type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("bodyType")}
        </label>
        <select
          value={filters.bodyType}
          onChange={(e) => updateFilters({ bodyType: e.target.value as BodyType | "" })}
          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:border-emerald-500/50 focus:outline-none"
        >
          {bodyTypes.map((type) => (
            <option key={type} value={type} className="bg-white dark:bg-slate-900">
              {type === "" ? t("any") : t(type)}
            </option>
          ))}
        </select>
      </div>

      {/* 9. Seats Count */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t("seats")}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {seatOptions.map((opt) => {
            const isActive = filters.seats === opt;
            return (
              <button
                key={opt}
                onClick={() => updateFilters({ seats: opt })}
                className={`py-2 px-1.5 border rounded-xl text-xs font-semibold text-center cursor-pointer transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {opt === 0 ? t("any") : opt}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
