import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types";
import type { RawCar, UpdateCarRequest } from "../types/cars-api.types";

interface UpdateCarParams {
  id: string;
  data: UpdateCarRequest;
}

export async function updateRentCarApi({
  id,
  data,
}: UpdateCarParams): Promise<RawCar> {
  const response = await axiosInstance.patch<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.RENT.UPDATE_RENT(id),
    data,
  );
  return response.data.data;
}

export async function updateSaleCarApi({
  id,
  data,
}: UpdateCarParams): Promise<RawCar> {
  const response = await axiosInstance.patch<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.SALE.UPDATE_SALE(id),
    data,
  );
  return response.data.data;
}
