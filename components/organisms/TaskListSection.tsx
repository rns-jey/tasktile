"use client";

import { useTasks } from "@/hooks/useTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import TaskList from "./TaskList";

export default function TaskListSection() {
  const { data: tasks = [] } = useTasks();

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

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
