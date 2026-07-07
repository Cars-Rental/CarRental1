import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types";
import type { UpdateProfileRequest, UserProfile } from "../types";

interface UpdateProfileResponse {
  user?: UserProfile;
}

export async function updateProfileApi(
  data: UpdateProfileRequest
): Promise<UserProfile> {
  const response = await axiosInstance.patch<ApiResponse<UpdateProfileResponse>>(
    API_ENDPOINTS.AUTH.UPDATE_PROFILE,
    data
  );
  return response.data.data.user ?? (response.data.data as UserProfile);
}
