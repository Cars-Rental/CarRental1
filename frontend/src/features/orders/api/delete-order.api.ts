import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { DeleteOrderResponse } from "../types";

export async function deleteOrderApi(id: string): Promise<DeleteOrderResponse> {
  const response = await axiosInstance.delete<DeleteOrderResponse>(
    API_ENDPOINTS.ORDERS.DELETE(id),
  );
  return response.data;
}
