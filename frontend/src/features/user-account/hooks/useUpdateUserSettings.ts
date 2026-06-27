import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserSettingsApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserSettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: USER_ACCOUNT_QUERY_KEYS.settings,
      });
    },
  });
}
