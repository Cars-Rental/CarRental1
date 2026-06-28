import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useRouter } from "@/i18n/navigation";
import { useAppDispatch } from "@/store/hooks";
import { ROLES } from "@/constants";
import { ROUTES } from "@/config/routes";
import type { ApiErrorResponse, ApiFieldError } from "@/types";

import { loginApi, resendCodeApi } from "../api";
import { loginSuccess } from "../store";
import { tokenStorage } from "../utils";

interface UseLoginOptions {
  onFieldErrors?: (field: string, message: string) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      dispatch(loginSuccess(data.user));

      toast.success("Login successful");

      if (data.user.role === ROLES.TRADER) {
        router.replace(ROUTES.DASHBOARD.ROOT);
        return;
      } else if (data.user.role === ROLES.ADMIN) {
        router.replace(ROUTES.ADMIN.ROOT);
        return;
      }

      router.replace(ROUTES.HOME);
    },

    onError: async (error: AxiosError<ApiErrorResponse>, variables) => {
      const response = error.response?.data;
      const message = response?.message;
      const code = response?.code;
      const errors = response?.errors;

      if (
        code === "EMAIL_NOT_VERIFIED" ||
        message === "Please verify your email first"
      ) {
        try {
          await resendCodeApi({
            email: variables.email,
            type: "register",
          });

          toast.info("Verification code sent to your email");
        } catch {
          toast.error("Failed to resend verification code");
        }

        router.push(
          `/verify-email?type=register&email=${encodeURIComponent(
            variables.email
          )}`
        );

        return;
      }

      if (Array.isArray(errors) && errors.length > 0) {
        (errors as ApiFieldError[]).forEach(({ field, message }) => {
          options?.onFieldErrors?.(field, message);
        });

        return;
      }

      toast.error(message ?? "Login failed");
    },
  });
}