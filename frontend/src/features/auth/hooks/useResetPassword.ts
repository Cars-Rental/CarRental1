import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { resetPasswordApi } from "../api";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Password reset successfully");
      router.replace("/login");
    },
    onError: () => {
      toast.error("Failed to reset password");
    },
  });
}