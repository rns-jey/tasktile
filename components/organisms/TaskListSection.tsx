"use client";

import { TaskWithCategory } from "@/types";

import { Skeleton } from "@/components/ui/Skeleton";
import { useTasks } from "@/hooks/useTasks";
import { cn, formatDueDate } from "@/lib/utils";

import { useState } from "react";
import TaskMeta from "../molecules/TaskMeta";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";

interface TaskListSectionProps {
  initialTasks: TaskWithCategory[];
}

export default function TaskListSection({
  initialTasks,
}: TaskListSectionProps) {
  const [visible, setVisible] = useState<boolean>(false);

  const { data: tasks } = useTasks(initialTasks);

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
    // <div className="my-4 flex flex-col gap-4">
    //   {/* Active Tasks */}
    //   <div className="flex flex-col gap-3">
    //     {activeTasks.length > 0 ? (
    //       <ScrollArea
    //         className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}
    //       >
    //         <div className="flex flex-col gap-2">
    //           <AnimatePresence>
    //             {activeTasks.map((task) => (
    //               <TaskCard key={task.id} task={task} />
    //             ))}
    //           </AnimatePresence>
    //         </div>
    //       </ScrollArea>
    //     ) : (
    //       <p className="text-muted-foreground py-3 text-center text-sm">
    //         No active tasks. Add a new task to get started!
    //       </p>
    //     )}
    //   </div>

    //   {/* Completed Tasks */}
    //   <div className="flex flex-col gap-3">
    //     <h2 className="font-semibold">Done today · {completedTasks.length}</h2>

    //     {activeTasks.length > 0 ? (
    //       <ScrollArea
    //         className={cn(completedTasks.length >= 5 ? "h-[300px]" : "h-fit")}
    //       >
    //         <div className="flex flex-col gap-2">
    //           {completedTasks.map((task) => (
    //             <TaskCard key={task.id} task={task} />
    //           ))}
    //         </div>
    //       </ScrollArea>
    //     ) : (
    //       <p className="text-muted-foreground py-3 text-center text-sm">
    //         No completed tasks yet.
    //       </p>
    //     )}
    //   </div>
    // </div>

    <div>
      {activeTasks.map((task, i) => {
        const due = task.dueDate ? formatDueDate(task.dueDate) : null;

        return (
          <div
            key={i}
            className="border-line flex h-16 items-center gap-3.5 border-b"
          >
            <span className="text-subtle w-[18px] font-mono text-xs">00</span>
            <Checkbox className="rounded-check ring-stroke size-6 ring-[1.75px] ring-inset" />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-task truncate font-medium">
                {task.name}
              </span>

              <TaskMeta task={task} />
            </div>
          </div>
        );
      })}

      <Card className="bg-paper-2 my-4">
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
            Show
          </Button>
        </CardContent>
      </Card>

      <div className={cn(visible ? "flex flex-col" : "hidden")}>
        {completedTasks.map((task, i) => (
          <div
            key={i}
            className="border-line mx-5 flex h-14 items-center justify-between gap-3.5"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Checkbox
                checked
                className="rounded-check bg-accent size-6 text-white"
              />
              <span className="text-task text-muted truncate font-medium line-through">
                {task.name}
              </span>
            </div>
            {task.category && (
              <div className="h-2 min-w-2 rounded-xs bg-blue-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
