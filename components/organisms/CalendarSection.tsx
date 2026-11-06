"use client";

import { useStats } from "@/hooks/useStats";
import { getTasksForDayAction } from "@/lib/actions/tasks";
import { heatClass } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
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
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import TaskMeta from "../molecules/TaskMeta";
import { useTodayKey } from "../providers/TodayProvider";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/Drawer";
import { Skeleton } from "../ui/Skeleton";

type DayData = {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  completed: number;
};

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const legends = [
  { min: 0, label: "0" },
  { min: 1, label: "1-3" },
  { min: 4, label: "4-6" },
  { min: 7, label: "7-9" },
  { min: 10, label: "10+" },
];

export default function CalendarSection() {
  const [showTasks, setShowTasks] = useState<boolean>(false);

  const { data: stats = [] } = useStats();

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
    [currentMonth, countsByDay],
  );

  const { monthTotal, activeDays } = useMemo(() => {
    let monthTotal = 0;
    let activeDays = 0;

    for (const day of days) {
      if (!day.isCurrentMonth) continue;

      monthTotal += day.completed;

      if (day.completed > 0) activeDays++;
    }

    return { monthTotal, activeDays };
  }, [days]);

  const selectedCount = countsByDay.get(selected) ?? 0;

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", "day", selected],
    queryFn: () => getTasksForDayAction(selected),
    staleTime: 5 * 60 * 1000,
    enabled: showTasks && selectedCount > 0, // only runs once View is pressed
  });

  return (
    <div className="space-y-2 px-2">
      <div className="mx-auto flex items-center justify-between">
        <div>
          <h2>{format(currentMonth, "MMMM")}</h2>
          <p>
            {format(currentMonth, "yyyy")} · {monthTotal} done across{" "}
            {activeDays} days
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            type="button"
            variant={"outline"}
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
                !isSameMonth(day.date, currentMonth) && "",
                day.key === todayKey && "ring-2",
                day.key === selected && "ring-2 ring-offset-2",
                "flex h-full w-full items-start justify-start pt-1 text-xs ring-black",
                differenceInCalendarDays(today, day.date) >= 0 &&
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
                heatClass(selectedCount),
                "size-10 shrink-0 rounded-[7px]",
              )}
            />
            <div>
              <p className="text-meta font-medium">
                {format(
                  parse(selected, "yyyy-MM-dd", new Date()),
                  "EEE d MMMM",
                )}
              </p>
              <p className="font-display text-[26px]">
                {selectedCount} completed
              </p>
            </div>
          </div>
          <Drawer open={showTasks} onOpenChange={setShowTasks} showSwipeHandle>
            <DrawerTrigger
              render={
                <Button variant="ghost" type="button">
                  View
                </Button>
              }
            />
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>
                  {format(
                    parse(selected, "yyyy-MM-dd", new Date()),
                    "EEE d MMMM",
                  )}
                </DrawerTitle>
              </DrawerHeader>
              {selectedCount === 0 ? (
                <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                  Nothing was completed on this day.
                </div>
              ) : isLoading ? (
                <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                  <p>Completed · {selectedCount}</p>

                  <div className="mb-2 min-h-0 flex-1 overflow-y-auto">
                    {Array.from({ length: selectedCount }).map((_, i) => (
                      <article
                        key={i}
                        className="border-line flex h-16 items-center gap-2 border-b px-2"
                      >
                        <Skeleton className="size-4" />

                        <Skeleton className="size-6" />

                        <Skeleton className="h-6 w-28" />
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                tasks && (
                  <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
                    <p>Completed · {tasks.length}</p>

                    <div className="mb-2 min-h-0 flex-1 overflow-y-auto">
                      {tasks.map((t) => (
                        <article
                          key={t.id}
                          className="border-line flex h-16 items-center gap-2 border-b px-2 hover:bg-white"
                        >
                          <Check />
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <p className="text-task w-full truncate font-medium">
                              {t.name}
                            </p>
                            <TaskMeta task={t} />
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )
              )}
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <span>Tasks done</span>
        {legends.map((legend) => (
          <div key={legend.label} className="flex flex-col items-center">
            <div
              className={cn(
                "size-6 shrink-0 rounded-[5px]",
                heatClass(legend.min),
              )}
            />
            <p className="text-xs">{legend.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
