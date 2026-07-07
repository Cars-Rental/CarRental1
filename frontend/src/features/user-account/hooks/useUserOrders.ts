import { useQuery } from "@tanstack/react-query";
import { getUserOrdersApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useUserOrders() {
  return useQuery({
    queryKey: USER_ACCOUNT_QUERY_KEYS.orders,
    queryFn: getUserOrdersApi,
  });
}
