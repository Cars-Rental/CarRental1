import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavoriteApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";
import { toast } from "sonner";

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addFavoriteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_ACCOUNT_QUERY_KEYS.favorites,
      });
      toast.success("Added to favorites");
    },
  });
}
