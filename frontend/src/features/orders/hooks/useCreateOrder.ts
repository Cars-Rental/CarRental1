import { useMutation } from "@tanstack/react-query";
import { createOrderApi } from "../api/create-order.api";
import type { CreateOrderRequest } from "../types/order.types";

interface UseCreateOrderOptions {
  onSuccess?: (orderId: string) => void;
  onError?: (message: string) => void;
}

export function useCreateOrder({
  onSuccess,
  onError,
}: UseCreateOrderOptions = {}) {
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => createOrderApi(payload),
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
