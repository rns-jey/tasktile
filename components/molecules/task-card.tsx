"use client";

import { useState } from "react";

import { Checkbox } from "../atoms/checkbox";
import { Task } from "@prisma/client";
import axios from "axios";
import { Button } from "../atoms/button";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TaskCard({ task, tasks, setTasks }: TaskCardProps) {
  const [isLoading, setLoading] = useState(false);

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  async function handleClick(id: string) {
    try {
      setLoading(true);
      await axios.patch(`/api/task/${task.id}`, { completed: !task.completed });

      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));

      setLoading(false);
    } catch (error) {
      console.error("Failed to update task", error);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => handleClick(task.id)}
          disabled={isLoading}
          className="cursor-pointer"
        />
        <label htmlFor={`task-${task.id}`} className="text-sm font-medium cursor-pointer">
          {task.name}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTask(task.id)}
        disabled={isLoading}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
}
