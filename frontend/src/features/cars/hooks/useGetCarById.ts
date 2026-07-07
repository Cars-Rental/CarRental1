import { useQuery } from "@tanstack/react-query";
import { getRentCarByIdApi, getSaleCarByIdApi } from "../api/get-car-by-id.api";

export function useGetRentCarById(id: string) {
  return useQuery({
    queryKey: ["cars", "rent", id],
    queryFn: () => getRentCarByIdApi(id),
    enabled: !!id,
  });
}

export function useGetSaleCarById(id: string) {
  return useQuery({
    queryKey: ["cars", "sale", id],
    queryFn: () => getSaleCarByIdApi(id),
    enabled: !!id,
  });
}
