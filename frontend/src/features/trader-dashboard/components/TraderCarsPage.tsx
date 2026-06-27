"use client";

import Image from "next/image";
import { useState } from "react";
import { Car, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  useAddRentCar,
  useAddSaleCar,
  useDeleteRentCar,
  useDeleteSaleCar,
  useUpdateRentCar,
  useUpdateSaleCar,
} from "@/features/cars/hooks";
import type {
  AddCarRequest,
  FuelType,
  RawCar,
  Transmission,
} from "@/features/cars/types/cars-api.types";
import { useTraderCars } from "../hooks";
import type { TraderCar, TraderCarType } from "../types";
import { formatDashboardCurrency } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { DashboardTable } from "./DashboardTable";
import { TraderCarDialog } from "./TraderCarDialog";

interface TraderCarsPageProps {
  type: TraderCarType;
}

function formatTransmissionLabel(
  transmission: string,
  t: ReturnType<typeof useTranslations<"TraderDashboard">>
) {
  const labels: Record<Transmission, string> = {
    automatic: t("carForm.transmissionOptions.automatic"),
    manual: t("carForm.transmissionOptions.manual"),
  };

  return transmission in labels
    ? labels[transmission as Transmission]
    : transmission;
}

function formatFuelLabel(
  fuelType: string,
  t: ReturnType<typeof useTranslations<"TraderDashboard">>
) {
  const labels: Record<FuelType, string> = {
    petrol: t("carForm.fuelOptions.petrol"),
    diesel: t("carForm.fuelOptions.diesel"),
    electric: t("carForm.fuelOptions.electric"),
    hybrid: t("carForm.fuelOptions.hybrid"),
  };

  return fuelType in labels ? labels[fuelType as FuelType] : fuelType;
}

export function TraderCarsPage({ type }: TraderCarsPageProps) {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data, isLoading } = useTraderCars(type);
  const cars = data?.data ?? [];
  const pageKey = type === "rent" ? "rentalCars" : "saleCars";
  const [localCars, setLocalCars] = useState<TraderCar[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<TraderCar | null>(null);
  const addRentCar = useAddRentCar();
  const addSaleCar = useAddSaleCar();
  const updateRentCar = useUpdateRentCar();
  const updateSaleCar = useUpdateSaleCar();
  const deleteRentCar = useDeleteRentCar();
  const deleteSaleCar = useDeleteSaleCar();
  const visibleCars = localCars ?? cars;
  const isRentPage = type === "rent";
  const isSalePage = type === "sale";

  function mapFormToTraderCar(
    data: AddCarRequest,
    currentCar?: TraderCar,
    savedCar?: RawCar
  ): TraderCar {
    return {
      id: savedCar?._id ?? currentCar?.id ?? `${type}-${Date.now()}`,
      title: data.carname,
      brand: data.carbrand,
      model: data.carmodel,
      year: data.year,
      image:
        savedCar?.carimage[0]?.secure_url ?? data.images[0] ?? currentCar?.image ?? "",
      images: savedCar?.carimage.map((image) => image.secure_url) ?? data.images,
      location: data.location,
      type,
      price: data.carprice,
      salePrice: type === "sale" ? data.carprice : undefined,
      transmission: data.Transmission,
      fuelType: data.fuel,
      bodyType: data.Body_Type,
      seats: data.seatCount,
      status: currentCar?.status ?? "active",
      rating: currentCar?.rating,
      bookingsCount: currentCar?.bookingsCount ?? 0,
      mileage: Number(data.distance) || currentCar?.mileage,
      condition: currentCar?.condition,
      isNegotiable: currentCar?.isNegotiable,
    };
  }

  function openAddDialog() {
    setEditingCar(null);
    setIsDialogOpen(true);
  }

  function openEditDialog(car: TraderCar) {
    setEditingCar(car);
    setIsDialogOpen(true);
  }

  async function handleSubmitCar(formData: AddCarRequest) {
    if (editingCar) {
      if (isRentPage) {
        await updateRentCar.mutateAsync({
          id: editingCar.id,
          data: formData,
        });
      }
      if (isSalePage) {
        await updateSaleCar.mutateAsync({
          id: editingCar.id,
          data: formData,
        });
      }

      setLocalCars((currentCars) =>
        (currentCars ?? cars).map((car) =>
          car.id === editingCar.id ? mapFormToTraderCar(formData, editingCar) : car
        )
      );
      return;
    }

    const savedCar = isRentPage
      ? await addRentCar.mutateAsync(formData)
      : isSalePage
        ? await addSaleCar.mutateAsync(formData)
        : undefined;

    setLocalCars((currentCars) => [
      mapFormToTraderCar(formData, undefined, savedCar),
      ...(currentCars ?? cars),
    ]);
  }

  async function handleDeleteCar(id: string) {
    if (isRentPage) {
      await deleteRentCar.mutateAsync(id);
    }
    if (isSalePage) {
      await deleteSaleCar.mutateAsync(id);
    }

    setLocalCars((currentCars) =>
      (currentCars ?? cars).filter((car) => car.id !== id)
    );
  }

  return (
    <div>
      <DashboardPageHeader
        title={t(`pages.${pageKey}.title`)}
        description={t(`pages.${pageKey}.description`)}
        action={
          <Button className="gap-2" size="lg" onClick={openAddDialog}>
            <Plus className="h-4 w-4" />
            {t("actions.addCar")}
          </Button>
        }
      />

      <TraderCarDialog
        car={editingCar}
        open={isDialogOpen}
        type={type}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitCar}
      />

      {visibleCars.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={Car}
          title={t("empty.cars.title")}
          description={t("empty.cars.description")}
        />
      ) : (
        <DashboardTable<TraderCar>
          data={visibleCars}
          getRowKey={(car) => car.id}
          isLoading={isLoading}
          columns={[
            {
              key: "title",
              header: t("tables.car"),
              cell: (car) => (
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {car.image ? (
                      <Image
                        src={car.image}
                        alt={car.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Car className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{car.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {car.brand} {car.model} - {car.year}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "location",
              header: t("tables.location"),
              cell: (car) => car.location,
            },
            {
              key: "price",
              header: t(type === "rent" ? "tables.price" : "tables.salePrice"),
              cell: (car) =>
                formatDashboardCurrency(car.salePrice ?? car.price, locale),
            },
            {
              key: "specs",
              header: t("tables.specs"),
              cell: (car) =>
                t("tables.specsValue", {
                  transmission: formatTransmissionLabel(car.transmission, t),
                  fuelType: formatFuelLabel(car.fuelType, t),
                  seats: car.seats,
                }),
            },
            {
              key: "status",
              header: t("tables.status"),
              cell: (car) => (
                <DashboardStatusBadge
                  status={car.status}
                  label={t(`status.${car.status}`)}
                />
              ),
            },
            {
              key: "actions",
              header: t("tables.actions"),
              className: "px-4 py-3",
              cell: (car) => (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => openEditDialog(car)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t("actions.updateCar")}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDeleteCar(car.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t("actions.deleteCar")}</span>
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
