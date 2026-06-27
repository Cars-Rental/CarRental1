import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { UpdateProfileRequest, UserProfile } from "../types";

export async function updateProfileApi(
  data: UpdateProfileRequest
): Promise<UserProfile> {
  const response = await axiosInstance.patch<ApiResponse<UserProfile>>(
    "/user/profile",
    data
  );
  return response.data.data;
}
