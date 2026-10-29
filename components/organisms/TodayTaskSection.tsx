"use client";

import { TaskWithCategory } from "@/types";

import { Skeleton } from "@/components/ui/Skeleton";

import { useTodayTasks } from "@/hooks/useTasks";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import TaskList from "./TaskList";

interface TaskListSectionProps {
  initialTasks: TaskWithCategory[];
}

export default function TodayTaskSection({
  initialTasks,
}: TaskListSectionProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const { data: tasks } = useTodayTasks(initialTasks);

  if (!tasks)
    return (
      <div className="my-4 flex flex-col gap-4">
        {/* Active Tasks */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-16" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="flex flex-col">
      <TaskList tasks={activeTasks} />

      <Card className="bg-paper-2 mx-2 my-4">
        <CardContent className="flex items-center justify-between">
          <span className="font-medium tracking-[.08em] uppercase">
            DONE TODAY · {completedTasks.length}
          </span>

          <Button
            variant={"ghost"}
            type="button"
            onClick={() => setVisible(!visible)}
            className="text-accent text-[15px] font-semibold"
          >
            {visible ? "Hide" : "Show"}
          </Button>
        </CardContent>
      </Card>

      <div hidden={!visible}>
        <TaskList tasks={completedTasks} variant="compact" />
      </div>
    </div>
  );
}
