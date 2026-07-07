import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import type { ResendCodeRequest } from "../types";

export async function resendCodeApi(data: ResendCodeRequest): Promise<null> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.RESEND_CODE,
    data
  );

  return response.data.data;
}