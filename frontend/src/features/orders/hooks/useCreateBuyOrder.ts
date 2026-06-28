import { useMutation } from "@tanstack/react-query";
import { createBuyOrderApi } from "../api/create-buy-order.api";
import type { CreateBuyOrderRequest } from "../types/order.types";

interface UseCreateBuyOrderOptions {
  onSuccess?: (orderId: string) => void;
  onError?: (message: string) => void;
}

export function useCreateBuyOrder({
  onSuccess,
  onError,
}: UseCreateBuyOrderOptions = {}) {
  return useMutation({
    mutationFn: (payload: CreateBuyOrderRequest) => createBuyOrderApi(payload),
    onSuccess: (response) => {
      if (response.success) {
        onSuccess?.(response.data._id);
      } else {
        onError?.(response.message);
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to create order";
      onError?.(message);
    },
  });
}
