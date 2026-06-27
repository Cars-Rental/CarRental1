import { PaymentPage } from "@/features/orders/components/PaymentPage";

interface PaymentPageProps {
  searchParams: Promise<{ orderId?: string; mode?: string }>;
}

export default async function PaymentRoute({ searchParams }: PaymentPageProps) {
  const { orderId, mode } = await searchParams;
  const carMode = mode === "sale" ? "sale" : "rent";

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Invalid payment session.
        </p>
      </div>
    );
  }

  return <PaymentPage orderId={orderId} mode={carMode} />;
}
