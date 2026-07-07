import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types";
import type { RawCar } from "../types/cars-api.types";

export async function getRentCarByIdApi(id: string): Promise<RawCar> {
  const response = await axiosInstance.get<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.RENT.GET_RENT_BY_ID(id),
  );
  return response.data.data;
}

export async function getSaleCarByIdApi(id: string): Promise<RawCar> {
  const response = await axiosInstance.get<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.SALE.GET_SALE_BY_ID(id),
  );
  return response.data.data;
}
