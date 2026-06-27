import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { GetAllCarsRawResponse } from "../types/cars-api.types";

async function fetchAllPages(endpoint: string): Promise<GetAllCarsRawResponse> {
  const first = await axiosInstance.get<GetAllCarsRawResponse>(endpoint);
  const firstData = first.data;

  if (firstData.totalPages <= 1) return firstData;

  const rest = await Promise.all(
    Array.from({ length: firstData.totalPages - 1 }, (_, i) =>
      axiosInstance.get<GetAllCarsRawResponse>(endpoint, {
        params: { page: i + 2 },
      }),
    ),
  );

  return {
    ...firstData,
    data: [...firstData.data, ...rest.flatMap((r) => r.data.data)],
  };
}

export async function getSaleCarsApi(): Promise<GetAllCarsRawResponse> {
  return fetchAllPages(API_ENDPOINTS.CARS.SALE.GET_ALL_SALE);
}
