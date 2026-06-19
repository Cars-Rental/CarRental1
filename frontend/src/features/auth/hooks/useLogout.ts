import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAppDispatch } from "@/store/hooks";
import { logoutApi } from "../api";
import { logout } from "../store";
import { tokenStorage } from "../utils";

export function useLogout() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: logoutApi,

    onSettled: () => {
      tokenStorage.clearTokens();
      dispatch(logout());
      toast.success("Logged out successfully");
    },
  });
}