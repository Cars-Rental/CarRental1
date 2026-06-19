import { AuthCard } from "./AuthCard";
import { AuthVisualPanel } from "./AuthVisualPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  visualTitle: string;
  visualDescription: string;
  visualSide?: "left" | "right";
}

export function AuthLayout({
  children,
  title,
  subtitle,
  visualTitle,
  visualDescription,
  visualSide = "left",
}: AuthLayoutProps) {
  const visual = (
    <AuthVisualPanel title={visualTitle} description={visualDescription} />
  );

  const card = (
    <AuthCard title={title} subtitle={subtitle}>
      {children}
    </AuthCard>
  );

  return (
    <main className="grid min-h-screen bg-[#F7FAF8] lg:grid-cols-2 dark:bg-zinc-950">
      {visualSide === "left" && visual}

      <section className="flex items-center justify-center px-6 py-15">
        {card}
      </section>

      {visualSide === "right" && visual}
    </main>
  );
}