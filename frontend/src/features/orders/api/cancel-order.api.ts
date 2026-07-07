import { API_ENDPOINTS } from "@/constants/api";
import { axiosInstance } from "@/services";

import type { CancelOrderRequest, Order } from "../types";

interface CancelOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export async function cancelOrderApi({
  id,
  cancellationReason,
}: CancelOrderRequest): Promise<Order> {
  const response = await axiosInstance.patch<CancelOrderResponse>(
    API_ENDPOINTS.ORDERS.CANCEL(id),
    { cancellationReason }
  );

  return response.data.data;
}
