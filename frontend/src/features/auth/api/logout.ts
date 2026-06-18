import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";

export async function logout() {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGOUT
  );

  return response.data;
}