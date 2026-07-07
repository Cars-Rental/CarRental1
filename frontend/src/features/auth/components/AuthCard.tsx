interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:bg-slate-900/85 dark:shadow-slate-950/40 sm:p-8 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:dark:bg-transparent">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#181C1C] dark:text-slate-100">
          {title}
        </h1>

        <p className="mt-4 text-sm sm:text-base font-serif text-[#3E4947] dark:text-slate-300">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}
