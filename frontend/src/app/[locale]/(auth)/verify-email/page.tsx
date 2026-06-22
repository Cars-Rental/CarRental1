import { getTranslations } from "next-intl/server";

import {
  VerifyEmailVisualContent,
  AuthLayout,
  VerifyEmailForm,
} from "@/features/auth/components";

export default async function VerifyEmailPage() {
    const t = await getTranslations("Auth.verifyEmail");

  return (
    <AuthLayout
      title={t("title1")}
      subtitle={t("subtitle")}
      visualSide="right"
      visualContent={<VerifyEmailVisualContent />}
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
