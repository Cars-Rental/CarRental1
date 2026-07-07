import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { CreateOrderRequest, CreateOrderResponse } from "../types";

export async function createOrderApi(
  payload: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const response = await axiosInstance.post<CreateOrderResponse>(
    API_ENDPOINTS.ORDERS.CREATE,
    payload,
  );
  return response.data;
}
