import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export async function removeFavoriteApi(carId: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(
    API_ENDPOINTS.FAVORITES_DELETE(carId)
  );
}
