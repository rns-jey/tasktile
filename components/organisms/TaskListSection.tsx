"use client";

import { TaskWithCategory } from "@/types";

import { Skeleton } from "@/components/ui/Skeleton";

import { cn } from "@/lib/utils";

import { useTodayTasks } from "@/hooks/useTasks";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import OpenTaskCard from "../molecules/OpenTaskCard";
import ToggleTask from "../molecules/ToggleTask";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

interface TaskListSectionProps {
  initialTasks: TaskWithCategory[];
}

export default function TaskListSection({
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

    <div className="flex flex-col">
      <AnimatePresence initial={false}>
        {activeTasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OpenTaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>

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
            Show
          </Button>
        </CardContent>
      </Card>

      <div className={cn(visible ? "flex flex-col" : "hidden", "w-full")}>
        {completedTasks.map((task, i) => (
          <div
            key={i}
            className="border-line mx-5 flex h-14 items-center justify-between gap-3.5"
          >
            <div className="flex min-w-0 items-center gap-2">
              <ToggleTask task={task} />
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
