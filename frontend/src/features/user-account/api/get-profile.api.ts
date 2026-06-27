import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { UserProfile } from "../types";

export async function getProfileApi(): Promise<UserProfile> {
  const response =
    await axiosInstance.get<ApiResponse<UserProfile>>("/user/profile");
  return response.data.data;
}
