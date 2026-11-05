"use client";

import { useTodayTasks } from "@/hooks/useTasks";
import { heatClass } from "@/lib/colors";
import { fromDbDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTodayKey } from "../providers/TodayProvider";

export default function TodayHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const overserver = new IntersectionObserver(([entry]) =>
      setShowBar(!entry.isIntersecting),
    );

    overserver.observe(el);

    return () => overserver.disconnect();
  }, []);

  const todayKey = useTodayKey();
  const today = fromDbDay(`${todayKey}T00:00:00Z`);

  const { data: tasks = [] } = useTodayTasks();

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <Fragment>
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b px-4 py-2",
          showBar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "font-display flex size-11 items-center justify-center rounded-[15px] text-[28px]",
              heatClass(completedTasks ? completedTasks.length : 0),
            )}
          >
            {completedTasks ? completedTasks.length : 0}
          </div>
          <p>Today</p>
        </div>

        <p className="text-body text-muted flex gap-1">
          {completedTasks ? completedTasks.length : 0}
          <span>done today</span>
          <span>·</span>
          {activeTasks ? activeTasks.length : 0} open
        </p>
      </div>

      <header className="flex justify-between" ref={headerRef}>
        <div>
          <h1 className="flex flex-col">
            <span className="text-meta text-muted-2 font-medium tracking-[.08em] uppercase">
              {format(today, "eeee")}
            </span>
            <span className="font-display text-display-lg">
              {format(today, "LLLL d")}
            </span>
          </h1>
          <p className="text-body text-muted flex gap-1">
            {completedTasks ? completedTasks.length : 0}
            <span>done today</span>
            <span>·</span>
            {activeTasks ? activeTasks.length : 0} open
          </p>
        </div>

        <div
          className={cn(
            "font-display flex size-17 items-center justify-center rounded-[15px] text-[28px]",
            heatClass(completedTasks ? completedTasks.length : 0),
          )}
        >
          {completedTasks ? completedTasks.length : 0}
        </div>
      </header>
    </Fragment>
  );
}
