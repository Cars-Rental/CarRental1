import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="إنشاء حساب جديد"
      subtitle="قم بإنشاء حسابك للبدء في رحلتك معنا"
      visualTitle="أكبر منصة لتأجير السيارات في مصر"
      visualDescription="منصة Rento تساعدك في تأجير السيارات بسهولة داخل مصر مع تجربة آمنة وسريعة."
      visualSide="right"
    >
      <RegisterForm />
    </AuthLayout>
  );
}