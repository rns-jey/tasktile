"use client";

import { useInbox } from "@/hooks/useTasks";
import TaskList from "../TaskList";

export default function InboxTaskSection() {
  const { data: tasks = [] } = useInbox();

  return <TaskList tasks={tasks} />;
}
