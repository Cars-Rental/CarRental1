import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  CreateBuyOrderRequest,
  CreateBuyOrderResponse,
} from "../types/order.types";

export async function createBuyOrderApi(
  payload: CreateBuyOrderRequest,
): Promise<CreateBuyOrderResponse> {
  const response = await axiosInstance.post<CreateBuyOrderResponse>(
    API_ENDPOINTS.ORDER_BUY.CREATE,
    payload,
  );
  return response.data;
}
