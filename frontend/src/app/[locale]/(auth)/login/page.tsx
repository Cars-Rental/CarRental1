import {
  AuthLayout,
  LoginForm,
  LoginVisualContent,
} from "@/features/auth/components";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const t = await getTranslations("Auth.login");

  return (
    <AuthLayout
      title={t("title1")}
      subtitle={t("subtitle")}
      visualContent={<LoginVisualContent />}
      visualSide="right"
    >
      <LoginForm />
    </AuthLayout>
  );
}
