import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { forgotPasswordApi } from "../api";
import { useRouter } from "@/i18n/navigation";

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPasswordApi,

    onSuccess: (_, variables) => {
      toast.success("Password reset link sent successfully");
      router.push({
        pathname: "/verify-email",
        query: {
          type: "reset",
          email: variables.email,
        },
      });
    },

    onError: () => {
      toast.error("Failed to send password reset link");
    },
  });
}