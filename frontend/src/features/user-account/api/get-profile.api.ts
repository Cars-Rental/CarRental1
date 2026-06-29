import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants";
import type { ApiResponse } from "@/types";
import type { UserProfile, UserProfileDocument } from "../types";

function normalizeProfile(user: UserProfile): UserProfile {
  return {
    ...user,
    id: user.id ?? user._id ?? "",
    joinedAt: user.joinedAt ?? user.createdAt,
  };
}

export async function getProfileApi(): Promise<UserProfile> {
  const response =
    await axiosInstance.get<ApiResponse<{ user: UserProfile }>>(API_ENDPOINTS.AUTH.ME);
  return normalizeProfile(response.data.data.user);
}

export async function getProfileDocumentApi(): Promise<UserProfileDocument> {
  const response = await axiosInstance.get<
    {
      success: boolean;
      message: string;
    } & UserProfileDocument
  >(API_ENDPOINTS.AUTH.DOCUMENT);

  return {
    orders: response.data.orders,
    booking: response.data.booking,
    wishLIST: response.data.wishLIST,
  };
}
