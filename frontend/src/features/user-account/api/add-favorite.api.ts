import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { AddFavoriteRequest } from "../types";

export async function addFavoriteApi(
  data: AddFavoriteRequest
): Promise<void> {
  await axiosInstance.post<ApiResponse<null>>(API_ENDPOINTS.FAVORITES_ADD, data);
}
