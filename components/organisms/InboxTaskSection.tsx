"use client";

import { useInbox } from "@/hooks/useTasks";
import TaskList from "./TaskList";

export default function InboxTaskSection() {
  const { data: tasks = [] } = useInbox();

  return (
    <div className="flex flex-col">
      <TaskList tasks={tasks} />
    </div>
  );
}
