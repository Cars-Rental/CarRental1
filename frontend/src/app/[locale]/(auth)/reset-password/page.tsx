import {
  AuthLayout,
  ResetPasswordForm,
  ResetPasswordVisualContent,
} from "@/features/auth/components";
export default function ResetPasswordPage() {
  
  return (
    <AuthLayout
      title="إعادة تعيين كلمة المرور"
      subtitle="قم بإدخال كلمة المرور الجديدة الخاصة بك."
      visualSide="right"
      visualContent={<ResetPasswordVisualContent />}
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
