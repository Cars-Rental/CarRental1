import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { registerApi } from "../api";
import { loginSuccess } from "../store";
import { tokenStorage } from "../utils";
import { useRouter } from "@/i18n/navigation";

export function useRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: registerApi,

    onSuccess: (data, variables) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      dispatch(loginSuccess(data.user));
      //   router.push(
      // `/verify-email?type=register&email=${encodeURIComponent(variables.email)}`
      // );
      toast.success("Account created successfully");
    },

    onError: () => {
      toast.error("Registration failed");
    },
  });
}