import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { logoutApi } from "../api";
import { logout } from "../store";
import { tokenStorage } from "../utils";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: logoutApi,

    onSettled: () => {
      tokenStorage.clearTokens();
      dispatch(logout());
      toast.success("Logged out successfully");
      router.replace(ROUTES.HOME);
    },
  });
}