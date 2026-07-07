import { AuthCard } from "./AuthCard";
import { AuthVisualPanel } from "./AuthVisualPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  visualContent?: React.ReactNode;
  visualSide?: "left" | "right";
}

export function AuthLayout({
  children,
  title,
  subtitle,
  visualContent,
  visualSide = "left",
}: AuthLayoutProps) {
  const visual = <AuthVisualPanel>{visualContent}</AuthVisualPanel>;

  const card = (
    <AuthCard title={title} subtitle={subtitle}>
      {children}
    </AuthCard>
  );

  return (
    <main className="grid min-h-screen bg-[#F7FAF8] text-slate-950 dark:bg-slate-950 dark:text-slate-100 lg:grid-cols-2">
      {visualSide === "left" && visual}

      <section className="flex items-center justify-center px-6 py-15">
        {card}
      </section>

      {visualSide === "right" && visual}
    </main>
  );
}
