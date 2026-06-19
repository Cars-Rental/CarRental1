import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="إعادة تعيين كلمة المرور"
      subtitle="قم بإدخال كلمة المرور الجديدة الخاصة بك."
      visualTitle="أمانك وراحتك في كل رحلة"
      visualDescription="استأجر سيارتك بسهولة، أمان، وثقة في أي وقت."
      visualSide="right"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
