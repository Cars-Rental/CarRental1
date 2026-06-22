export function AuthVisualPanel({ children }: { children: React.ReactNode }) {

  return (
    <section className="relative hidden overflow-hidden bg-[#005C55] lg:flex">
      {children}
    </section>
  );
}
