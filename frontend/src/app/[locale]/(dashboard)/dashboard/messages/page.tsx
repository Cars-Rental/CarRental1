import { MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { TraderPlaceholderPage } from "@/features/trader-dashboard/components";

export default async function MessagesPage() {
  const t = await getTranslations("TraderDashboard");

  return (
    <TraderPlaceholderPage
      icon={MessageSquare}
      title={t("pages.messages.title")}
      description={t("pages.messages.description")}
      emptyTitle={t("empty.messages.title")}
      emptyDescription={t("empty.messages.description")}
    />
  );
}
