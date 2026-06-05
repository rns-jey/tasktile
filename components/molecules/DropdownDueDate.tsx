import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

interface DropdownDueDateProps {
  selected: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  disabled?: boolean;
  children: React.ReactNode;
  size:
    | "default"
    | "icon"
    | "icon-lg"
    | "icon-sm"
    | "icon-xs"
    | "lg"
    | "sm"
    | "xs"
    | null
    | undefined;
}

export default function DropdownDueDate({
  selected,
  disabled,
  children,
  size,
}: DropdownDueDateProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={size}
          type="button"
          className="flex w-fit max-w-40 justify-start"
          disabled={disabled}
        >
          <Calendar />
          {selected ? selected.toDateString() : "Pick a date"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-full">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
