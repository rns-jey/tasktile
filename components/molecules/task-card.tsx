"use client";

import { useState } from "react";

import { Checkbox } from "../atoms/checkbox";
import { Task } from "@prisma/client";
import axios from "axios";
import { Button } from "../atoms/button";
import { Clock, Trash2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../atoms/alert-dialog";
import { toast } from "sonner";
import { Label } from "../atoms/label";
import { differenceInCalendarDays } from "date-fns";

interface TaskCardProps {
  task: Task;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

function formatDueDate(dueDate: Date) {
  const difference = differenceInCalendarDays(dueDate, new Date());
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const label = {
    label: "Due " + formatter.format(difference, "day"),
    color: difference === 0 ? "text-orange-400" : difference > 0 ? "text-blue-500" : difference < 0 && "text-red-500",
  };

  return label;
}

export default function TaskCard({ task, tasks, setTasks }: TaskCardProps) {
  const [isLoading, setLoading] = useState(false);

  async function deleteTask(id: string) {
    try {
      setLoading(true);
      await axios.delete(`/api/task/${task.id}`);

      setTasks(tasks.filter((task) => task.id !== id));
      setLoading(false);
      toast("Task deleted.");
    } catch (error) {
      console.error("Failed to delete task", error);
      setLoading(false);
    }
  }

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

        <div className="space-y-1">
          <Label
            htmlFor={`task-${task.id}`}
            className={cn(task.completed && "line-through text-foreground/50", "text-sm font-semibold cursor-pointer")}
          >
            {task.name}
          </Label>
          <p className={cn(task.completed && "line-through text-foreground/50", "text-xs")}>Task Description</p>
          <div
            className={cn(
              task.dueDate && formatDueDate(task.dueDate).color,
              task.completed && "line-through text-foreground/50",
              "flex gap-1 items-center text-xs"
            )}
          >
            <Clock className="h-3 w-3" />
            <span>{task.dueDate ? formatDueDate(task.dueDate).label : "No due date"}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {task.completed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleClick(task.id)}
            disabled={isLoading}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task and remove it from your task list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTask(task.id)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
