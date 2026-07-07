import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import type { ForgotPasswordRequest } from "../types";

export async function forgotPasswordApi(
  data: ForgotPasswordRequest
): Promise<null> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    data
  );

  return response.data.data;
}