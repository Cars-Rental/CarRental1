import { useQuery } from "@tanstack/react-query";
import { getAllRentCarsApi, getAllSaleCarsApi } from "../api/get-all-cars.api";
import { useAppSelector } from "@/store/hooks";
import { selectRentState, selectSaleState } from "../store";
// import type { RawCar } from "../types/cars-api.types";
import { filterAndSort, paginate } from "../utils/cars-filter";

export function useGetAllRentCars() {
  const rentState = useAppSelector(selectRentState);
  const limit = 9;

  const query = useQuery({
    queryKey: ["cars", "rent"],
    queryFn: getAllRentCarsApi,
  });

  const allCars = query.data?.data ?? [];
  const filtered = filterAndSort(allCars, rentState);
  const paginated = paginate(filtered, rentState.page, limit);

  return {
    ...query,
    cars: paginated,
    total: filtered.length,
  };
}

export function useGetAllSaleCars() {
  const saleState = useAppSelector(selectSaleState);
  const limit = 9;

  const query = useQuery({
    queryKey: ["cars", "sale"],
    queryFn: getAllSaleCarsApi,
  });

  const allCars = query.data?.data ?? [];
  const filtered = filterAndSort(allCars, saleState);
  const paginated = paginate(filtered, saleState.page, limit);

  return {
    ...query,
    cars: paginated,
    total: filtered.length,
  };
}
