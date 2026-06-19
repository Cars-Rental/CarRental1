import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="نسيت كلمة المرور؟"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور."
      visualTitle="Rento Egypt"
      visualDescription="استأجر سيارتك بسهولة، أمان، وثقة في أي وقت."
      visualSide="right"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
