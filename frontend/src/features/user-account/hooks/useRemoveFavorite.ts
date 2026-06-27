import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFavoriteApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFavoriteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_ACCOUNT_QUERY_KEYS.favorites,
      });
    },
  });
}
