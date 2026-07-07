import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addRentCarApi, addSaleCarApi } from "../api/add-car.api";
import type { AddCarRequest } from "../types/cars-api.types";

interface CreateCarPayload {
  data: AddCarRequest;
  imageFiles: File[];
}

export function useAddRentCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFiles }: CreateCarPayload) =>
      addRentCarApi(data, imageFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars", "rent"] });
      toast.success("Car added successfully");
    },
    onError: () => {
      toast.error("Failed to add car");
    },
  });
}

export function useAddSaleCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFiles }: CreateCarPayload) =>
      addSaleCarApi(data, imageFiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars", "sale"] });
      toast.success("Car added for sale successfully");
    },
    onError: () => {
      toast.error("Failed to add car for sale");
    },
  });
}
