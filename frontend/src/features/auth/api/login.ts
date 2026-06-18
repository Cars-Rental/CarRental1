import { API_ENDPOINTS } from "@/constants/api";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";

import { AuthData, LoginRequest } from "../types";

export async function loginApi(data: LoginRequest): Promise<AuthData> {
    const response = await axiosInstance.post<ApiResponse<AuthData>>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
    );

    return response.data.data;
}