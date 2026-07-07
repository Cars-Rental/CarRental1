import { CarDetailsPage } from "@/features/cars/components/CarDetailsPage";

interface CarDetailsPageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function CarDetailsRoute({
  params,
  searchParams,
}: CarDetailsPageProps) {
  const { id } = await params;
  const { mode } = await searchParams;
  const carMode = mode === "sale" ? "sale" : "rent";

  return <CarDetailsPage id={id} mode={carMode} />;
}
