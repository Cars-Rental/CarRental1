import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { VerifyEmailForm } from "@/features/auth/components/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="تأكيد البريد الإلكتروني"
      subtitle="لقد أرسلنا رمز التأكيد إلى بريدك الإلكتروني"
      visualTitle="أمانك ينتهي باستقبال تأجير السيارات في مصر"
      visualDescription="استأجر سيارتك بسهولة، أمان، وثقة في أي وقت."
      visualSide="right"
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
