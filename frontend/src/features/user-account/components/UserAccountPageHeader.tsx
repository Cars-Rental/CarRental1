interface UserAccountPageHeaderProps {
  title: string;
  description: string;
}

export function UserAccountPageHeader({
  title,
  description,
}: UserAccountPageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-foreground dark:text-slate-100">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">{description}</p>
    </div>
  );
}
