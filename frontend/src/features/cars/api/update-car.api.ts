import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types";
import type { RawCar, UpdateCarRequest } from "../types/cars-api.types";

interface UpdateCarParams {
  id: string;
  data: UpdateCarRequest;
  imageFiles: File[];
}

function buildCarFormData(data: UpdateCarRequest, imageFiles: File[]) {
  const formData = new FormData();

  if (data.carbrand !== undefined) formData.append("carbrand", data.carbrand);
  if (data.carname !== undefined) formData.append("carname", data.carname);
  if (data.carmodel !== undefined) formData.append("carmodel", data.carmodel);
  if (data.year !== undefined) formData.append("year", String(data.year));
  if (data.location !== undefined) formData.append("location", data.location);
  if (data.distance !== undefined) formData.append("distance", data.distance);
  if (data.carprice !== undefined) formData.append("carprice", String(data.carprice));
  if (data.fuel !== undefined) formData.append("fuel", data.fuel);
  if (data.seatCount !== undefined) formData.append("seatCount", String(data.seatCount));
  if (data.Body_Type !== undefined) formData.append("Body_Type", data.Body_Type);
  if (data.Transmission !== undefined) formData.append("Transmission", data.Transmission);

  imageFiles.forEach((file) => {
    formData.append("image", file);
  });

  return formData;
}

export async function updateRentCarApi({
  id,
  data,
  imageFiles,
}: UpdateCarParams): Promise<RawCar> {
  const formData = buildCarFormData(data, imageFiles);
  const response = await axiosInstance.patch<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.RENT.UPDATE_RENT(id),
    formData,
  );
  return response.data.data;
}

export async function updateSaleCarApi({
  id,
  data,
  imageFiles,
}: UpdateCarParams): Promise<RawCar> {
  const formData = buildCarFormData(data, imageFiles);
  const response = await axiosInstance.patch<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.SALE.UPDATE_SALE(id),
    formData,
  );
  return response.data.data;
}
