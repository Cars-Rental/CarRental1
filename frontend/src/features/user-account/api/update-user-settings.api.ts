import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { UpdateUserSettingsRequest, UserSettings } from "../types";

export async function updateUserSettingsApi(
  data: UpdateUserSettingsRequest
): Promise<UserSettings> {
  const response = await axiosInstance.patch<ApiResponse<UserSettings>>(
    "/user/settings",
    data
  );
  return response.data.data;
}
