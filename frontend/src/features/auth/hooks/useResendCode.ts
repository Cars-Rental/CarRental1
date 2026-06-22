import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { resendCodeApi } from "../api";

export function useResendCode() {
  return useMutation({
    mutationFn: resendCodeApi,

    onSuccess: () => {
      toast.success("Verification code sent again");
    },

    onError: () => {
      toast.error("Failed to resend verification code");
    },
  });
}