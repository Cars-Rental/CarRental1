import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CarsFilterState, SortOption } from "../types/cars-filter.types";

export interface CarsFeatureState {
  mode: "rent" | "sale";
  rent: {
    filters: CarsFilterState;
    search: string;
    sortBy: SortOption;
    page: number;
  };
  sale: {
    filters: CarsFilterState;
    search: string;
    sortBy: SortOption;
    page: number;
  };
}

const initialRentFilters: CarsFilterState = {
  brands: [],
  priceRange: { min: 0, max: 10000 },
  yearRange: { min: 2020, max: 2025 },
  transmission: "",
  fuelType: "",
  bodyType: "",
  seats: 0,
  location: "",
};

const initialSaleFilters: CarsFilterState = {
  brands: [],
  priceRange: { min: 0, max: 10000000 },
  yearRange: { min: 2020, max: 2025 },
  transmission: "",
  fuelType: "",
  bodyType: "",
  seats: 0,
  location: "",
};

const initialState: CarsFeatureState = {
  mode: "rent",
  rent: {
    filters: initialRentFilters,
    search: "",
    sortBy: "newest",
    page: 1,
  },
  sale: {
    filters: initialSaleFilters,
    search: "",
    sortBy: "newest",
    page: 1,
  },
};

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<"rent" | "sale">) {
      state.mode = action.payload;
    },
    // Rent actions
    setRentFilters(state, action: PayloadAction<Partial<CarsFilterState>>) {
      state.rent.filters = { ...state.rent.filters, ...action.payload };
      state.rent.page = 1; // Reset to page 1 when filter changes
    },
    resetRentFilters(state) {
      state.rent.filters = initialRentFilters;
      state.rent.search = "";
      state.rent.sortBy = "newest";
      state.rent.page = 1;
    },
    setRentSearch(state, action: PayloadAction<string>) {
      state.rent.search = action.payload;
      state.rent.page = 1; // Reset page
    },
    setRentSort(state, action: PayloadAction<SortOption>) {
      state.rent.sortBy = action.payload;
      state.rent.page = 1; // Reset page
    },
    setRentPage(state, action: PayloadAction<number>) {
      state.rent.page = action.payload;
    },

    // Sale actions
    setSaleFilters(state, action: PayloadAction<Partial<CarsFilterState>>) {
      state.sale.filters = { ...state.sale.filters, ...action.payload };
      state.sale.page = 1; // Reset to page 1 when filter changes
    },
    resetSaleFilters(state) {
      state.sale.filters = initialSaleFilters;
      state.sale.search = "";
      state.sale.sortBy = "newest";
      state.sale.page = 1;
    },
    setSaleSearch(state, action: PayloadAction<string>) {
      state.sale.search = action.payload;
      state.sale.page = 1; // Reset page
    },
    setSaleSort(state, action: PayloadAction<SortOption>) {
      state.sale.sortBy = action.payload;
      state.sale.page = 1; // Reset page
    },
    setSalePage(state, action: PayloadAction<number>) {
      state.sale.page = action.payload;
    },
  },
});

export const {
  setMode,
  setRentFilters,
  resetRentFilters,
  setRentSearch,
  setRentSort,
  setRentPage,
  setSaleFilters,
  resetSaleFilters,
  setSaleSearch,
  setSaleSort,
  setSalePage,
} = carsSlice.actions;

export default carsSlice.reducer;
