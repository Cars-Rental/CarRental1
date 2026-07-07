import { useQuery } from "@tanstack/react-query";
import { getUserBuyOrdersApi } from "../api/get-user-buy-orders.api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils/user-account-query-keys";

export function useUserBuyOrders() {
  return useQuery({
    queryKey: [...USER_ACCOUNT_QUERY_KEYS.orders, "buy"] as const,
    queryFn: getUserBuyOrdersApi,
  });
}
