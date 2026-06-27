import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addRentCarApi, addSaleCarApi } from "../api/add-car.api";

export function useAddRentCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRentCarApi,
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
    mutationFn: addSaleCarApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars", "sale"] });
      toast.success("Car added for sale successfully");
    },
    onError: () => {
      toast.error("Failed to add car for sale");
    },
  });
}
