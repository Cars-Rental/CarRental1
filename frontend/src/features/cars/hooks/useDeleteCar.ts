import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRentCarApi, deleteSaleCarApi } from "../api/delete-car.api";

export function useDeleteRentCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRentCarApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars", "rent"] });
      toast.success("Car deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete car");
    },
  });
}

export function useDeleteSaleCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSaleCarApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars", "sale"] });
      toast.success("Car deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete car");
    },
  });
}
