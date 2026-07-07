import { API_ENDPOINTS } from "@/constants/api";
import { axiosInstance } from "@/services";

import type { Order, UpdateOrderStatusRequest } from "../types";

interface UpdateBuyOrderStatusResponse {
  success: boolean;
  message: string;
  data: Order;
}

export async function updateBuyOrderStatusApi({
  id,
  status,
  rejectionReason,
}: UpdateOrderStatusRequest): Promise<Order> {
  const response = await axiosInstance.patch<UpdateBuyOrderStatusResponse>(
    API_ENDPOINTS.ORDER_BUY.UPDATE_STATUS(id),
    { status, rejectionReason }
  );

  return response.data.data;
}
