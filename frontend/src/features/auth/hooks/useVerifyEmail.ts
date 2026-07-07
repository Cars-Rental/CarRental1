import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useRouter } from "@/i18n/navigation";
import { verifyEmailApi } from "../api";
import type { VerifyEmailSchema } from "../schemas";
import { ApiErrorResponse } from "@/types";

type UseVerifyEmailOptions = {
  onFieldErrors?: (field: keyof VerifyEmailSchema, message: string) => void;
};

export function useVerifyEmail(options?: UseVerifyEmailOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyEmailApi,

    onSuccess: (_, variables) => {
      toast.success("Email verified successfully");

      if (variables.type === "reset") {
        router.replace(
          `/reset-password?email=${encodeURIComponent(variables.email)}`
        );
        return;
      }

      router.replace("/login");
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      options?.onFieldErrors?.(
        "otp",
        error.response?.data?.message ?? "Invalid verification code"
      );
    },
  });
}