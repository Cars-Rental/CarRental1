import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import type { RefreshTokenData } from "../types";

export async function refreshTokenApi(): Promise<RefreshTokenData> {
  const response = await axiosInstance.post<ApiResponse<RefreshTokenData>>(
    API_ENDPOINTS.AUTH.REFRESH
  );

  return response.data.data;
}