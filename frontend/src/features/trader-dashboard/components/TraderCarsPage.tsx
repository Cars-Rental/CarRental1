"use client";

import { Car, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useTraderCars } from "../hooks";
import type { TraderCar, TraderCarType } from "../types";
import { formatDashboardCurrency } from "../utils";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { DashboardTable } from "./DashboardTable";

interface TraderCarsPageProps {
  type: TraderCarType;
}

export function TraderCarsPage({ type }: TraderCarsPageProps) {
  const locale = useLocale();
  const t = useTranslations("TraderDashboard");
  const { data, isLoading } = useTraderCars(type);
  const cars = data?.data ?? [];
  const pageKey = type === "rent" ? "rentalCars" : "saleCars";

  return (
    <div>
      <DashboardPageHeader
        title={t(`pages.${pageKey}.title`)}
        description={t(`pages.${pageKey}.description`)}
        action={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            {t("actions.addCar")}
          </Button>
        }
      />

      {cars.length === 0 && !isLoading ? (
        <DashboardEmptyState
          icon={Car}
          title={t("empty.cars.title")}
          description={t("empty.cars.description")}
        />
      ) : (
        <DashboardTable<TraderCar>
          data={cars}
          getRowKey={(car) => car.id}
          isLoading={isLoading}
          columns={[
            {
              key: "title",
              header: t("tables.car"),
              cell: (car) => (
                <div>
                  <div className="font-medium text-foreground">{car.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {car.brand} {car.model} - {car.year}
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
                  transmission: car.transmission,
                  fuelType: car.fuelType,
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
          ]}
        />
      )}
    </div>
  );
}
