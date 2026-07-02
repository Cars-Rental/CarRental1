import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { getMeApi } from "@/features/auth/api";
import { loginSuccess } from "@/features/auth/store";
import { updateProfileApi } from "../api";
import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: async () => {
      const user = await getMeApi();
      dispatch(loginSuccess(user));
      queryClient.invalidateQueries({
        queryKey: USER_ACCOUNT_QUERY_KEYS.profile,
      });
    },
  });
}
