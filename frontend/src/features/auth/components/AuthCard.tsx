interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#181C1C] dark:text-white">
          {title}
        </h1>

        <p className="mt-4 text-sm sm:text-base font-serif text-[#3E4947] dark:text-zinc-400">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}