import { useQuery } from "@tanstack/react-query";
import { getRentCarsApi } from "../api/get-rent-cars.api";
import type { GetCarsParams } from "../types/cars-filter.types";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useRentCars(params?: GetCarsParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CARS.RENT, params || {}],
    queryFn: () => getRentCarsApi(params),
  });
}
