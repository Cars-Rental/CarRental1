import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { GetOrderResponse } from "../types";

export async function getOrderByIdApi(id: string): Promise<GetOrderResponse> {
  const response = await axiosInstance.get<GetOrderResponse>(
    API_ENDPOINTS.ORDERS.GET_BY_ID(id),
  );
  return response.data;
}
