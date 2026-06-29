import { useQuery } from "@tanstack/react-query";
import { getUserFavoritesApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useUserFavorites(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: USER_ACCOUNT_QUERY_KEYS.favorites,
    queryFn: getUserFavoritesApi,
    enabled: options?.enabled,
  });
}
