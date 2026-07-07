import { axiosInstance } from "@/services";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types";
import type { RawCar, AddCarRequest } from "../types/cars-api.types";

function buildCarFormData(data: AddCarRequest, imageFiles: File[]) {
  const formData = new FormData();

  formData.append("carbrand", data.carbrand);
  formData.append("carname", data.carname);
  formData.append("carmodel", data.carmodel);
  formData.append("year", String(data.year));
  formData.append("location", data.location);
  formData.append("distance", data.distance);
  formData.append("carprice", String(data.carprice));
  formData.append("fuel", data.fuel);
  formData.append("seatCount", String(data.seatCount));
  formData.append("Body_Type", data.Body_Type);
  formData.append("Transmission", data.Transmission);

  imageFiles.forEach((file) => {
    formData.append("image", file);
  });

  return formData;
}

export async function addRentCarApi(
  data: AddCarRequest,
  imageFiles: File[],
): Promise<RawCar> {
  const formData = buildCarFormData(data, imageFiles);
  const response = await axiosInstance.post<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.RENT.ADD_RENT,
    formData,
  );
  return response.data.data;
}

export async function addSaleCarApi(
  data: AddCarRequest,
  imageFiles: File[],
): Promise<RawCar> {
  const formData = buildCarFormData(data, imageFiles);
  const response = await axiosInstance.post<ApiResponse<RawCar>>(
    API_ENDPOINTS.CARS.SALE.ADD_SALE,
    formData,
  );
  return response.data.data;
}
