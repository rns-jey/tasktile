"use client";

import { Task } from "@prisma/client";
import { CardFooter } from "../atoms/card";

import { Separator } from "../atoms/separator";

import TaskCard from "../molecules/task-card";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const active = tasks.filter((task) => task.complete === false);
  const completed = tasks.filter((task) => task.complete === true);

  return (
    <CardFooter className="flex flex-col gap-2">
      <h3 className="text-lg font-bold">Active</h3>
      {active.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      <Separator />

      <h3 className="text-lg font-bold">Completed</h3>
      {completed.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </CardFooter>
  );
}
