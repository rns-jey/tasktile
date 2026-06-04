import { Calendar } from "lucide-react";
import { Button } from "../ui/Button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

interface DropdownDueDateProps {
  selected: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function DropdownDueDate({
  selected,
  disabled,
  children,
}: DropdownDueDateProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"xs"}
          type="button"
          className="flex w-fit justify-start"
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
