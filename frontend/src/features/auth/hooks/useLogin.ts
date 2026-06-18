import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { loginApi } from "../api";
import { loginSuccess } from "../store";
import { tokenStorage } from "../utils";

export function useLogin() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      dispatch(loginSuccess(data.user));
      toast.success("Login successful");
    },

    onError: () => {
      toast.error("Invalid email or password");
    },
  });
}