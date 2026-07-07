import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { getTraderCars } from "../api";

export function useTraderCars(type?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.CARS(type),
    queryFn: () => getTraderCars(type),
  });
}
