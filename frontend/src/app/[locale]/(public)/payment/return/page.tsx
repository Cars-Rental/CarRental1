import { PaymentReturnPage } from "@/features/orders/components/PaymentReturnPage";

interface PaymentReturnRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PaymentReturnRoute({
  searchParams,
}: PaymentReturnRouteProps) {
  const params = await searchParams;

  return <PaymentReturnPage params={params} />;
}
