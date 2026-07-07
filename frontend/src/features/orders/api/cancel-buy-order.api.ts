import { API_ENDPOINTS } from "@/constants/api";
import { axiosInstance } from "@/services";

import type { CancelOrderRequest, Order } from "../types";

interface CancelBuyOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export async function cancelBuyOrderApi({
  id,
  cancellationReason,
}: CancelOrderRequest): Promise<Order> {
  const response = await axiosInstance.patch<CancelBuyOrderResponse>(
    API_ENDPOINTS.ORDER_BUY.CANCEL(id),
    { cancellationReason }
  );

  return response.data.data;
}
