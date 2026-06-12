import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Calendar } from "../ui/Calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

interface DatePickerProps {
  size?:
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
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  disabled?: boolean;
}

export default function DatePicker({
  size,
  value,
  onChange,
  disabled,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          type="button"
          className="flex justify-start"
          size={size}
          disabled={disabled}
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="flex w-auto flex-col items-center justify-center gap-1"
      >
        <Calendar mode="single" selected={value} onSelect={onChange} />
        <div className="flex justify-between gap-1">
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => {
              onChange(undefined);
              setIsOpen(false);
            }}
          >
            No due date
          </Button>
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => {
              onChange(new Date());
              setIsOpen(false);
            }}
          >
            Today
          </Button>
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => {
              onChange(addDays(new Date(), 1));
              setIsOpen(false);
            }}
          >
            Tomorrow
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
