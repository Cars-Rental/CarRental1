import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import type { VerifyEmailRequest } from "../types";

export async function verifyEmailApi(data: VerifyEmailRequest): Promise<null> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    API_ENDPOINTS.AUTH.VERIFY_EMAIL,
    data
  );

  return response.data.data;
}