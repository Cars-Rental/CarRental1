import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRentCarApi, updateSaleCarApi } from "../api/update-car.api";
import type { UpdateCarRequest } from "../types/cars-api.types";

interface UpdateCarPayload {
  id: string;
  data: UpdateCarRequest;
  imageFiles: File[];
}

export function useUpdateRentCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFiles }: UpdateCarPayload) =>
      updateRentCarApi({ id, data, imageFiles }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cars", "rent"] });
      queryClient.invalidateQueries({
        queryKey: ["cars", "rent", variables.id],
      });
      toast.success("Car updated successfully");
    },
    onError: () => {
      toast.error("Failed to update car");
    },
  });
}

export function useUpdateSaleCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFiles }: UpdateCarPayload) =>
      updateSaleCarApi({ id, data, imageFiles }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cars", "sale"] });
      queryClient.invalidateQueries({
        queryKey: ["cars", "sale", variables.id],
      });
      toast.success("Car updated successfully");
    },
    onError: () => {
      toast.error("Failed to update car");
    },
  });
}
