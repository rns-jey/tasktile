"use client";

import PageTitle from "@/components/atoms/PageTitle";
import { useStackTasks } from "@/hooks/useStacks";
import { Stack } from "@/lib/generated/prisma/client";

export default function StackPageHeader({ stack }: { stack: Stack }) {
  const { data: tasks = [] } = useStackTasks(stack.id);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <header>
      <PageTitle title={stack.name} />
      <p className="flex gap-1">
        {completedTasks ? completedTasks.length : 0}
        <span>done</span>
        <span>·</span>
        {activeTasks ? activeTasks.length : 0} open
      </p>
    </header>
  );
}
