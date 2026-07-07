import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { ResetPasswordRequest } from "../types";

export async function resetPasswordApi(
  data: ResetPasswordRequest
): Promise<null> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    data
  );

  return response.data.data;
}