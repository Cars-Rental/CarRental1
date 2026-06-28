import { axiosInstance } from "@/services";
import type { Order } from "@/features/orders/types/order.types";
import { API_ENDPOINTS } from "@/constants/api";

export interface GetUserBuyOrdersResponse {
  success: boolean;
  message: string;
  totalOrders: number;
  page: number;
  limit: number;
  data: Order[];
}

export async function getUserBuyOrdersApi(): Promise<Order[]> {
  const response = await axiosInstance.get<GetUserBuyOrdersResponse>(
    API_ENDPOINTS.ORDER_BUY.MY_ORDERS,
  );
  return response.data.data;
}
