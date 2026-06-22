import { getTranslations } from "next-intl/server";

import {
  AuthLayout,
  RegisterForm,
  RegisterVisualContent,
} from "@/features/auth/components";

export default async function RegisterPage() {
  const t = await getTranslations("Auth.register");
  
  return (
    <AuthLayout
      title={t("title1")}
      subtitle={t("subtitle")}
      visualContent={<RegisterVisualContent />}
      visualSide="right"
    >
      <RegisterForm />
    </AuthLayout>
  );
}