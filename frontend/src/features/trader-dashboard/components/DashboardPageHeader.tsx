interface DashboardPageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-foreground dark:text-slate-100">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  );
}
