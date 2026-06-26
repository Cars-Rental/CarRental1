import { Skeleton } from "@/components/ui/skeleton";

export function NavbarActionsSkeleton() {
  return (
    <div className="inline-flex md:min-w-35 h-10 items-center gap-2 rounded-full px-2">
        <Skeleton className="size-9 rounded-full shrink-0" />
      <Skeleton className="hidden h-4 w-25 md:block" />
    </div>
  );
}
