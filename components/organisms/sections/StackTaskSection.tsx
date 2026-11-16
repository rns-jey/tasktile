"use client";

import { useStackTasks } from "@/hooks/useStacks";
import TaskList from "../TaskList";

export default function StackTaskSection({ stackId }: { stackId: string }) {
  const { data: tasks = [] } = useStackTasks(stackId);

  return <TaskList tasks={tasks} />;
}
