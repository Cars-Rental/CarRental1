import { getTranslations } from "next-intl/server";

import {
  AuthLayout,
  ResetPasswordForm,
  ResetPasswordVisualContent,
} from "@/features/auth/components";

export default async function ResetPasswordPage() {
    const t = await getTranslations("Auth.resetPassword");

  return (
    <AuthLayout
      title={t("title1")}
      subtitle= {t("subtitle1")}
      visualSide="right"
      visualContent={<ResetPasswordVisualContent />}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
