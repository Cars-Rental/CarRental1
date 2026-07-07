import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { getDashboardStats } from "../api";

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.TRADER.DASHBOARD_STATS,
    queryFn: getDashboardStats,
  });
}
