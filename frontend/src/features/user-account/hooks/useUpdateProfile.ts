import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfileApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_ACCOUNT_QUERY_KEYS.profile,
      });
    },
  });
}
