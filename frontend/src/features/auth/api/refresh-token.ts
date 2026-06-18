import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";

export async function refreshToken() {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.REFRESH
  );

  return response.data;
}