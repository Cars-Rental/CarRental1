"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandCombobox } from "@/features/cars/components/BrandCombobox";
import {
  BODY_TYPES,
  EGYPT_LOCATIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
  type AddCarRequest,
  type BodyType,
  type FuelType,
  type Transmission,
} from "@/features/cars/types/cars-api.types";
import type { TraderCar, TraderCarType } from "../types";

interface TraderCarDialogProps {
  car?: TraderCar | null;
  open: boolean;
  type: TraderCarType;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddCarRequest, imageFiles: File[]) => Promise<void> | void;
}

interface ImagePreview {
  id: string;
  src: string;
  file?: File;
}

type TraderCarFormValues = AddCarRequest;

type TraderDashboardTranslator = ReturnType<
  typeof useTranslations<"TraderDashboard">
>;

const defaultValues: TraderCarFormValues = {
  carbrand: "",
  carname: "",
  carmodel: "",
  year: new Date().getFullYear(),
  location: "Cairo",
  distance: "0",
  carprice: 0,
  fuel: "petrol",
  seatCount: 5,
  Body_Type: "sedan",
  Transmission: "automatic",
  images: [],
};

function createTraderCarFormSchema(t: (key: string) => string) {
  return z.object({
    carbrand: z.string().min(1, t("validation.required")),
    carname: z.string().min(2, t("validation.required")),
    carmodel: z.string().min(1, t("validation.required")),
    year: z
      .number()
      .int()
      .min(1900, t("validation.invalidYear"))
      .max(new Date().getFullYear() + 1, t("validation.invalidYear")),
    location: z.enum(EGYPT_LOCATIONS),
    distance: z.string().min(1, t("validation.required")),
    carprice: z.number().positive(t("validation.positivePrice")),
    fuel: z.enum(FUEL_TYPES),
    seatCount: z.number().int().positive(t("validation.positiveSeats")),
    Body_Type: z.enum(BODY_TYPES),
    Transmission: z.enum(TRANSMISSIONS),
    images: z.array(z.string()).min(1, t("validation.imagesMin")),
  });
}

function isEgyptLocation(value: string): value is AddCarRequest["location"] {
  return EGYPT_LOCATIONS.some((location) => location === value);
}

function isFuelType(value: string): value is FuelType {
  return FUEL_TYPES.some((fuelType) => fuelType === value);
}

function isBodyType(value: string): value is BodyType {
  return BODY_TYPES.some((bodyType) => bodyType === value);
}

function isTransmission(value: string): value is Transmission {
  return TRANSMISSIONS.some((transmission) => transmission === value);
}

function carToFormValues(car?: TraderCar | null): TraderCarFormValues {
  if (!car) return defaultValues;

  return {
    carbrand: car.brand,
    carname: car.title,
    carmodel: car.model,
    year: car.year,
    location: isEgyptLocation(car.location) ? car.location : "Cairo",
    distance: String(car.mileage ?? 0),
    carprice: car.salePrice ?? car.price,
    fuel: isFuelType(car.fuelType) ? car.fuelType : "petrol",
    seatCount: car.seats,
    Body_Type:
      car.bodyType && isBodyType(car.bodyType) ? car.bodyType : "sedan",
    Transmission: isTransmission(car.transmission)
      ? car.transmission
      : "automatic",
    images: car.images ?? (car.image ? [car.image] : []),
  };
}

function getTransmissionLabel(
  option: Transmission,
  t: TraderDashboardTranslator,
) {
  return option === "automatic"
    ? t("carForm.transmissionOptions.automatic")
    : t("carForm.transmissionOptions.manual");
}

function getFuelLabel(option: FuelType, t: TraderDashboardTranslator) {
  const labels: Record<FuelType, string> = {
    petrol: t("carForm.fuelOptions.petrol"),
    diesel: t("carForm.fuelOptions.diesel"),
    electric: t("carForm.fuelOptions.electric"),
    hybrid: t("carForm.fuelOptions.hybrid"),
  };

  return labels[option];
}

function getBodyLabel(option: BodyType, t: TraderDashboardTranslator) {
  const labels: Record<BodyType, string> = {
    sedan: t("carForm.bodyOptions.sedan"),
    suv: t("carForm.bodyOptions.suv"),
    hatchback: t("carForm.bodyOptions.hatchback"),
    coupe: t("carForm.bodyOptions.coupe"),
    pickup: t("carForm.bodyOptions.pickup"),
    van: t("carForm.bodyOptions.van"),
    convertible: t("carForm.bodyOptions.convertible"),
  };

  return labels[option];
}

