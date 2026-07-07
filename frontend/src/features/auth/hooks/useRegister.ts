import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { useRouter } from "@/i18n/navigation";
import type { ApiErrorResponse, ApiFieldError } from "@/types";

import { registerApi } from "../api";

interface UseRegisterOptions {
  onFieldErrors?: (field: string, message: string) => void;
}

export function useRegister(options?: UseRegisterOptions) {
  const router = useRouter();

  return useMutation({
    mutationFn: registerApi,

    onSuccess: (data, variables) => {
      router.push(
        `/verify-email?type=register&email=${encodeURIComponent(variables.email)}`
      );

      toast.success("Account created successfully");
    },

    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errors = error.response?.data?.errors;

      if (Array.isArray(errors) && errors.length > 0) {
        (errors as ApiFieldError[]).forEach(({ field, message }) => {
          options?.onFieldErrors?.(field, message);
        });
      } else {
        toast.error(error.response?.data?.message ?? "Registration failed");
      }
    },
  });
}