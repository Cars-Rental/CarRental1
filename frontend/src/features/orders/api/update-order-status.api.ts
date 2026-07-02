import { API_ENDPOINTS } from "@/constants/api";
import { axiosInstance } from "@/services";

import type { Order, UpdateOrderStatusRequest } from "../types";

interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
  data: Order;
}

export async function updateOrderStatusApi({
  id,
  status,
  rejectionReason,
}: UpdateOrderStatusRequest): Promise<Order> {
  const response = await axiosInstance.patch<UpdateOrderStatusResponse>(
    API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
    { status, rejectionReason }
  );

  return response.data.data;
}
