"use client";

import { cn } from "@/lib/utils";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTodayKey } from "../providers/TodayProvider";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

interface DayData {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
}

export default function CalendarSection() {
  const weekDays = ["M", "T", "W", "TH", "F", "S", "S"];

  const todayKey = useTodayKey();

  const [selected, setSelected] = useState(todayKey);

  const today = useMemo(
    () => parse(todayKey, "yyyy-MM-dd", new Date()),
    [todayKey],
  );

  const [currentMonth, setCurrentMonth] = useState(today);

  const days = useMemo<DayData[]>(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
      }).map((date) => {
        const key = format(date, "yyyy-MM-dd");

        return {
          date,
          key,
          isCurrentMonth: isSameMonth(date, currentMonth),
        };
      }),
    [currentMonth],
  );

  return (
    <div className="space-y-2 px-2">
      <div className="mx-auto flex items-center justify-between">
        <div>
          <h2>{format(currentMonth, "MMMM")}</h2>
          <p>{format(currentMonth, "yyyy")} · 49 done across 13 days</p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={"outline"}
            size={"icon-xl"}
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            type="button"
            variant={"outline"}
            size={"icon-xl"}
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            disabled={isSameMonth(today, currentMonth)}
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </div>

      <div className="mx-auto grid w-full grid-cols-7 gap-1.5">
        {weekDays.map((wd, i) => (
          <p key={i} className="w-full text-center">
            {wd}
          </p>
        ))}
      </div>

      <div className="mx-auto grid w-full grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day.key} className="aspect-square text-right">
            <Button
              variant="outline"
              size="lg"
              disabled={differenceInCalendarDays(day.date, today) > 0}
              className={cn(
                !isSameMonth(day.date, currentMonth) && "text-muted",
                isSameDay(day.date, today) && "ring-2",
                isSameDay(day.date, selected) && "ring-2 ring-offset-2",
                "flex h-full w-full items-start justify-start pt-1 text-xs",
              )}
              onClick={() => setSelected(day.key)}
            >
              {day.date.getDate()}
            </Button>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 shrink-0 rounded-[7px] bg-red-500" />
            <div>
              <p>
                {format(
                  parse(selected, "yyyy-MM-dd", new Date()),
                  "EEE d MMMM",
                )}
              </p>
              <p>3 completed</p>
            </div>
          </div>
          <Button variant="ghost">View</Button>
        </CardContent>
      </Card>
    </div>
  );
}
