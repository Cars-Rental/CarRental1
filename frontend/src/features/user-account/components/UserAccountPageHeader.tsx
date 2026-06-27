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
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
