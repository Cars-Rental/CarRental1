import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

export async function removeFavoriteApi(carId: string): Promise<void> {
  await axiosInstance.delete<ApiResponse<null>>(`/user/favorites/${carId}`);
}
