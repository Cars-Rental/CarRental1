import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { GetAllCarsRawResponse } from "../types/cars-api.types";

async function fetchAllPages(endpoint: string): Promise<GetAllCarsRawResponse> {
  const first = await axiosInstance.get<GetAllCarsRawResponse>(endpoint);
  const firstData = first.data;

  if (firstData.totalPages <= 1) return firstData;

  const remainingPages = Array.from(
    { length: firstData.totalPages - 1 },
    (_, i) => i + 2,
  );

  const rest = await Promise.all(
    remainingPages.map((page) =>
      axiosInstance.get<GetAllCarsRawResponse>(endpoint, {
        params: { page },
      }),
    ),
  );

  return {
    ...firstData,
    data: [...firstData.data, ...rest.flatMap((r) => r.data.data)],
    totalCars: firstData.totalCars,
  };
}

export async function getAllRentCarsApi(): Promise<GetAllCarsRawResponse> {
  return fetchAllPages(API_ENDPOINTS.CARS.RENT.GET_ALL_RENT);
}

export async function getAllSaleCarsApi(): Promise<GetAllCarsRawResponse> {
  return fetchAllPages(API_ENDPOINTS.CARS.SALE.GET_ALL_SALE);
}
