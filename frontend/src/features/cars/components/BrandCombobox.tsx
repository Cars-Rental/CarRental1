"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/lib";

interface BrandComboboxProps {
  selectedBrands: string[];
  onChange: (brands: string[]) => void;
}

const BRANDS = [
  "Toyota",
  "Kia",
  "Mercedes",
  "Hyundai",
  "Chevrolet",
  "BMW",
  "Nissan",
  "Volkswagen",
  "Honda",
  "Mitsubishi",
];

export function BrandCombobox({ selectedBrands, onChange }: BrandComboboxProps) {
  const t = useTranslations("Cars");
  const { isRTL } = useDirection();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBrands = BRANDS.filter((brand) =>
    brand.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onChange([...selectedBrands, brand]);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="relative w-full" ref={containerRef} dir={isRTL ? "rtl" : "ltr"}>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        {t("brand")}
      </label>

      {/* Select Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-h-11 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl cursor-pointer hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-colors"
      >
        <div className="flex flex-wrap gap-1.5 items-center max-w-[90%]">
          {selectedBrands.length === 0 ? (
            <span className="text-sm text-slate-400 dark:text-slate-500">
              {t("any")}
            </span>
          ) : (
            selectedBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold py-0.5 px-2 rounded-lg border border-emerald-200/50 dark:border-emerald-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBrand(brand);
                }}
              >
                {brand}
                <X className="size-3 cursor-pointer hover:text-emerald-900 dark:hover:text-emerald-200" />
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 shrink-0">
          {selectedBrands.length > 0 && (
            <button
              onClick={clearSelection}
              className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-30 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl animate-in fade-in duration-100 slide-in-from-top-2 overflow-hidden">
          {/* Search Box */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
            <Search className="size-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder={t("searchBrand")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm bg-transparent outline-none border-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <X className="size-3 text-slate-450" />
              </button>
            )}
          </div>

          {/* List items */}
          <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
            {filteredBrands.length === 0 ? (
              <div className="text-center py-4 text-sm text-slate-400 dark:text-slate-500">
                {t("noBrandsFound")}
              </div>
            ) : (
              filteredBrands.map((brand) => {
                const isSelected = selectedBrands.includes(brand);
                return (
                  <div
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 text-[var(--primary)] dark:text-emerald-400"
                        : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span>{brand}</span>
                    {isSelected && (
                      <Check className="size-4 text-[var(--primary)] dark:text-emerald-400 font-bold" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
