import axios from "axios";

import { TaskWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

import { ScrollArea } from "@/components/ui/ScrollArea";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

import TaskCard from "@/components/molecules/TaskCard";
import { AnimatePresence } from "motion/react";

export default function TaskListSection() {
  const { data: tasks } = useQuery<TaskWithCategory[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get("/api/tasks");

      return response.data;
    },
  });

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
    <div className="my-4 flex flex-col gap-4">
      {/* Active Tasks */}
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">TO DO ({activeTasks.length})</h2>

        {activeTasks.length > 0 ? (
          <ScrollArea
            className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}
          >
            <AnimatePresence initial={false}>
              <div className="flex flex-col gap-2">
                {activeTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </AnimatePresence>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground py-3 text-center text-sm">
            No active tasks. Add a new task to get started!
          </p>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">Completed ({completedTasks.length})</h2>

        {activeTasks.length > 0 ? (
          <ScrollArea
            className={cn(completedTasks.length >= 5 ? "h-[300px]" : "h-fit")}
          >
            <div className="flex flex-col gap-2">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground py-3 text-center text-sm">
            No completed tasks yet.
          </p>
        )}
      </div>
    </div>
  );
}
