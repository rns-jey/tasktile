"use client";

import { TaskWithCategory } from "@/types";

import { Skeleton } from "@/components/ui/Skeleton";

import { useTasks } from "@/hooks/useTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import TaskList from "./TaskList";

interface TaskListSectionProps {
  initialTasks: TaskWithCategory[];
}

export default function TaskListSection({
  initialTasks,
}: TaskListSectionProps) {
  const { data: tasks } = useTasks(initialTasks);

  if (!tasks)
    return (
      <div className="my-4 flex flex-col gap-4">
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

  const activeTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const completedTasks = tasks
    .filter((t) => t.completed)
    .sort((a, b) => +new Date(b.completedAt!) - +new Date(a.completedAt!));

  return (
    <Tabs defaultValue="open">
      <TabsList className="w-full">
        <TabsTrigger value="open">
          <span>Open</span>
          <span>{activeTasks.length}</span>
        </TabsTrigger>
        <TabsTrigger value="closed">
          <span>Closed</span>
          <span>{completedTasks.length}</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">
        <TaskList tasks={activeTasks} />
      </TabsContent>
      <TabsContent value="closed">
        <TaskList tasks={completedTasks} />
      </TabsContent>
    </Tabs>
  );
}
