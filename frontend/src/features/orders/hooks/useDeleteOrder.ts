import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrderApi } from "../api/delete-order.api";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrderApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.ALL });
    },
  });
}
