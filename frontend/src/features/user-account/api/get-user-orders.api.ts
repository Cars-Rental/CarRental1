import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { UserOrder } from "../types";

export async function getUserOrdersApi(): Promise<UserOrder[]> {
  const response =
    await axiosInstance.get<ApiResponse<UserOrder[]>>("/user/orders");
  return response.data.data;
}
