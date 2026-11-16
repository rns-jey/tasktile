"use client";

import { useTodayTasks } from "@/hooks/useTasks";
import TaskList from "./TaskList";

export default function TodayTaskSection() {
  const { data: tasks = [] } = useTodayTasks();

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const orderedTasks = [...activeTasks, ...completedTasks];

  return <TaskList tasks={orderedTasks} />;
}
