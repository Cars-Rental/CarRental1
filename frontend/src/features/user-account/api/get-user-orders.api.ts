// import { axiosInstance } from "@/services";
// import type { ApiResponse } from "@/types";
// import type { UserOrder } from "../types";

// export async function getUserOrdersApi(): Promise<UserOrder[]> {
//   const response =
//     await axiosInstance.get<ApiResponse<UserOrder[]>>("/user/orders");
//   return response.data.data;
// }

import { axiosInstance } from "@/services";
import type { Order } from "@/features/orders/types";

export interface GetUserOrdersResponse {
  success: boolean;
  message: string;
  totalOrders: number;
  page: number;
  limit: number;
  data: Order[];
}

export async function getUserOrdersApi(): Promise<Order[]> {
  const response =
    await axiosInstance.get<GetUserOrdersResponse>("/orders/my-cars");
  return response.data.data;
}
