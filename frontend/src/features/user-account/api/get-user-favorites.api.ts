import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { UserFavoriteCar } from "../types";

export async function getUserFavoritesApi(): Promise<UserFavoriteCar[]> {
  const response =
    await axiosInstance.get<ApiResponse<UserFavoriteCar[]>>("/user/favorites");
  return response.data.data;
}
