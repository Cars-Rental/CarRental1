import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";

import { verifyEmailApi } from "../api";

export function useVerifyEmail() {
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

    onError: () => {
      toast.error("Invalid verification code");
    },
  });
}