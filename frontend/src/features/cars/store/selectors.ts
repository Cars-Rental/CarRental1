import type { RootState } from "@/store/store";

export const selectCarsState = (state: RootState) => state.cars;

export const selectMarketplaceMode = (state: RootState) => state.cars.mode;

export const selectRentState = (state: RootState) => state.cars.rent;

export const selectSaleState = (state: RootState) => state.cars.sale;

// Select current parameters based on the current active mode (rent or sale)
export const selectActiveMarketplaceState = (state: RootState) => {
  const { mode, rent, sale } = state.cars;
  return mode === "rent" ? rent : sale;
};
