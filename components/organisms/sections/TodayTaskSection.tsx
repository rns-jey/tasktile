"use client";

import { useTodayTasks } from "@/hooks/useTasks";
import TaskList from "../TaskList";

export default function TodayTaskSection() {
  const { data: tasks = [] } = useTodayTasks();

  return <TaskList tasks={tasks} />;
}
