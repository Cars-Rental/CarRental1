import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { GetOrderResponse } from "../types/order.types";

export async function getBuyOrderByIdApi(
  id: string,
): Promise<GetOrderResponse> {
  const response = await axiosInstance.get<GetOrderResponse>(
    API_ENDPOINTS.ORDER_BUY.GET_BY_ID(id),
  );
  return response.data;
}
