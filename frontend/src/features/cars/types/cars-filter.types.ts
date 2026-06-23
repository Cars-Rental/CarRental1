import type { Transmission, FuelType, BodyType, MarketplaceCar } from "./cars.types";

export type SortOption =
  | "newest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "popular";

export interface PriceRange {
  min: number;
  max: number;
}

export interface YearRange {
  min: number;
  max: number;
}

export interface CarsFilterState {
  brands: string[];
  priceRange: PriceRange;
  yearRange: YearRange;
  transmission: Transmission | "";
  fuelType: FuelType | "";
  bodyType: BodyType | "";
  seats: number | 0;
  location: string;
}

export interface GetCarsParams {
  search?: string;
  fuelType?: FuelType | "";
  bodyType?: BodyType | "";
  seats?: number;
  location?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

export interface GetCarsResponse {
  cars: MarketplaceCar[];
  total: number;
}
