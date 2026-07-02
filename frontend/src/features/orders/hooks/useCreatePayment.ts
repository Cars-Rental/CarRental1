import { useMutation } from "@tanstack/react-query";
import { createPaymentApi } from "../api";
import type { CreatePaymentRequest } from "../types";

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payload: CreatePaymentRequest) => createPaymentApi(payload),
  });
}
