import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { cancelOrderApi } from "@/features/orders/api";

import { USER_ACCOUNT_QUERY_KEYS } from "../utils";

export function useCancelUserOrder() {
  const t = useTranslations("UserAccount");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrderApi,
    onSuccess: () => {
      toast.success(t("orders.cancelSuccess"));
      queryClient.invalidateQueries({ queryKey: USER_ACCOUNT_QUERY_KEYS.orders });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("orders.cancelError"));
    },
  });
}
