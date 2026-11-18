import { cn } from "@/lib/utils";
import {
  addDays,
  addMonths,
  addYears,
  differenceInDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isLastDayOfMonth,
  parse,
  startOfWeek,
} from "date-fns";
import {
  AlarmClockIcon,
  CalendarIcon,
  CircleSlash,
  Clock3Icon,
  HourglassIcon,
  Sun,
  TimerIcon,
  X,
} from "lucide-react";
import { Fragment, memo, useMemo, useState } from "react";
import { Button } from "../atoms/Button";
import CalendarLabel from "../molecules/CalendarLabel";
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
  id: string;
  isToday: boolean;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (date: Date) => void;
};

const DayCell = memo(function DayCell({
  day,
  id,
  isToday,
  isSelected,
  disabled,
  onSelect,
}: DayCellProps) {
  return (
    <Fragment>
      <Button
        id={id}
        type="button"
        variant="ghost"
        disabled={disabled}
        className={cn(
          isToday && "bg-jade/30 font-bold",
          isSelected &&
            "ring-offset-jade ring-jade bg-jade ring-1 ring-offset-1",
          "mx-auto size-10 touch-manipulation scroll-mb-50 rounded-sm text-center",
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

const buttons = [
  { icon: Sun, label: "Today", difference: 0 },
  { icon: AlarmClockIcon, label: "Tomorrow", difference: 1 },
  { icon: Clock3Icon, label: "In 3 days", difference: 3 },
  { icon: HourglassIcon, label: "In a week", difference: 7 },
  { icon: TimerIcon, label: "In 2 weeks", difference: 14 },
];

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
        disabled: differenceInDays(d, today) > 0,
      })),
    [today],
  );

  const scrollToDate = (dateId: string) =>
    requestAnimationFrame(() =>
      document
        .getElementById(dateId)
        ?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );

  return (
    <Drawer>
      <DrawerTrigger
        render={<Button type="button" variant="secondary" className="h-10" />}
      >
        <CalendarIcon /> {value ? format(value, "dd MMM") : "Date"}
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
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
            <CalendarLabel date={date ?? null} />
          </Label>

          <div className="mx-auto grid w-full max-w-80 grid-cols-7 border-b py-2">
            {weekDays.map((wd, wdi) => (
              <div key={wdi} className="text-center">
                {wd}
              </div>
            ))}
          </div>

          <ScrollArea className="min-h-0 flex-1 p-4">
            <div className="flex flex-col gap-1">
              {buttons.map((btn, i) => (
                <Button
                  key={`btn_${i}`}
                  type="button"
                  variant="outline"
                  className="h-8 justify-between"
                  onClick={() => {
                    const newDate = addDays(today, btn.difference);
                    setDate(newDate);
                    scrollToDate(`date_${format(newDate, "yyyy-MM-dd")}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <btn.icon />
                    <span>{btn.label}</span>
                  </div>
                  <span>
                    {format(addDays(today, btn.difference), "dd MMM")}
                  </span>
                </Button>
              ))}
              {value && (
                <DrawerClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 justify-between"
                      onClick={() => onChange(null)}
                    />
                  }
                >
                  <div className="flex items-center gap-2">
                    <CircleSlash />
                    <span>No due date</span>
                  </div>
                </DrawerClose>
              )}
            </div>
            <div className="mx-auto grid max-w-80 grid-cols-7 py-2">
              {days.map((day) => (
                <DayCell
                  key={day.key}
                  id={`date_${day.key}`}
                  day={day}
                  disabled={differenceInDays(today, day.date) > 0}
                  isToday={day.key === todayKey}
                  isSelected={day.key === selected}
                  onSelect={setDate}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
