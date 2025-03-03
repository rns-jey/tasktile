"use client";

import { Task } from "@prisma/client";
import { Card, CardContent, CardFooter } from "../atoms/card";

import { useRouter } from "next/navigation";
import CheckBoxForm from "../molecules/checkbox-form";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const router = useRouter();

  return (
    <CardFooter className="flex flex-col gap-2">
      {tasks.map((task) => (
        <Card key={task.id} className="w-full">
          <CardContent className="flex items-center space-x-2">
            <CheckBoxForm task={task} />
          </CardContent>
        </Card>
      ))}
    </CardFooter>
  );
}
