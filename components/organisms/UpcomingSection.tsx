"use client";

import { useUpcoming } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";
import { TaskWithCategory } from "@/types";
import {
  addDays,
  addYears,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameYear,
  parse,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";
import { Button } from "../atoms/Button";
import TaskCard from "../molecules/TaskCard";
import { useTodayKey } from "../providers/TodayProvider";

type DayData = {
  date: Date;
  key: string;
};

type TaskDayData = {
  date: Date;
  key: string;
  tasks: TaskWithCategory[];
};

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export default function UpcomingSection() {
  const { data: tasks = [] } = useUpcoming();

  const todayKey = useTodayKey();
  const today = useMemo(
    () => parse(todayKey, "yyyy-MM-dd", new Date()),
    [todayKey],
  );

  const [currentWeek, setCurrentWeek] = useState(today);
  const [selected, setSelected] = useState(todayKey);

  const days = useMemo<DayData[]>(
    () =>
      eachDayOfInterval({
        start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
        end: endOfWeek(currentWeek, { weekStartsOn: 1 }),
      }).map((date) => {
        const key = format(date, "yyyy-MM-dd");

        return {
          date,
          key,
        };
      }),
    [currentWeek],
  );

  const tasksByDay = useMemo(() => {
    const map = new Map<string, TaskWithCategory[]>();

    for (const t of tasks) {
      if (!t.dueOn) continue;

      const key = format(t.dueOn, "yyyy-MM-dd");
      const list = map.get(key) ?? [];
      list.push(t);
      map.set(key, list);
    }

    return map;
  }, [tasks]);

  const daysofYear = useMemo<TaskDayData[]>(
    () =>
      eachDayOfInterval({
        start: addDays(today, 1),
        end: addYears(today, 1),
      }).map((date) => {
        const key = format(date, "yyyy-MM-dd");

        return {
          date,
          key,
          tasks: tasksByDay.get(key) ?? [],
        };
      }),
    [tasks],
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="grid grid-cols-7 place-content-center text-center">
          {weekDays.map((wd, wdi) => (
            <div key={wdi} className="w-11">
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 place-content-center text-center">
          {days.map((day, day_i) => (
            <Button
              key={day_i}
              type="button"
              variant="ghost"
              disabled={differenceInCalendarDays(today, day.date) > 0}
              className={cn(
                day.key === todayKey && "bg-jade/30 font-bold",
                day.key === selected &&
                  "ring-offset-paper ring-2 ring-offset-2",
                "size-11",
              )}
              onClick={() => setSelected(day.key)}
            >
              {day.date.getDate()}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {daysofYear.map((day) => (
          <div key={day.key}>
            <div className="bg-muted w-full px-2 py-1 text-sm font-semibold">
              <span className="tabular-nums">
                {format(
                  day.key,
                  isSameYear(day.date, today) ? "dd MMM" : "dd MMM yyyy",
                )}
              </span>

              {differenceInCalendarDays(day.date, today) === 1 ? (
                <>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground/50 mx-1.5"
                  >
                    ·
                  </span>
                  <span>Tomorrow</span>
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground/50 mx-1.5"
                  >
                    ·
                  </span>
                </>
              ) : (
                <span
                  aria-hidden="true"
                  className="text-muted-foreground/50 mx-1.5"
                >
                  ·
                </span>
              )}

              <span>{format(day.key, "EEEE")}</span>
            </div>

            <div>
              {day.tasks.map((task, i) => (
                <TaskCard key={task.id} task={task} priority={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
