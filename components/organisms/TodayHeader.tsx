"use client";

import { useTodayTasks } from "@/hooks/useTasks";
import { TaskWithCategory } from "@/types";
import { format } from "date-fns";

export default function TodayHeader({
  initialTasks,
}: {
  initialTasks: TaskWithCategory[];
}) {
  const today = new Date();

  const { data: tasks } = useTodayTasks(initialTasks);

  const activeTasks = tasks?.filter((task) => !task.completed);
  const completedTasks = tasks?.filter((task) => task.completed);

  return (
    <header className="flex justify-between pb-4">
      <div>
        <h1 className="flex flex-col">
          <span className="text-meta text-muted-2 font-medium tracking-[.08em] uppercase">
            {format(today, "eeee").toUpperCase()}
          </span>
          <span className="font-display text-display-lg">
            {format(today, "LLLL d")}
          </span>
        </h1>
        <p className="text-body text-muted">
          {completedTasks ? completedTasks.length : 0} done today ·
          {activeTasks ? activeTasks.length : 0} open
        </p>
      </div>

      <div className="bg-paper-3 font-display flex size-17 items-center justify-center rounded-[15px] text-[28px]">
        {completedTasks ? completedTasks.length : 0}
      </div>
    </header>
  );
}
