import { useQuery } from "@tanstack/react-query";
import { getUserBookingsApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useUserBookings() {
  return useQuery({
    queryKey: USER_ACCOUNT_QUERY_KEYS.bookings,
    queryFn: getUserBookingsApi,
  });
}
