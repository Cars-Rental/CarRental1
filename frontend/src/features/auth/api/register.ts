import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { RegisterRequest, AuthResponse } from "../types";

export async function register(data: RegisterRequest) {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );

  return response.data;
}