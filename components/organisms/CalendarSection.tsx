"use client";

import { heatClass } from "@/lib/colors";
import { cn } from "@/lib/utils";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
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

type DayData = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  completed: number;
};

type DayStat = {
  _count: { completed: number };
  completedOn: Date | string | null;
};

const legends = [
  { color: "bg-[#ebe5de]", count: "0" },
  { color: "bg-[#f3cbb5]", count: "1-3" },
  { color: "bg-[#eb9a75]", count: "4-6" },
  { color: "bg-[#cf6139]", count: "7-9" },
  { color: "bg-[#963118]", count: "10+" },
];

export default function CalendarSection({ stats }: { stats: DayStat[] }) {
  const countsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of stats) {
      if (!s.completedOn) continue;
      map.set(
        new Date(s.completedOn).toISOString().slice(0, 10),
        s._count.completed,
      );
    }
    return map;
  }, [stats]);

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
          completed: countsByDay.get(key) ?? 0,
        };
      }),
    [currentMonth],
  );

  const selectedDay = days.find((d) => d.key === selected);

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
                day.key === todayKey && "ring-2",
                day.key === selected && "ring-2 ring-offset-2",
                "flex h-full w-full items-start justify-start pt-1 text-xs ring-black",
                differenceInCalendarDays(today, day.date) > 0 &&
                  heatClass(day.completed),
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
            <div
              className={cn(
                heatClass(selectedDay?.completed ?? 0),
                "size-10 shrink-0 rounded-[7px]",
              )}
            />
            <div>
              <p className="text-meta text-muted font-medium">
                {format(
                  parse(selected, "yyyy-MM-dd", new Date()),
                  "EEE d MMMM",
                )}
              </p>
              <p className="font-display text-[26px]">
                {selectedDay?.completed} completed
              </p>
            </div>
          </div>
          <Button variant="ghost">View</Button>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <span>Tasks done</span>
        {legends.map((legend) => (
          <div key={legend.color} className="flex flex-col items-center">
            <div
              className={cn("size-6 shrink-0 rounded-[5px]", legend.color)}
            />
            <p className="text-xs">{legend.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
