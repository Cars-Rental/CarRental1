import { useQuery } from "@tanstack/react-query";
import { getSaleCarsApi } from "../api/get-sale-cars.api";
import type { GetCarsParams } from "../types/cars-filter.types";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useSaleCars(params?: GetCarsParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CARS.SALE, params || {}],
    queryFn: () => getSaleCarsApi(params),
  });
}
