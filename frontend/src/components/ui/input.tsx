import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function Input({
  className,
  type,
  startIcon,
  endIcon,
  ...props
}: InputProps) {
  return (
    <div className="relative w-full">
      {startIcon && (
        <div className="pointer-events-none absolute inset-s-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {startIcon}
        </div>
      )}

      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "h-12 w-full rounded-xl border border-input bg-transparent text-base transition-all outline-none",
          startIcon && "ps-11",
          endIcon && "pe-11",
          "px-4 py-2 placeholder:text-muted-foreground",
          "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          className
        )}
        {...props}
      />

      {endIcon && (
        <div className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {endIcon}
        </div>
      )}
    </div>
  );
}

export { Input };