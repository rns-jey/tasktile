"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "cn";
import { Check } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // box
        "peer border-input relative flex size-6 shrink-0 items-center justify-center rounded-sm border transition-colors outline-none",
        // dark
        "dark:bg-input/30",
        // bigger tap area
        "after:absolute after:-inset-3",
        // checked
        "data-checked:border-primary data-checked:bg-primary dark:data-checked:bg-primary data-checked:text-primary-foreground",
        // keyboard focus
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
        // error
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 aria-invalid:ring-3",
        // disabled
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        // inside a clickable label
        "group-has-focus-visible/field-label:not-data-checked:border-input group-has-focus-visible/field-label:data-checked:border-primary group-has-focus-visible/field-label:ring-0 group-has-disabled/field:opacity-50",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <Check />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
