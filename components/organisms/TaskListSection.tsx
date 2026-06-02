import axios from "axios";
import React from "react";

import { TaskWithCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

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

        <ScrollArea
          className={cn(activeTasks.length >= 5 ? "h-[300px]" : "h-fit")}
        >
          <div className="flex flex-col gap-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className="relative overflow-y-hidden rounded-md border"
              >
                <div
                  className={`bg-${task.category?.color} absolute h-[100px] w-2`}
                />

                <div className="p-4">
                  <h3 className="font-semibold">{task.name}</h3>
                  {task.description && (
                    <CardDescription>{task.description}</CardDescription>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Completed Tasks */}
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold">Completed ({completedTasks.length})</h2>

        <ScrollArea
          className={cn(completedTasks.length >= 5 ? "h-[300px]" : "h-fit")}
        >
          <div className="flex flex-col gap-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="relative overflow-y-hidden rounded-md border"
              >
                <div
                  className={`bg-${task.category?.color} absolute h-[100px] w-2`}
                />

                <div className="p-4">
                  <h3 className="font-semibold">{task.name}</h3>
                  {task.description && (
                    <CardDescription>{task.description}</CardDescription>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
