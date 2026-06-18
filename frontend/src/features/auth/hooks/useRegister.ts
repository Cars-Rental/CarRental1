import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { registerApi } from "../api";
import { loginSuccess } from "../store";
import { tokenStorage } from "../utils";

export function useRegister() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: registerApi,

    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      dispatch(loginSuccess(data.user));
      toast.success("Account created successfully");
    },

    onError: () => {
      toast.error("Registration failed");
    },
  });
}