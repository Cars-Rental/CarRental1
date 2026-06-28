import { useQuery } from "@tanstack/react-query";
import { getOrderByIdApi } from "../api/get-order-by-id.api";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useGetOrderById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.DETAILS(id),
    queryFn: () => getOrderByIdApi(id),
    enabled: !!id,
  });
}