export function TraderCarDialog({
  car,
  open,
  type,
  onOpenChange,
  onSubmit,
}: TraderCarDialogProps) {
  const t = useTranslations("TraderDashboard");
  const initialValues = useMemo(() => carToFormValues(car), [car]);
  const schema = useMemo(() => createTraderCarFormSchema(t), [t]);
  const isEditMode = Boolean(car);

  const {
    handleSubmit,
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<TraderCarFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>(() =>
    initialValues.images.map((src) => ({
      id: src,
      src,
    })),
  );

  const imageFiles = useMemo(
    () =>
      imagePreviews
        .filter((image): image is ImagePreview & { file: File } =>
          Boolean(image.file),
        )
        .map((image) => image.file),
    [imagePreviews],
  );

  const selectedBrand = useWatch({ control, name: "carbrand" });
  const selectedBrands = selectedBrand ? [selectedBrand] : [];

  function handleBrandChange(brands: string[]) {
    const nextBrand = brands.at(-1) ?? "";
    setValue("carbrand", nextBrand, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleImagesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const nextPreviews = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      src: URL.createObjectURL(file),
      file,
    }));

    const nextImagePreviews = [...imagePreviews, ...nextPreviews];
    setImagePreviews(nextImagePreviews);
    setValue(
      "images",
      nextImagePreviews.map((image) => image.src),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
    event.target.value = "";
  }

  function removeImage(index: number) {
    const removed = imagePreviews[index];
    const nextPreviews = imagePreviews.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    if (removed?.file) {
      URL.revokeObjectURL(removed.src);
    }

    setImagePreviews(nextPreviews);
    setValue(
      "images",
      nextPreviews.map((image) => image.src),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }

  async function submitForm(data: TraderCarFormValues) {
    await onSubmit(
      {
        ...data,
        images: imagePreviews.map((image) => image.src),
      },
      imageFiles,
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-100">
            {isEditMode ? t("carForm.editTitle") : t("carForm.addTitle")}
          </DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            {type === "rent"
              ? t("carForm.rentDescription")
              : t("carForm.saleDescription")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div className="space-y-3">
            <Label htmlFor="images" className="dark:text-slate-200">{t("carForm.images")}</Label>
            <label
              htmlFor="images"
              className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-4 text-center transition hover:border-primary/50 hover:bg-muted/50 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-emerald-600 dark:hover:bg-slate-800/70"
            >
              <ImagePlus className="mb-2 h-6 w-6 text-muted-foreground dark:text-slate-400" />
              <span className="text-sm font-medium text-foreground dark:text-slate-100">
                {t("carForm.uploadImages")}
              </span>
              <span className="mt-1 text-xs text-muted-foreground dark:text-slate-400">
                {t("carForm.uploadImagesHint")}
              </span>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleImagesChange}
              />
            </label>
            {errors.images && (
              <p className="text-xs font-medium text-destructive">
                {errors.images.message}
              </p>
            )}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {imagePreviews.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted dark:border-slate-700 dark:bg-slate-800"
                  >
                    <Image
                      src={image.src}
                      alt={t("carForm.imagePreview")}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-xs"
                      className="absolute right-2 top-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">
                        {t("carForm.removeImage")}
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <BrandCombobox
                selectedBrands={selectedBrands}
                onChange={handleBrandChange}
              />
              {errors.carbrand && (
                <p className="text-xs font-medium text-destructive">
                  {errors.carbrand.message}
                </p>
              )}
            </div>

            <Field
              id="carname"
              label={t("carForm.name")}
              error={errors.carname?.message}
            >
              <Input id="carname" {...register("carname")} />
            </Field>

            <Field
              id="carmodel"
              label={t("carForm.model")}
              error={errors.carmodel?.message}
            >
              <Input id="carmodel" {...register("carmodel")} />
            </Field>

            <Field
              id="year"
              label={t("carForm.year")}
              error={errors.year?.message}
            >
              <Input
                id="year"
                type="number"
                {...register("year", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="location"
              label={t("carForm.location")}
              error={errors.location?.message}
            >
              <select
                id="location"
                className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                {...register("location")}
              >
                {EGYPT_LOCATIONS.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="carprice"
              label={
                type === "rent"
                  ? t("carForm.rentPrice")
                  : t("carForm.salePrice")
              }
              error={errors.carprice?.message}
            >
              <Input
                id="carprice"
                type="number"
                {...register("carprice", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="Transmission"
              label={t("carForm.transmission")}
              error={errors.Transmission?.message}
            >
              <OptionSelect
                id="Transmission"
                options={TRANSMISSIONS}
                getLabel={(option) => getTransmissionLabel(option, t)}
                register={register("Transmission")}
              />
            </Field>

            <Field
              id="fuel"
              label={t("carForm.fuel")}
              error={errors.fuel?.message}
            >
              <OptionSelect
                id="fuel"
                options={FUEL_TYPES}
                getLabel={(option) => getFuelLabel(option, t)}
                register={register("fuel")}
              />
            </Field>

            <Field
              id="Body_Type"
              label={t("carForm.bodyType")}
              error={errors.Body_Type?.message}
            >
              <OptionSelect
                id="Body_Type"
                options={BODY_TYPES}
                getLabel={(option) => getBodyLabel(option, t)}
                register={register("Body_Type")}
              />
            </Field>

            <Field
              id="seatCount"
              label={t("carForm.seats")}
              error={errors.seatCount?.message}
            >
              <Input
                id="seatCount"
                type="number"
                {...register("seatCount", { valueAsNumber: true })}
              />
            </Field>

            <Field
              id="distance"
              label={t("carForm.distance")}
              error={errors.distance?.message}
            >
              <Input id="distance" {...register("distance")} />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => onOpenChange(false)}
            >
              {t("actions.cancel")}
            </Button>
            <Button type="submit" size="lg">
              {isEditMode ? t("actions.updateCar") : t("actions.addCar")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FieldProps {
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
}

function Field({ children, error, id, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="dark:text-slate-200">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

interface OptionSelectProps<T extends string> {
  getLabel: (option: T) => string;
  id: string;
  options: readonly T[];
  register: UseFormRegisterReturn;
}

function OptionSelect<T extends string>({
  getLabel,
  id,
  options,
  register,
}: OptionSelectProps<T>) {
  return (
    <select
      id={id}
      className="h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
      {...register}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
