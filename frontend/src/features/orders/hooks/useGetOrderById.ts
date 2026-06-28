import { useQuery } from "@tanstack/react-query";
import { getOrderByIdApi } from "../api/get-order-by-id.api";
import type { OrderMode } from "../types/order.types";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useGetOrderById(id: string, mode: OrderMode = "rent") {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.DETAILS(id), mode] as const,
    queryFn: () => getOrderByIdApi(id, mode),
    enabled: !!id,
  });
}
