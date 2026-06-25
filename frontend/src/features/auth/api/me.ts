import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { AuthUser } from "../types";

export async function getMeApi(): Promise<AuthUser> {
  const response = await axiosInstance.get<ApiResponse<{ user: AuthUser }>>(
    API_ENDPOINTS.AUTH.ME
  );

  return response.data.data.user;
}