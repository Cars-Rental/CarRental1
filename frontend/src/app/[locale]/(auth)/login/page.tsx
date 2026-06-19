import { AuthLayout, LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  return (
    <AuthLayout
      title="مرحبًا بك مجددًا"
      subtitle="سجل دخولك لإدارة حسابك وحجوزاتك"
      visualTitle="استأجر عربيتك بأمان وثقة"
      visualDescription="منصة Rento تساعدك في تأجير السيارات بسهولة داخل مصر مع تجربة آمنة وسريعة."
      visualSide="right"
    >
      <LoginForm />
    </AuthLayout>
  );
}