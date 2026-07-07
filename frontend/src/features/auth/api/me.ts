import { API_ENDPOINTS } from "@/constants";
import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { AuthUser } from "../types";

interface AuthUserResponse extends Omit<AuthUser, "id"> {
  _id?: string;
  id?: string;
}

function normalizeAuthUser(user: AuthUserResponse): AuthUser {
  return {
    ...user,
    id: user.id ?? user._id ?? "",
  };
}

export async function getMeApi(): Promise<AuthUser> {
  const response = await axiosInstance.get<ApiResponse<{ user: AuthUserResponse }>>(
    API_ENDPOINTS.AUTH.ME
  );

  return normalizeAuthUser(response.data.data.user);
}
