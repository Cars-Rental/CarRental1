import { axiosInstance } from "@/services";
import { AuthResponse, LoginRequest } from "../types";
import { API_ENDPOINTS } from "@/constants/api";

export async function login(data: LoginRequest){
    const response = await axiosInstance.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
    );

    return response.data;
}