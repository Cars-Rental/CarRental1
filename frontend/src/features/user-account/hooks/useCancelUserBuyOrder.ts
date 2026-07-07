import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { cancelBuyOrderApi } from "@/features/orders/api";

import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useCancelUserBuyOrder() {
  const t = useTranslations("UserAccount");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelBuyOrderApi,
    onSuccess: () => {
      toast.success(t("orders.cancelSuccess"));
      queryClient.invalidateQueries({
        queryKey: [...USER_ACCOUNT_QUERY_KEYS.orders, "buy"] as const,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("orders.cancelError"));
    },
  });
}
