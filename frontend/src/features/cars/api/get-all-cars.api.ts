import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { GetAllCarsRawResponse } from "../types/cars-api.types";

export async function getAllRentCarsApi(): Promise<GetAllCarsRawResponse> {
  const response = await axiosInstance.get<GetAllCarsRawResponse>(
    API_ENDPOINTS.CARS.RENT.GET_ALL_RENT,
  );
  return response.data;
}

export async function getAllSaleCarsApi(): Promise<GetAllCarsRawResponse> {
  const response = await axiosInstance.get<GetAllCarsRawResponse>(
    API_ENDPOINTS.CARS.SALE.GET_ALL_SALE,
  );
  return response.data;
}
