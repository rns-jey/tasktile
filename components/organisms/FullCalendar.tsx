"use client";

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
  CircleSlash,
  Clock3Icon,
  HourglassIcon,
  Sun,
  TimerIcon,
} from "lucide-react";
import { Fragment, memo, useMemo } from "react";
import { Button } from "../atoms/Button";
import { useTodayKey } from "../providers/TodayProvider";
import { DrawerClose } from "../ui/Drawer";
import { Label } from "../ui/Label";
import { Separator } from "../ui/Separator";

const buttons = [
  { icon: Sun, label: "Today", difference: 0 },
  { icon: AlarmClockIcon, label: "Tomorrow", difference: 1 },
  { icon: Clock3Icon, label: "In 3 days", difference: 3 },
  { icon: HourglassIcon, label: "In a week", difference: 7 },
  { icon: TimerIcon, label: "In 2 weeks", difference: 14 },
];

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

type FullCalendarProps = {
  selected: Date | null;
  onSelect: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function FullCalendar({
  selected,
  onSelect,
}: FullCalendarProps) {
  const todayKey = useTodayKey();
  const today = useMemo(
    () => parse(todayKey, "yyyy-MM-dd", new Date()),
    [todayKey],
  );

  const selectedKey = selected && format(selected, "yyyy-MM-dd");

  const scrollToDate = (dateId: string) =>
    requestAnimationFrame(() =>
      document
        .getElementById(dateId)
        ?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );

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

  return (
    <Fragment>
      <div className="flex flex-col gap-1">
        {buttons.map((btn, i) => (
          <Button
            key={`btn_${i}`}
            type="button"
            variant="outline"
            className="h-8 justify-between"
            onClick={() => {
              const newDate = addDays(today, btn.difference);
              onSelect(newDate);
              scrollToDate(`date_${format(newDate, "yyyy-MM-dd")}`);
            }}
          >
            <div className="flex items-center gap-2">
              <btn.icon />
              <span>{btn.label}</span>
            </div>
            <span>{format(addDays(today, btn.difference), "dd MMM")}</span>
          </Button>
        ))}

        <DrawerClose
          render={
            <Button
              type="button"
              variant="outline"
              className="h-8 justify-between"
              onClick={() => onSelect(null)}
            />
          }
        >
          <div className="flex items-center gap-2">
            <CircleSlash />
            <span>No due date</span>
          </div>
        </DrawerClose>
      </div>

      <div className="mx-auto grid max-w-80 grid-cols-7 py-2">
        {days.map((day) => (
          <DayCell
            key={day.key}
            id={`date_${day.key}`}
            day={day}
            disabled={differenceInDays(today, day.date) > 0}
            isToday={day.key === todayKey}
            isSelected={day.key === selectedKey}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Fragment>
  );
}
