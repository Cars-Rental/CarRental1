import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types";

export async function deleteRentCarApi(id: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(
    API_ENDPOINTS.CARS.RENT.DELETE_RENT(id),
  );
}

export async function deleteSaleCarApi(id: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(
    API_ENDPOINTS.CARS.SALE.DELETE_SALE(id),
  );
}
