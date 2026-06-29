"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Car, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useAddRentCar,
  useAddSaleCar,
  useDeleteRentCar,
  useDeleteSaleCar,
  useUpdateRentCar,
  useUpdateSaleCar,
} from "@/features/cars/hooks";
import {
  EGYPT_LOCATIONS,
  type AddCarRequest,
  type FuelType,
  type RawCar,
  type Transmission,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TraderCar["status"]>(
    "all"
  );
  const [locationFilter, setLocationFilter] = useState<
    "all" | AddCarRequest["location"]
  >("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredCars = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minimumPrice = Number(minPrice);
    const maximumPrice = Number(maxPrice);

    return visibleCars.filter((car) => {
      const carPrice = car.salePrice ?? car.price;
      const matchesSearch =
        query.length === 0 ||
        [car.title, car.brand, car.model, car.location]
          .join(" ")
          .toLowerCase()
          .includes(query);
      const matchesStatus =
        statusFilter === "all" || car.status === statusFilter;
      const matchesLocation =
        locationFilter === "all" || car.location === locationFilter;
      const matchesMinPrice =
        minPrice.trim().length === 0 ||
        (Number.isFinite(minimumPrice) && carPrice >= minimumPrice);
      const matchesMaxPrice =
        maxPrice.trim().length === 0 ||
        (Number.isFinite(maximumPrice) && carPrice <= maximumPrice);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [locationFilter, maxPrice, minPrice, searchQuery, statusFilter, visibleCars]);

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCars = filteredCars.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  function updateSearchQuery(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function updateStatusFilter(value: "all" | TraderCar["status"]) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function updateLocationFilter(value: "all" | AddCarRequest["location"]) {
    setLocationFilter(value);
    setCurrentPage(1);
  }

  function updateMinPrice(value: string) {
    setMinPrice(value);
    setCurrentPage(1);
  }

  function updateMaxPrice(value: string) {
    setMaxPrice(value);
    setCurrentPage(1);
  }

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

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-[1fr_180px_180px_150px_150px]">
          <Input
            value={searchQuery}
            onChange={(event) => updateSearchQuery(event.target.value)}
            placeholder={t("filters.searchCars")}
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              updateStatusFilter(event.target.value as "all" | TraderCar["status"])
            }
            className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="active">{t("status.active")}</option>
            <option value="inactive">{t("status.inactive")}</option>
            <option value="maintenance">{t("status.maintenance")}</option>
            <option value="sold">{t("status.sold")}</option>
          </select>
          <select
            value={locationFilter}
            onChange={(event) =>
              updateLocationFilter(
                event.target.value as "all" | AddCarRequest["location"]
              )
            }
            className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <option value="all">{t("filters.allLocations")}</option>
            {EGYPT_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <Input
            type="number"
            min={0}
            value={minPrice}
            onChange={(event) => updateMinPrice(event.target.value)}
            placeholder={t("filters.minPrice")}
          />
          <Input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(event) => updateMaxPrice(event.target.value)}
            placeholder={t("filters.maxPrice")}
          />
        </CardContent>
      </Card>

      {filteredCars.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={Car}
          title={t("empty.cars.title")}
          description={t("empty.cars.description")}
        />
      ) : (
        <>
          <DashboardTable<TraderCar>
            data={paginatedCars}
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
                car.fuelType
                  ? t("tables.specsValue", {
                      transmission: formatTransmissionLabel(car.transmission, t),
                      fuelType: formatFuelLabel(car.fuelType, t),
                      seats: car.seats,
                    })
                  : t("tables.specsValueShort", {
                      transmission: formatTransmissionLabel(car.transmission, t),
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
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {t("pagination.summary", {
                current: filteredCars.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1,
                end: Math.min(safeCurrentPage * pageSize, filteredCars.length),
                total: filteredCars.length,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                {t("pagination.previous")}
              </Button>
              <span className="min-w-20 text-center">
                {t("pagination.page", { page: safeCurrentPage, totalPages })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                {t("pagination.next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
