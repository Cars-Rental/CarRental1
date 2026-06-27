import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types";
import type { RawCar, AddCarRequest } from "../types/cars-api.types";

export async function addRentCarApi(data: AddCarRequest): Promise<RawCar> {
  const response = await axiosInstance.post<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.RENT.ADD_RENT,
    data,
  );
  return response.data.data;
}

export async function addSaleCarApi(data: AddCarRequest): Promise<RawCar> {
  const response = await axiosInstance.post<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.SALE.ADD_SALE,
    data,
  );
  return response.data.data;
}
