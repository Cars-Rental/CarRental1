"use client";

import React from "react";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/lib";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectMarketplaceMode,
  selectActiveMarketplaceState,
  setRentSort,
  setRentPage,
  setSaleSort,
  setSalePage,
} from "../store";
import { FiltersSidebar } from "./FiltersSidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
// import type { SortOption } from "../types/cars-filter.types";
import type { SortOption } from "../types/cars-api.types";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  totalCount: number;
  isLoading: boolean;
}

export function MarketplaceLayout({
  children,
  totalCount,
  isLoading,
}: MarketplaceLayoutProps) {
  const t = useTranslations("Cars");
  const { isRTL } = useDirection();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMarketplaceMode);
  const { sortBy, page } = useAppSelector(selectActiveMarketplaceState);

  // Sorting Options
  const sortOptions: { value: SortOption; labelKey: string }[] = [
    { value: "newest", labelKey: "sortNewest" },
    { value: "oldest", labelKey: "sortOldest" },
    { value: "price_asc", labelKey: "sortPriceAsc" },
    { value: "price_desc", labelKey: "sortPriceDesc" },
    { value: "popular", labelKey: "sortPopular" },
  ];

  const activeSortLabel = t(
    sortOptions.find((opt) => opt.value === sortBy)?.labelKey || "sortNewest",
  );

  const handleSortChange = (value: string) => {
    const sortVal = value as SortOption;
    if (mode === "rent") {
      dispatch(setRentSort(sortVal));
    } else {
      dispatch(setSaleSort(sortVal));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (mode === "rent") {
      dispatch(setRentPage(newPage));
    } else {
      dispatch(setSalePage(newPage));
    }
    // Scroll window to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination parameters
  const limit = 9;
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Toggle mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className="container mx-auto py-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            {mode === "rent" ? t("rentTitle") : t("saleTitle")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            {t("foundCount", { count: totalCount })}
          </p>
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex lg:hidden items-center justify-center gap-2 h-11 px-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-1 md:flex-initial"
          >
            <SlidersHorizontal className="size-4" />
            <span>{t("filters")}</span>
          </button>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="size-4 text-slate-400" />
                <span className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-wider">
                  {t("sortBy")}:
                </span>
                <span>{activeSortLabel}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-lg"
            >
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={handleSortChange}
              >
                {sortOptions.map((opt) => (
                  <DropdownMenuRadioItem
                    key={opt.value}
                    value={opt.value}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    {t(opt.labelKey)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (visible on large screen) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent pr-1">
          <FiltersSidebar />
        </div>

        {/* Mobile Sidebar Modal/Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
            <div className="w-80 h-full bg-white dark:bg-slate-950 p-6 overflow-y-auto shadow-2xl relative animate-in slide-in-from-right duration-250 border-s border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 end-4 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                &times;
              </button>
              <div className="mt-8">
                <FiltersSidebar />
              </div>
            </div>
            {/* Click outside sidebar to close */}
            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="flex-1 h-full"
            />
          </div>
        )}

        {/* Content Area */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          {/* Main Grid Content */}
          {isLoading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl h-96 animate-pulse overflow-hidden flex flex-col"
                >
                  <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3" />
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
                      <div className="h-4.5 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2" />
                    </div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalCount === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 border border-slate-100 dark:border-slate-700">
                <SlidersHorizontal className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {t("noCarsFound")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Try adjustment of selection filters or keyword search.
              </p>
            </div>
          ) : (
            /* Grid Children */
            children
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              {/* Prev Button */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="size-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Previous Page"
              >
                {isRTL ? (
                  <ChevronRight className="size-5" />
                ) : (
                  <ChevronLeft className="size-5" />
                )}
              </button>

              {/* Page numbers */}
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`size-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/10"
                        : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="size-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                aria-label="Next Page"
              >
                {isRTL ? (
                  <ChevronLeft className="size-5" />
                ) : (
                  <ChevronRight className="size-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
