import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

interface DropdownDueDateProps {
  selected: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  disabled?: boolean;
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

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DropdownDueDate({
  selected,
  setDate,
  disabled,
  size,
}: DropdownDueDateProps) {
  const [isOpen, setOpenClose] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startPadding = firstDay.getDay();
    const days = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0);

    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay.getDate() - i);
      const dateStr = date.toDateString();

      days.push({
        date,
        isCurrentMonth: false,
      });
    }

    // Add actual days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();

      days.push({
        date,

        isCurrentMonth: true,
      });
    }

    // Add days from next month to fill the grid (always 6 rows = 42 cells)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toDateString();

      days.push({
        date,

        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpenClose}>
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
        <div className="w-full space-y-2 p-2">
          {/* Month Navigation */}
          <div className="flex w-full items-center gap-2">
            <Button variant={"outline"} size={"icon-sm"}>
              <ChevronLeft />
            </Button>
            <Button
              variant={"ghost"}
              size={"xs"}
              className="flex-1 text-sm font-semibold"
            >
              June 2026
            </Button>
            <Button variant={"outline"} size={"icon-sm"}>
              <ChevronRight />
            </Button>
          </div>

          {/* Week Day Headers */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-muted-foreground py-1 text-center text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => (
              <div key={index} className="aspect-square">
                <Button
                  variant={"ghost"}
                  size={"icon-xs"}
                  disabled={isPast(day.date)}
                  onClick={() => {
                    setDate(new Date(day.date));
                  }}
                  type="button"
                  className={cn(
                    "dark:hover:bg-accent flex h-full w-full items-center justify-center text-sm font-semibold",
                    isToday(day.date) && "bg-accent",
                    selected &&
                      isSameDay(day.date, selected) &&
                      "bg-gray-300 text-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-700",
                    !day.isCurrentMonth && "text-muted-foreground",
                    !day.isCurrentMonth &&
                      selected &&
                      isSameDay(day.date, selected) &&
                      "text-gray-700",
                  )}
                >
                  {day.date.getDate()}
                </Button>
              </div>
            ))}
          </div>

          {/* Calendar Buttons */}
          <div className="flex justify-between gap-1">
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                setDate(null);
                setOpenClose(false);
              }}
            >
              No due date
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                setDate(new Date());
                setOpenClose(false);
              }}
            >
              Today
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDate(tomorrow);
                setOpenClose(false);
              }}
            >
              Tomorrow
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
