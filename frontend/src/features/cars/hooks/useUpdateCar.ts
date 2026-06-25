import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRentCarApi, updateSaleCarApi } from "../api/update-car.api";

export function useUpdateRentCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRentCarApi,
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
    mutationFn: updateSaleCarApi,
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
