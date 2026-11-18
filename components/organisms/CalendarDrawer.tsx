import { cn } from "@/lib/utils";
import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  format,
  isLastDayOfMonth,
  parse,
  startOfWeek,
} from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Fragment, memo, useMemo, useState } from "react";
import { Button } from "../atoms/Button";
import { useTodayKey } from "../providers/TodayProvider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";
import { Label } from "../ui/Label";
import { ScrollArea } from "../ui/ScrollArea";
import { Separator } from "../ui/Separator";

type DayData = {
  date: Date;
  key: string;
  dayOfMonth: number;
  monthLabel: string | null;
};

type DayCellProps = {
  day: DayData;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (date: Date) => void;
};

const DayCell = memo(function DayCell({
  day,
  isToday,
  isSelected,
  onSelect,
}: DayCellProps) {
  return (
    <Fragment>
      <Button
        type="button"
        variant="ghost"
        className={cn(
          isToday && "bg-jade/30 font-bold",
          isSelected &&
            "ring-offset-jade ring-jade bg-jade ring-1 ring-offset-1",
          "mx-auto size-10 touch-manipulation rounded-sm text-center",
        )}
        onClick={() => onSelect(day.date)}
      >
        {day.dayOfMonth}
      </Button>

      {day.monthLabel && (
        <div className="col-span-7 mt-4 mb-2 space-y-2 last:hidden">
          <Label>{day.monthLabel}</Label>
          <Separator />
        </div>
      )}
    </Fragment>
  );
});

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

type CalendarDrawerProps = {
  value: Date | null;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
};

export default function CalendarDrawer({
  value,
  onChange,
}: CalendarDrawerProps) {
  const todayKey = useTodayKey();
  const today = useMemo(
    () => parse(todayKey, "yyyy-MM-dd", new Date()),
    [todayKey],
  );

  const [date, setDate] = useState<Date | undefined>(value ?? undefined);

  const selected = date ? format(date, "yyyy-MM-dd") : "";

  const days = useMemo<DayData[]>(
    () =>
      eachDayOfInterval({
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfMonth(addYears(today, 2)),
      }).map((d) => ({
        date: d,
        key: format(d, "yyyy-MM-dd"),
        dayOfMonth: d.getDate(),
        monthLabel: isLastDayOfMonth(d)
          ? format(addMonths(d, 1), "MMM yyyy")
          : null,
      })),
    [today],
  );

  return (
    <Drawer>
      <DrawerTrigger
        render={<Button type="button" variant="secondary" className="h-10" />}
      >
        <CalendarIcon /> {value ? format(value, "dd MMM") : "Date"}
      </DrawerTrigger>
      <DrawerContent className="h-[85dvh]">
        <DrawerHeader className="grid grid-cols-3 items-center">
          <DrawerClose>
            <X />
          </DrawerClose>
          <DrawerTitle>Due on ... </DrawerTitle>
          <DrawerClose
            render={<Button onClick={() => onChange(date ?? null)} />}
          >
            Set date
          </DrawerClose>
        </DrawerHeader>

        <div className="flex min-h-0 flex-1 flex-col py-4">
          <Label className="mx-4 border p-2">
            {date ? format(date, "dd MMM") : "Select a date"}
          </Label>

          <div className="mx-auto grid w-full max-w-80 grid-cols-7 border-b py-2">
            {weekDays.map((wd, wdi) => (
              <div key={wdi} className="text-center">
                {wd}
              </div>
            ))}
          </div>

          <ScrollArea className="min-h-0 flex-1 p-4">
            <div className="mx-auto grid max-w-80 grid-cols-7 py-2">
              {days.map((day) => (
                <DayCell
                  key={day.key}
                  day={day}
                  isToday={day.key === todayKey}
                  isSelected={day.key === selected}
                  onSelect={setDate}
                />
              ))}
            </div>
          </ScrollArea>

          {/* <Calendar
            mode="single"
            fixedWeeks
            selected={selected ?? undefined}
            month={currentMonth}
            onSelect={setSelected}
            disabled={{ before: startOfDay(localDay()) }}
            hidden={{ before: startOfDay(localDay()) }}
            className="w-full"
          />

          <div>
            {[
              { label: "Today", value: 0 },
              { label: "Tomorrow", value: 1 },
              { label: "In 3 days", value: 3 },
              { label: "In a week", value: 7 },
              { label: "In 2 weeks", value: 14 },
            ].map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const newDate = addDays(new Date(localDay()), preset.value);
                  setSelected(newDate);
                  setCurrentMonth(
                    new Date(newDate.getFullYear(), newDate.getMonth(), 1),
                  );
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
