import { AuthLayout, ForgotPasswordForm, ForgotVisualContent } from "@/features/auth/components";
import { getTranslations } from "next-intl/server";

export default async function ForgotPasswordPage() {
    const t = await getTranslations("Auth.forgotPassword");

  return (
    <AuthLayout
      title={t("title")}
      subtitle={t("subtitle")}
      visualSide="right"
      visualContent={<ForgotVisualContent />}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
