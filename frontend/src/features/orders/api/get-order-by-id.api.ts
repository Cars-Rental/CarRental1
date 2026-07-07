import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { GetOrderResponse, OrderMode } from "../types";

export async function getOrderByIdApi(
  id: string,
  mode: OrderMode = "rent",
): Promise<GetOrderResponse> {
  const endpoint =
    mode === "sale"
      ? API_ENDPOINTS.ORDER_BUY.GET_BY_ID(id)
      : API_ENDPOINTS.ORDERS.GET_BY_ID(id);

  const response = await axiosInstance.get<GetOrderResponse>(endpoint);
  return response.data;
}
