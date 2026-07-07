import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import { tokenStorage } from "../utils";

export async function logoutApi(): Promise<null> {
  const refreshToken = tokenStorage.getRefreshToken();

  const response = await axiosInstance.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.LOGOUT,
    { refreshToken }
  );

  return response.data.data;
}