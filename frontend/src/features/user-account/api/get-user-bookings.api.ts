import { axiosInstance } from "@/services";
import type { ApiResponse } from "@/types";
import type { UserBooking } from "../types";

export async function getUserBookingsApi(): Promise<UserBooking[]> {
  const response =
    await axiosInstance.get<ApiResponse<UserBooking[]>>("/user/bookings");
  return response.data.data;
}
