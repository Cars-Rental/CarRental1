import { API_ENDPOINTS } from "@/constants/api";
import { axiosInstance } from "@/services";
import type { CreatePaymentRequest, CreatePaymentResponse } from "../types";

export async function createPaymentApi(
  payload: CreatePaymentRequest,
): Promise<CreatePaymentResponse> {
  const response = await axiosInstance.post<CreatePaymentResponse>(
    API_ENDPOINTS.ORDERS.PAYMENT,
    payload,
  );

  return response.data;
}
