import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import type { AuthData, RegisterRequest } from "../types";

export async function registerApi(data: RegisterRequest): Promise<AuthData> {
  const response = await axiosInstance.post<ApiResponse<AuthData>>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );

  return response.data.data;
}